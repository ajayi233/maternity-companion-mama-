interface TextRequest {
  input_type: "text";
  text: string;
  due_month?: number;
  due_year?: number;
}

interface AudioRequest {
  input_type: "audio";
  audio_data: string;
  audio_format: "mp3";
  due_month?: number;
  due_year?: number;
}

interface TextResponse {
  text: string;
  language: string;
}

interface AudioResponse {
  transcript: string;
  text_response: string;
  language: string;
  audio_base64: string;
}

interface GhanaNLPTranscribeResponse {
  transcript: string;
}

interface GhanaNLPTranslateRequest {
  in: string;
  lang: string;
}

interface GhanaNLPTranslateResponse {
  translation: string;
}

interface GhanaNLPTTSRequest {
  text: string;
  language: string;
  speaker_id: string;
}

const API_URL =
  "https://is3v3ljqmbprnlleccmwgsgu7e0kkumt.lambda-url.eu-west-1.on.aws/";

const GHANA_NLP_BASE_URL = import.meta.env.VITE_GHANA_NLP_API_BASE_URL;
const GHANA_NLP_SUBSCRIPTION_KEY = import.meta.env.VITE_GHANA_NLP_SUBSCRIPTION_KEY;

export const sendTextQuery = async (
  text: string,
  dueDate?: string
): Promise<TextResponse> => {
  const payload: TextRequest = {
    input_type: "text",
    text: text,
  };

  if (dueDate) {
    const date = new Date(dueDate);
    payload.due_month = date.getMonth() + 1;
    payload.due_year = date.getFullYear();
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

// Test function to verify the subscription key works
const testGhanaNLPKey = async (): Promise<boolean> => {
  try {
    const testPayload = {
      in: "Hello",
      lang: "en-tw"
    };
    
    const response = await fetch(`${GHANA_NLP_BASE_URL}/v1/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': GHANA_NLP_SUBSCRIPTION_KEY,
      },
      body: JSON.stringify(testPayload),
    });
    
    console.log('Key test response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Key test error:', errorText);
    }
    return response.ok;
  } catch (error) {
    console.error('Key test failed:', error);
    return false;
  }
};

const transcribeAudioWithGhanaNLP = async (
  audioBlob: Blob,
  language: string
): Promise<string> => {
  console.log('Ghana NLP Base URL:', GHANA_NLP_BASE_URL);
  console.log('Ghana NLP Key exists:', !!GHANA_NLP_SUBSCRIPTION_KEY);
  console.log('Ghana NLP Key value:', GHANA_NLP_SUBSCRIPTION_KEY);
  
  // Test the key first
  const keyValid = await testGhanaNLPKey();
  console.log('Key validation result:', keyValid);
  
  const response = await fetch(
    `${GHANA_NLP_BASE_URL}/asr/v1/transcribe?language=${language}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/mpeg',
        'Ocp-Apim-Subscription-Key': GHANA_NLP_SUBSCRIPTION_KEY,
        'Cache-Control': 'no-cache',
      },
      body: audioBlob,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Ghana NLP ASR Error:', response.status, errorText);
    throw new Error(`Ghana NLP transcription failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('ASR Response:', data);
  // Ghana NLP ASR returns the transcript as a direct string
  return typeof data === 'string' ? data : (data.transcript || data.text || data.result);
};

const translateTextWithGhanaNLP = async (
  text: string,
  langPair: string
): Promise<string> => {
  const payload: GhanaNLPTranslateRequest = {
    in: text,
    lang: langPair,
  };

  console.log('Translation request:', { text, langPair, payload });
  
  const response = await fetch(`${GHANA_NLP_BASE_URL}/v1/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': GHANA_NLP_SUBSCRIPTION_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Translation error details:', response.status, errorText);
    throw new Error(`Ghana NLP translation failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('Translation Response:', data);
  // Handle both string response and object response
  return typeof data === 'string' ? data : (data.translation || data.out || data.result);
};

const synthesizeSpeechWithGhanaNLP = async (
  text: string,
  language: string,
  speakerId: string
): Promise<string> => {
  const payload: GhanaNLPTTSRequest = {
    text,
    language,
    speaker_id: speakerId,
  };

  console.log('TTS request:', payload);
  
  const response = await fetch(`${GHANA_NLP_BASE_URL}/tts/v1/synthesize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': GHANA_NLP_SUBSCRIPTION_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('TTS error details:', response.status, errorText);
    throw new Error(`Ghana NLP TTS failed: ${response.status}`);
  }

  const audioBlob = await response.blob();
  console.log('TTS audio blob size:', audioBlob.size, 'type:', audioBlob.type);
  console.log('TTS response is .wav format from Ghana NLP API');
  
  // Create a proper audio blob with correct MIME type
  const properAudioBlob = new Blob([audioBlob], { type: 'audio/wav' });
  const arrayBuffer = await properAudioBlob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const binaryString = Array.from(uint8Array, (byte) =>
    String.fromCharCode(byte)
  ).join('');
  const base64Audio = btoa(binaryString);
  console.log('TTS base64 audio length:', base64Audio.length);
  return base64Audio;
};

export const sendAudioQuery = async (
  audioBlob: Blob,
  dueDate?: string,
  selectedLocalLanguage?: string | null
): Promise<AudioResponse> => {
  // If Twi or Eve is selected, use Ghana NLP pipeline
  if (selectedLocalLanguage === 'Twi' || selectedLocalLanguage === 'Eve') {
    try {
      const isEve = selectedLocalLanguage === 'Eve';
      const langCode = isEve ? 'ee' : 'tw';
      const langPair = isEve ? 'ee-en' : 'tw-en';
      const reverseLangPair = isEve ? 'en-ee' : 'en-tw';
      const speakerId = isEve ? 'ewe_speaker_3' : 'twi_speaker_7';
      
      // Step 1: Transcribe audio to text
      const transcript = await transcribeAudioWithGhanaNLP(audioBlob, langCode);
      console.log(`Transcribed ${selectedLocalLanguage} text:`, transcript);
      
      if (!transcript || transcript.trim() === '') {
        throw new Error('Empty transcription result');
      }
      
      // Step 2: Translate to English
      const englishText = await translateTextWithGhanaNLP(transcript, langPair);
      console.log('Translated English text:', englishText);
      
      // Step 3: Send English text to Lambda function
      const englishResponse = await sendTextQuery(englishText, dueDate);
      console.log('Lambda response:', englishResponse);
      
      // Step 4: Translate English response back to local language
      const responseText = englishResponse.text || englishResponse.response || englishResponse.message;
      console.log('Response text to translate:', responseText);
      const localResponse = await translateTextWithGhanaNLP(responseText, reverseLangPair);
      
      // Step 5: Synthesize response to audio
      const audioBase64 = await synthesizeSpeechWithGhanaNLP(
        localResponse,
        langCode,
        speakerId
      );
      
      return {
        transcript: transcript,
        text_response: localResponse,
        language: langCode,
        audio_base64: audioBase64,
      };
    } catch (error) {
      console.error('Ghana NLP pipeline failed:', error);
      // Fallback to original Lambda function
    }
  }

  // Original Lambda function flow for international languages
  const arrayBuffer = await audioBlob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const binaryString = Array.from(uint8Array, (byte) =>
    String.fromCharCode(byte)
  ).join("");
  const audioBase64 = btoa(binaryString);

  const payload: AudioRequest = {
    input_type: "audio",
    audio_data: audioBase64,
    audio_format: "mp3",
  };

  if (dueDate) {
    const date = new Date(dueDate);
    payload.due_month = date.getMonth() + 1;
    payload.due_year = date.getFullYear();
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const jsonResponse = await response.json();
  const data = jsonResponse.body ? JSON.parse(jsonResponse.body) : jsonResponse;
  return data;
};

export const playAudioResponse = (audioBase64: string): void => {
  try {
    // Validate base64 string
    if (!audioBase64 || audioBase64.length < 100) {
      console.error('Invalid or too short audio base64 data');
      return;
    }

    const binaryString = atob(audioBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('Audio data size:', bytes.length, 'bytes');
    
    // Check if it's a valid audio file by looking at headers
    const header = Array.from(bytes.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Audio header:', header);
    
    // Create audio blob with detected format
    let mimeType = 'audio/wav'; // Default
    if (header.startsWith('52494646')) { // RIFF (WAV)
      mimeType = 'audio/wav';
    } else if (header.startsWith('494433') || header.startsWith('fffb') || header.startsWith('fff3')) { // MP3
      mimeType = 'audio/mpeg';
    }
    
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.onended = () => {
      URL.revokeObjectURL(url);
      console.log('Audio playback completed');
    };
    
    audio.onerror = (e) => {
      URL.revokeObjectURL(url);
      console.error('Audio playback failed:', e);
    };

    audio.oncanplaythrough = () => {
      console.log(`Audio ready to play as ${mimeType}`);
    };

    audio.play().then(() => {
      console.log(`Successfully started playing audio as ${mimeType}`);
    }).catch((e) => {
      console.error(`Audio play failed:`, e);
      URL.revokeObjectURL(url);
    });
    
  } catch (error) {
    console.error("Error playing audio response:", error);
  }
};
