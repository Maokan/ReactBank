import { useEffect, useState } from 'react';
import './components/ButtonDirection.jsx';
import './styles/App.css';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/infos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const saveToken = () => {
    localStorage.setItem('authToken', token);
    alert('Token enregistré !');
  };

  return (
    <div>
      <h1>Welcome to React Bank</h1>
      <div style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
        <h3>Authentification</h3>
        <input
          type="text"
          placeholder="Entrez votre token"
          value={token}
          onChange={handleTokenChange}
          style={{width: '100%', padding: '0.5rem', marginBottom: '0.5rem', boxSizing: 'border-box'}}
        />
        <button onClick={saveToken} style={{padding: '0.5rem 1rem'}}>
          Enregistrer le token
        </button>
      </div>
      {loading && <p>Loading users...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {!loading && users.length > 0 && (
        <div>
          <h2>Transactions:</h2>
          <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
            <thead>
              <tr style={{backgroundColor: '#646cff', color: 'white'}}>
                <th style={{padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2'}}>ID</th>
                <th style={{padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2'}}>Date</th>
                <th style={{padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2'}}>Montant</th>
                <th style={{padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #535bf2'}}>Description</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} style={{borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent'}}>
                  <td style={{padding: '0.75rem'}}>{user.id || '-'}</td>
                  <td style={{padding: '0.75rem'}}>{user.date || '-'}</td>
                  <td style={{padding: '0.75rem'}}>{user.amount || user.montant || '-'}</td>
                  <td style={{padding: '0.75rem'}}>{user.description || user.desc || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}