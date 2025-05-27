import { useEffect, useState } from 'react';
import SongCard from './SongCard';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);                   // User profile info
  const [tracks, setTracks] = useState([]);                 // User's top tracks
  const [accessToken, setAccessToken] = useState(null);    // Spotify access token
  const [artists, setArtists] = useState([]); //user's top artists

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    setAccessToken(token);

    if (token) {
      // Fetch user profile
      axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

      // Fetch top and recommended tracks
      fetchMusicData(token);
      fetchArtists(token);
    }
  }, []);

  // Fetch user's top tracks
  const fetchMusicData = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTracks(response.data.items);
    } catch (error) {
      console.error('Error fetching music data:', error);
    }
  };

const fetchArtists = async (token) => {
  try {
    const response = await axios.get ('https://api.spotify.com/v1/me/top/artists',{
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    setArtists(response.data.items);
  } catch (error) {
    console.log('Error fetching artists:', error);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Spotify Dashboard</h1>

      {user ? (
        <div className="mb-6">
          <p>👤 Name: {user.display_name}</p>
          <p>📧 Email: {user.email}</p>
          <p>🌍 Country: {user.country}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}

      {tracks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">🎵 Your Top Tracks</h2>
          <div className="grid grid-cols-3 gap-4">
            {tracks.map((track) => (
              <SongCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      )}

      
    </div>
  );
};

export default Dashboard;
