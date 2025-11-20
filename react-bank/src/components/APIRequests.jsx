const TOKEN_KEY = 'authToken';

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = Object.assign({}, options.headers || {});
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && !(options && options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, Object.assign({}, options, { headers }));
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: res.ok, status: res.status, data: text };
  }
}

export async function Login(mail, password) {
  return await apiFetch('http://127.0.0.1:8000/login', {
    method: 'POST',
    body: JSON.stringify({ adress_mail: mail, password: password }),
  });
}

export async function User() {
  return await apiFetch('http://127.0.0.1:8000/infos', {
    method: 'GET'
  });
}

export async function Accounts() {
  return await apiFetch('http://127.0.0.1:8000/accounts', {
    method: 'GET'
  });
}