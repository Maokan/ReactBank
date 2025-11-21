//pour lancer le serveur = "cd my-react-app" puis "npm run dev"
//import './App.css'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accounts, Historique } from '../components/APIRequests.jsx';

export default function HistoriquePage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await Accounts();
        if (!res || res.ok === false) {
          throw new Error(`Erreur ${res ? res.status : 'unknown'}: Impossible de charger les comptes`);
        }
        if (mounted) setAccounts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Erreur:', err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    
    /* Liste des comptes */
    <div>
        <div>
        <button type="button" className="direction-login" onClick={() => navigate('/dashboard')}>
        Retour
    </button>
        </div>
      <div className="card">
        <h2>Historique des Transactions du compte $ </h2>
        {accounts.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#646cff', color: 'white' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Numéro de compte</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Destinataire</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Montant</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5', color: '#333' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); navigate(`/account/${account.id || account.account_number || index}`); }}
                      style={{ color: '#646cff', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      {account.account_number || account.number || '-'}
                    </a>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{account.type || account.account_type || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{account.balance ?? account.amount ?? '0'}€</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      onClick={() => navigate(`/transactions`)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#646cff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#535bf2'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#646cff'}
                      
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun compte bancaire disponible.</p>
        )}
      </div>
    </div>
);}

