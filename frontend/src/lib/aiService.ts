interface TextRequest {
  input_type: 'text';
  text: string;
}

interface AudioRequest {
  input_type: 'audio';
  audio_data: string;
  audio_format: 'mp3';
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

const API_URL = 'https://gh47sa3nnjjkhmexbhciqgks4a0xfunk.lambda-url.us-west-2.on.aws/';

export const sendTextQuery = async (text: string): Promise<TextResponse> => {
  const payload: TextRequest = {
    input_type: 'text',
    text: text
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const sendAudioQuery = async (audioBlob: Blob): Promise<AudioResponse> => {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
  const audioBase64 = btoa(binaryString);

  const payload: AudioRequest = {
    input_type: 'audio',
    audio_data: audioBase64,
    audio_format: 'mp3'
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  const data = jsonResponse.body ? JSON.parse(jsonResponse.body) : jsonResponse;
  return data;
};

export const playAudioResponse = (audioBase64: string): void => {
  try {
    const binaryString = atob(audioBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
    
    audio.play().catch(console.error);
  } catch (error) {
    console.error('Error playing audio response:', error);
  }
};