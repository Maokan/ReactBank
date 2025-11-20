import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Accounts, OpenAccount, setToken } from '../components/APIRequests.jsx';
import '../styles/App.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupère les infos utilisateur
        const userRes = await User();
        if (!userRes.ok) {
            navigate('/');
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

  const handleOpenAccountClick = () => {
    setShowModal(true);
    setModalMessage(null);
  };

  const handleLogOutClick = () => {
    setToken(null);
    navigate('/');
  };

  const handleCreateAccount = async () => {
    setModalLoading(true);
    try {
      const res = await OpenAccount();
      if (res.ok) {
        setModalMessage({ type: 'success', text: 'Compte secondaire créé avec succès !' });
        // Recharger la liste des comptes après 2 secondes
        setTimeout(() => {
          setShowModal(false);
          window.location.reload();
        }, 2000);
      } else {
        setModalMessage({ 
          type: 'error', 
          text: `Erreur ${res.status}: ${res.data?.message || 'Impossible de créer le compte'}` 
        });
      }
    } catch (err) {
      setModalMessage({ type: 'error', text: 'Erreur lors de la création du compte.' });
    } finally {
      setModalLoading(false);
    }
  };

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
      <button
        onClick={handleLogOutClick}
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
        Log out
    </button>
      
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
          onClick={handleOpenAccountClick}
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
                          const accId = account.id;
                          if (accId) navigate(`/account/${accId}`);
                          else alert('Identifiant du compte manquant.');
                        }}
                      style={{ color: '#646cff', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      {account.account_number || account.number || '-'}
                    </a>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{account.type || account.account_type || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{account.balance || account.amount || '0'}</td>
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

      {/* Modal pour créer un compte */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: 500,
            width: '90%',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
            color: '#333'
          }}>
            <h2 style={{ marginTop: 0 }}>Créer un compte secondaire</h2>
            
            {!modalMessage ? (
              <>
                <p style={{ marginBottom: '1.5rem' }}>
                  Cliquez sur le bouton ci-dessous pour créer un nouveau compte secondaire.
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleCreateAccount}
                    disabled={modalLoading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#646cff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: modalLoading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      opacity: modalLoading ? 0.7 : 1
                    }}
                  >
                    {modalLoading ? 'Création...' : 'Créer'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={modalLoading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#ddd',
                      color: '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: modalLoading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      opacity: modalLoading ? 0.7 : 1
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p style={{
                  padding: '1rem',
                  borderRadius: '4px',
                  backgroundColor: modalMessage.type === 'success' ? '#eaffea' : '#ffeaea',
                  color: modalMessage.type === 'success' ? '#388e3c' : '#d32f2f',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  {modalMessage.text}
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#646cff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
