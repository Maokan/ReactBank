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
  // Récupère le token d'authentification stocké en local
  const token = getToken();
  
  // Crée un objet headers en copiant ceux existants s'il y en a
  const headers = Object.assign({}, options.headers || {});
  
  // Si on a un token, l'ajoute dans l'Authorization header avec le format Bearer
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  // Ajoute le Content-Type application/json s'il n'est pas déjà défini
  // (sauf si on envoie un FormData qui a son propre Content-Type)
  if (!headers['Content-Type'] && !(options && options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Effectue la requête fetch avec l'URL, les options et les headers
  const res = await fetch(url, Object.assign({}, options, { headers }));
  
  // Récupère la réponse en texte
  const text = await res.text();
  
  // Essaie de parser la réponse en JSON
  try {
    const data = text ? JSON.parse(text) : null;
    // Retourne l'état de la réponse, le statut HTTP et les données
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    // Si le parsing JSON échoue, retourne la réponse en tant que texte brut
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
 export const Historique = async () => {
  return await apiFetch('http://127.0.0.1:8000/transactions', { //{account_id},
    method: 'GET'
  });
 }