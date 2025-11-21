const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/infos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
export const Register = async (username, mail, password, name, firstname) => {
  return await apiFetch('http://127.0.0.1:8000/register', {
    method: 'POST',
    body: JSON.stringify({username:username,adress_mail:mail,password:password,name:name,first_name:firstname}),
  });
  };
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

export async function OpenAccount() {
  return await apiFetch('http://127.0.0.1:8000/open-account', {
    method: 'POST',
    body: JSON.stringify({type: "Secondaire"}),
  });
}
 export const Historique = async () => {
  return await apiFetch('http://127.0.0.1:8000/transactions', { //{account_id},
    method: 'GET'
  });
 }