import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Spotify Dashboard</h1>
      {user ? (
        <div>
          <p>👤 Name: {user.display_name}</p>
          <p>📧 Email: {user.email}</p>
          <p>🌍 Country: {user.country}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default Dashboard;
