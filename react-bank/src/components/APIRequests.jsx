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

export async function Account(id) {
  return await apiFetch('http://127.0.0.1:8000/account/'+id, {
    method: 'GET'
  });
}

export async function Transactions(id) {
  return await apiFetch('http://127.0.0.1:8000/transactions/'+id, {
    method: 'GET'
  });
}

export async function CloseAccount(id) {
  return await apiFetch('http://127.0.0.1:8000/close-account', {
    method: 'PUT',
    body: JSON.stringify({account_id: id}),
  });
}

export async function Deposit(id,amount) {
  return await apiFetch('http://127.0.0.1:8000/deposit', {
    method: 'PUT',
    body: JSON.stringify({account_id: id, amount: amount}),
  });
}

export async function Send(send_account_id,receive_account_id,amount) {
  return await apiFetch('http://127.0.0.1:8000/send', {
    method: 'PUT',
    body: JSON.stringify({
        send_account_id: send_account_id, 
        receive_account_id: receive_account_id, 
        amount: amount
    }),
  });
}

export async function OpenAccount() {
  return await apiFetch('http://127.0.0.1:8000/open-account', {
    method: 'POST',
    body: JSON.stringify({type: "Secondaire"}),
  });
}