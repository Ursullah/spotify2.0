import { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom"
import SongCard from './SongCard';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);                   // User profile info
  const [tracks, setTracks] = useState([]);                 // User's top tracks
  const [accessToken, setAccessToken] = useState(null);    // Spotify access token
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (!refreshToken) return; 
    try{
      const response = await axios.get(`http://127.0.0.1:8888/refresh_token?refresh_token=${refreshToken}`)
      const newAccessToken = response.data.access_token;
      if(newAccessToken){
        setAccessToken(newAccessToken);
        localStorage.setItem('spotify_access_token', newAccessToken); // Update token in local storage
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Handle token refresh failure
      localStorage.removeItem('spotify_access_token'); // Clear invalid token
      navigate('/login'); // Redirect to login page
  }
}


 useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('access_token');
  const refreshToken = urlParams.get('refresh_token');
  
  if (refreshToken) {
    localStorage.setItem('spotify_refresh_token', refreshToken);
  }

  const storedAccessToken = tokenFromUrl || localStorage.getItem('spotify_access_token');
  if (storedAccessToken) {
    setAccessToken(storedAccessToken);
    localStorage.setItem('spotify_access_token', storedAccessToken);

    axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${storedAccessToken}` }
    })
    .then(res => setUser(res.data))
    .catch(err => {
      if (err.response?.status === 401) {
        refreshAccessToken(); // token might be expired
      } else {
        console.error(err);
      }
    });

    fetchMusicData(storedAccessToken);
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

  //navigate to generation chart on user selection
  const handleSelectGeneration = (e) =>{
    const generation = e.target.value;
    if(generation){
      navigate(`/charts/${generation}`, )
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Spotify Dashboard</h1>

      <div className='mb-6'>
        <label className='block font-semibold mb-1'>Choose Generation</label>
        <select onChange = {handleSelectGeneration} className='p-2 rounded-lg border bg-white text-black'>
          <option value="" disabled>Choose generation</option>
          <option value="boomers">Baby Boomer</option>
          <option value="gen-x">Gen X</option>
          <option value="millennials">Millennial</option>
          <option value="gen-z">Gen Z</option>
          <option value="gen-alpha">Gen Alpha</option>
        </select>
      </div>

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