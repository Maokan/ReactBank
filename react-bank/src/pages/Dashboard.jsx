import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Accounts } from '../components/APIRequests.jsx';
import '../styles/App.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupère les infos utilisateur
        const userRes = await User();
        if (!userRes.ok) {
          throw new Error(`Erreur ${userRes.status}: Impossible de charger les infos utilisateur`);
        }
        setUser(userRes.data);
        
        // Récupère les comptes
        const accountsRes = await Accounts();
        if (!accountsRes.ok) {
          throw new Error(`Erreur ${accountsRes.status}: Impossible de charger les comptes`);
        }
        setAccounts(Array.isArray(accountsRes.data) ? accountsRes.data : []);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ maxWidth: 900, margin: '2rem auto' }}>
        <h1>Dashboard</h1>
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ maxWidth: 900, margin: '2rem auto' }}>
        <h1>Dashboard</h1>
        <p className="login-error" style={{ textAlign: 'center' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem' }}>
      <h1>Tableau de bord</h1>
      
      {/* Infos utilisateur */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h2>Profil utilisateur</h2>
          {user ? (
            <div>
              <p><strong>Nom:</strong> {user.first_name || '-'} {user.name || '-'}</p>
              <p><strong>Email:</strong> {user.email || user.adress_mail || '-'}</p>
            </div>
          ) : (
            <p>Informations utilisateur non disponibles.</p>
          )}
        </div>
        <button
          onClick={() => {
            // TODO: implémenter l'ouverture d'un nouveau compte
            alert('Ouvrir un compte - À implémenter');
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            marginLeft: '1rem',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#535bf2'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#646cff'}
        >
          + Ouvrir un compte
        </button>
        <button
          onClick={() => {
            // TODO: implémenter l'envoi d'argent
            alert("Envoyer de l'argent - À implémenter");
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            marginLeft: '1rem',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#535bf2'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#646cff'}
        >
          - Envoyer de l'argent
        </button>
      </div>

      {/* Liste des comptes */}
      <div className="card">
        <h2>Comptes bancaires</h2>
        {accounts.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#646cff', color: 'white' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Numéro de compte</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Type</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Solde</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Devise</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5', color: '#333' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/account/${account.id || account.account_number || index}`);
                      }}
                      style={{ color: '#646cff', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      {account.account_number || account.number || '-'}
                    </a>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{account.type || account.account_type || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{account.balance || account.amount || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{account.currency || account.devise || 'EUR'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      onClick={() => {
                        // TODO: implémenter la navigation vers l'historique
                        alert('Historique des transactions - À implémenter');
                      }}
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
                      Historique
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
  );
}
