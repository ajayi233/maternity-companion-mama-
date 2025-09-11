interface HomepageRequest {
  due_month: number;
  due_year: number;
}

interface HomepageResponse {
  gestational_week: number;
  insights: {
    ai_pregnancy_guide: string;
    baby_this_week: string;
    changes_in_body: string;
    ai_recommendations: string;
    health_tip: string;
  };
}

const HOMEPAGE_API_URL = 'https://oxbgdezcxzrkuxo2vqunbuttd40tlqin.lambda-url.us-west-2.on.aws/';

export const getHomepageInsights = async (dueDate: string): Promise<HomepageResponse> => {
  try {
    const due = new Date(dueDate);
    const payload: HomepageRequest = {
      due_month: due.getMonth() + 1, // JavaScript months are 0-indexed
      due_year: due.getFullYear()
    };

    console.log('Homepage API - Sending payload:', payload);

    const response = await fetch(HOMEPAGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Homepage API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Homepage API - Response:', data);

    // Parse the body if it's a string (Lambda response format)
    const insights = typeof data.body === 'string' ? JSON.parse(data.body) : data;
    
    return insights;
  } catch (error) {
    console.error('Homepage API error:', error);
    throw error;
  }
};