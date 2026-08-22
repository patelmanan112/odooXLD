const API_BASE_URL = 'https://wanderly-backend-m65m.onrender.com';




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

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${normalizedEndpoint}`;

  try {
    let response;
    try {
      response = await fetch(url, config);
    } catch (networkError) {
      console.error('Network connection error:', networkError);
      throw new Error('Unable to connect to the backend server. Please verify network or backend server deployment.');
    }

    if (response.status === 401) {
      // Clear local auth session on 401 Unauthorized
      localStorage.removeItem('wanderly_token');
      localStorage.removeItem('wanderly_user');

      // Dispatch event to notify AppContext / components of session expiration
      window.dispatchEvent(new CustomEvent('wanderly_auth_unauthorized'));
    }

    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || `HTTP ${response.status} ${response.statusText}` };
    }

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
