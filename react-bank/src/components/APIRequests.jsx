export async function Login(mail, password) {
  const response = await fetch('http://127.0.0.1:8000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ adress_mail: mail, password: password }),
  });
  return await response.json();
}