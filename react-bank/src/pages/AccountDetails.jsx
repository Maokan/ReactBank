import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Account, Transactions, CloseAccount, Deposit, Send } from '../components/APIRequests.jsx';
import '../styles/App.css';

export default function AccountDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // États pour les modals
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    
    // États pour les formulaires
    const [depositAmount, setDepositAmount] = useState('');
    const [sendReceiverId, setSendReceiverId] = useState('');
    const [sendAmount, setSendAmount] = useState('');
    
    // États pour les résultats d'actions
    const [actionMessage, setActionMessage] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Vérifie l'utilisateur
                const userRes = await User();
                if (!userRes.ok) {
                    // non authentifié -> retour à la page de login
                    navigate('/');
                    return;
                }
                setUser(userRes.data);

                // Récupère le compte par id
                if (!id) {
                    throw new Error('Identifiant de compte manquant.');
                }
                const accountRes = await Account(id);
                if (!accountRes.ok) {
                    throw new Error(`Erreur ${accountRes.status}: Impossible de charger le compte`);
                }
                setAccount(accountRes.data);
            } catch (err) {
                console.error('Erreur:', err);
                navigate('/');
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    // Fonction pour charger les transactions
    const loadTransactions = async () => {
        try {
            const txRes = await Transactions(id);
            if (txRes.ok) {
                setTransactions(Array.isArray(txRes.data) ? txRes.data : []);
            }
        } catch (err) {
            console.error('Erreur chargement transactions:', err);
            navigate('/');
        }
    };

    // Gestionnaires pour les boutons
    const handleDeposit = async () => {
        if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
            setActionMessage({ type: 'error', text: 'Veuillez entrer un montant valide.' });
            return;
        }
        setActionLoading(true);
        try {
            const res = await Deposit(id, Number(depositAmount));
            if (res.ok) {
                setActionMessage({ type: 'success', text: 'Dépôt effectué avec succès !' });
                setDepositAmount('');
                setTimeout(() => {
                    setShowDepositModal(false);
                    setActionMessage(null);
                    window.location.reload();
                }, 2000);
            } else {
                setActionMessage({ type: 'error', text: `Erreur ${res.status}: ${res.data?.message || 'Dépôt échoué'}` });
            }
        } catch (err) {
            setActionMessage({ type: 'error', text: 'Erreur lors du dépôt.' });
            navigate('/');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSend = async () => {
        if (!sendReceiverId || !sendAmount || isNaN(sendAmount) || Number(sendAmount) <= 0) {
            setActionMessage({ type: 'error', text: 'Veuillez remplir tous les champs.' });
            return;
        }
        setActionLoading(true);
        try {
            const res = await Send(id, sendReceiverId, Number(sendAmount));
            if (res.ok) {
                setActionMessage({ type: 'success', text: 'Envoi effectué avec succès !' });
                setSendReceiverId('');
                setSendAmount('');
                setTimeout(() => {
                    setShowSendModal(false);
                    setActionMessage(null);
                    window.location.reload();
                }, 2000);
            } else {
                setActionMessage({ type: 'error', text: `Erreur ${res.status}: ${res.data?.message || 'Envoi échoué'}` });
            }
        } catch (err) {
            setActionMessage({ type: 'error', text: 'Erreur lors de l\'envoi.' });
            navigate('/');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseAccount = async () => {
        setActionLoading(true);
        try {
            const res = await CloseAccount(id);
            if (res.ok) {
                setActionMessage({ type: 'success', text: 'Compte fermé avec succès !' });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setActionMessage({ type: 'error', text: `Erreur ${res.status}: ${res.data?.message || 'Fermeture échouée'}` });
            }
        } catch (err) {
            setActionMessage({ type: 'error', text: 'Erreur lors de la fermeture du compte.' });
            navigate('/');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card" style={{ maxWidth: 900, margin: '2rem auto' }}>
                <h1>Détails du compte</h1>
                <p>Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card" style={{ maxWidth: 900, margin: '2rem auto' }}>
                <h1>Détails du compte</h1>
                <p className="login-error">{error}</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '1rem' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>← Retour</button>
            <button onClick={() => setShowDepositModal(true)} style={{ marginBottom: '1rem', marginLeft: '1rem' }}>Dépôt</button>
            <button onClick={() => setShowSendModal(true)} style={{ marginBottom: '1rem', marginLeft: '1rem' }}>Envoi</button>
            <button onClick={() => { setShowHistoryModal(true); loadTransactions(); }} style={{ marginBottom: '1rem', marginLeft: '1rem' }}>Historique</button>
            <button onClick={() => setShowCloseModal(true)} style={{ marginBottom: '1rem', marginLeft: '1rem' }}>Fermer</button>
            <h1>Détails du compte</h1>
            {account ? (
                <div className="card">
                    <p><strong>Numéro:</strong> {account.account_number || account.number || account.id}</p>
                    <p><strong>Type:</strong> {account.type || account.account_type || '-'}</p>
                    <p><strong>Solde:</strong> {account.balance || account.amount || '0'}</p>
                    <p><strong>Devise:</strong> {account.currency || account.devise || 'EUR'}</p>
                    <p><strong>Créé le:</strong> {account.created_at || account.created_date || '-'}</p>
                </div>
            ) : (
                <p>Compte introuvable.</p>
            )}

            {/* Modal Dépôt */}
            {showDepositModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content" style={{ maxWidth: 400 }}>
                        <span className="close" onClick={() => setShowDepositModal(false)}>&times;</span>
                        <h2>Effectuer un dépôt</h2>
                        <input
                            type="number"
                            placeholder="Montant"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="login-input"
                            step="0.01"
                        />
                        {actionMessage && (
                            <p className={`login-${actionMessage.type}`} style={{ marginTop: '1rem' }}>
                                {actionMessage.text}
                            </p>
                        )}
                        <button
                            onClick={handleDeposit}
                            disabled={actionLoading}
                            className="login-btn"
                            style={{ marginTop: '1rem', width: '100%' }}
                        >
                            {actionLoading ? 'Traitement...' : 'Confirmer'}
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Envoi */}
            {showSendModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content" style={{ maxWidth: 400 }}>
                        <span className="close" onClick={() => setShowSendModal(false)}>&times;</span>
                        <h2>Envoyer de l'argent</h2>
                        <input
                            type="text"
                            placeholder="ID du compte destinataire"
                            value={sendReceiverId}
                            onChange={(e) => setSendReceiverId(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="number"
                            placeholder="Montant"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            className="login-input"
                            style={{ marginTop: '0.5rem' }}
                            step="0.01"
                        />
                        {actionMessage && (
                            <p className={`login-${actionMessage.type}`} style={{ marginTop: '1rem' }}>
                                {actionMessage.text}
                            </p>
                        )}
                        <button
                            onClick={handleSend}
                            disabled={actionLoading}
                            className="login-btn"
                            style={{ marginTop: '1rem', width: '100%' }}
                        >
                            {actionLoading ? 'Traitement...' : 'Confirmer'}
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Historique */}
            {showHistoryModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content" style={{ maxWidth: 600 }}>
                        <span className="close" onClick={() => setShowHistoryModal(false)}>&times;</span>
                        <h2>Historique des transactions</h2>
                        {transactions.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #ddd' }}>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Type</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem' }}>{tx.date || tx.transaction_date || '-'}</td>
                                            <td style={{ padding: '0.5rem' }}>{tx.type || tx.transaction_type || '-'}</td>
                                            <td style={{ padding: '0.5rem' }}>{tx.amount || '0'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Aucune transaction.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Fermeture */}
            {showCloseModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content" style={{ maxWidth: 400 }}>
                        <span className="close" onClick={() => setShowCloseModal(false)}>&times;</span>
                        <h2>Fermer le compte</h2>
                        <p style={{ marginBottom: '1rem' }}>Êtes-vous sûr de vouloir fermer ce compte ? Cette action est irréversible.</p>
                        {actionMessage && (
                            <p className={`login-${actionMessage.type}`} style={{ marginBottom: '1rem' }}>
                                {actionMessage.text}
                            </p>
                        )}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowCloseModal(false)}
                                className="login-btn"
                                style={{ flex: 1 }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCloseAccount}
                                disabled={actionLoading}
                                className="login-btn"
                                style={{ flex: 1, backgroundColor: '#e74c3c' }}
                            >
                                {actionLoading ? 'Traitement...' : 'Confirmer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}