// In production (same-domain deployment), use relative path. In dev, use localhost.
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

export const sendMessage = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const sendVoiceText = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/voice/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending voice text:", error);
    throw error;
  }
};
