const API_BASE_URL = 'http://localhost:5000/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('wanderly_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } catch (networkError) {
      console.error('Network connection error:', networkError);
      throw new Error('Unable to connect to the backend server. Please make sure the backend is running on http://localhost:5000');
    }

    if (response.status === 401) {
      // Clear local auth session on 401 Unauthorized
      localStorage.removeItem('wanderly_token');
      localStorage.removeItem('wanderly_user');

      // Dispatch event to notify AppContext / components of session expiration
      window.dispatchEvent(new CustomEvent('wanderly_auth_unauthorized'));
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};
