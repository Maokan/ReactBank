import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login, setToken, getToken } from './components/APIRequests.jsx';
import './styles/App.css';

export default function App() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Redirige vers le dashboard si l'utilisateur est déjà connecté
  useEffect(() => {
    if (getToken()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const res = await Login(mail, password);
      if (res && res.ok && res.data && res.data.token) {
        setToken(res.data.token);
        setSuccess(true);
        // redirige vers le dashboard
        navigate('/dashboard');
      } else if (res && !res.ok) {
        setError(`Erreur ${res.status}: ${res.data && res.data.message ? res.data.message : 'Authentification échouée'}`);
      } else {
        setError('Identifiants invalides ou erreur serveur.');
      }
    } catch (err) {
      setError('Erreur lors de la connexion.');
    }
  };

  return (
    <div><div className="login-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="mail">Adresse mail</label>
          <input
            id="mail"
            type="email"
            value={mail}
            onChange={e => setMail(e.target.value)}
            required
            className="login-input" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="login-input" />
        </div>
        <button type="submit" className="login-btn">
          Se connecter
        </button>
      </form>
      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">Connexion réussie !</p>}
    </div>
        <button type="button" className="direction-register" onClick={() => navigate('/register')}>
          Vous n'avez pas de compte utilisateur ?<br/>Inscrivez-vous ici !
        </button>
    </div>
  );
}