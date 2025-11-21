//pour lancer le serveur = "cd my-react-app" puis "npm run dev"
//import './App.css'
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Transactions, Accounts } from '../components/APIRequests.jsx';

export default function HistoriquePage() {
  const { id } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fonction helper pour trouver le numéro de compte
  const getAccountNumber = (accountId) => {
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].id === accountId) {
        return accounts[i].account_number;
      }
    }
    return '-';
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await Transactions(id);
        if (!res || res.ok === false) {
          throw new Error(`Erreur ${res ? res.status : 'unknown'}: Impossible de charger les transactions.`);
        }
        if (mounted) setTransactions(Array.isArray(res.data) ? res.data : []);
        
        const accountsRes = await Accounts();
        if (mounted) setAccounts(Array.isArray(accountsRes.data) ? accountsRes.data : []);
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
        <button type="button" className="direction-login" onClick={() => navigate(-1)}>
        Retour
    </button>
        </div>
      <div className="card">
        <h2>Historique des Transactions du compte </h2>
        {transactions.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#646cff', color: 'white' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Compte de Départ</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Compte d'Arrivée</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Montant</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Type</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5', color: '#333' }}>
                  <td style={{ padding: '0.75rem' }}>{getAccountNumber(transaction.start_account_id)}</td>
                  <td style={{ padding: '0.75rem' }}>{getAccountNumber(transaction.end_account_id) || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{transaction.amount ?? '0'}€</td>
                  <td style={{ padding: '0.75rem' }}>{transaction.type || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{transaction.transaction_date ?? 'Erreur'}</td>
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
          <p>Aucune transaction disponible.</p>
        )}
      </div>
    </div>
);}

