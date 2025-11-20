//pour lancer le serveur = "cd my-react-app" puis "npm run dev"
// Source - https://stackoverflow.com/q
// Posted by TarekBouhairi, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-20, License - CC BY-SA 4mport.0
import { useEffect, useState } from 'react';
import React, { Component } from "react";
import { Register } from './components/APIRequests.jsx';
import { useNavigate } from 'react-router-dom';


export default function RegisterPage() {
  const [name, setName] = useState('');
  const [firstname, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const usernameComputed = `${name} ${firstname}`.trim();
    try {
      const res = await Register(usernameComputed, mail, password, name, firstname);
      // redirect on successful registration
      if (res && res.ok){
        navigate('/');
        setSuccess(true);
      }else{
        setError("Utilisateur déjà existant.");
      }
    } catch (err) {
      // surface backend message when available
      const message = (err && (err.body || err.message)) ? (err.body || err.message) : 'Erreur lors de la création du compte.';
      setError(message);
    }
    }
  return (
    <div className="login-container">
      <h1>Création de votre compte d'utilisateur</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="mail"></label>
          <input
            id="name"
            type="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="login-input"
            placeholder='Nom'
          />
          <input
            id="firstname"
            type="firstname"
            value={firstname}
            onChange={e => setFirstName(e.target.value)}
            required
            className="login-input"
            placeholder="Prenom"
          />
          <input
            id="mail"
            type="email"
            value={mail}
            onChange={e => setMail(e.target.value)}
            required
            className="login-input"
            placeholder="Adresse mail"
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="login-input"
            placeholder="Mot de Passe"
          />
        </div>
        <button type="submit" className="login-btn">
          Créer mon compte de FDP
        </button>
      </form>
      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">Inscription réussie !</p>}
    </div>
  );
}