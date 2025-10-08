// Use Vite env var VITE_API_BASE if provided. If not provided, use relative paths
// so Vite dev server proxy (if configured) can forward /api requests.
export const BASE_URL = typeof import.meta !== 'undefined' && (import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : "";

const buildUrl = (endpoint) => {
    return BASE_URL ? `${BASE_URL}${endpoint}` : endpoint;
}

export const get = async (endpoint) => {
    const token = localStorage.getItem('token');
    const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};
    const res = await fetch(buildUrl(endpoint), { headers });
    if (!res.ok) throw new Error("GET API error");
    return res.json();
};

export const post = async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
    const url = buildUrl(endpoint);
    if (import.meta.env && import.meta.env.DEV) {
        try {
            console.debug("[DEV API] POST ->", url, { headers, body: data });
        } catch {
            // ignore
        }
    }

    const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    // capture raw response text for better debugging in dev
    const resText = await res.text();

    if (import.meta.env && import.meta.env.DEV) {
        try {
            console.debug("[DEV API] Response:", { url, status: res.status, body: resText });
        } catch {
            // ignore
        }
    }

    if (!res.ok) {
        throw new Error(`POST API error: ${res.status} - ${resText}`);
    }

    try {
        return JSON.parse(resText);
    } catch {
        return resText;
    }
};

export const put = async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
    const res = await fetch(buildUrl(endpoint), {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("PUT API error");
    return res.json();
};

// Hàm DELETE hỗ trợ truyền body nếu có data, nếu không có thì không truyền body
export const del = async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(data && { "Content-Type": "application/json" }),
    };
    const options = {
        method: "DELETE",
        headers,
        ...(data && { body: JSON.stringify(data) }),
    };
    const res = await fetch(buildUrl(endpoint), options);
    if (!res.ok) throw new Error("DELETE API error");
    return res.json();
};

export const putWithParams = async (endpoint, params = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Gắn query string vào endpoint
    const query = new URLSearchParams(params).toString();
    const urlWithParams = `${buildUrl(endpoint)}?${query}`;

    const res = await fetch(urlWithParams, {
        method: "PUT",
        headers,
    });

    if (!res.ok) throw new Error("PUT API error");
    return res.json();
};

export const delWithParams = async (endpoint, params = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const query = new URLSearchParams(params).toString();
    const urlWithParams = `${buildUrl(endpoint)}?${query}`;

    const res = await fetch(urlWithParams, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) throw new Error("DELETE API error");
  return res.json();
};
