import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SongCard from './SongCard';  

const GenerationChart = () => {
  const { generation } = useParams();
  const [songs, setSongs] = useState([]);

  useEffect(() => {

    const genreMap = {
        'baby-boomers' : 'classic',
        'generation-x' : 'rock',
        'millennials' : 'pop',
        'generation-z' : 'hip-hop',
        'alpha' : 'kids'
       };
    const fetchSongs = async () => {
        try{
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get(`https://api.spotify.com/v1/recommendations?seed_genres=${genreMap[generation]}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    limit: 10
                }
            });
            setSongs(response.data.tracks);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    fetchSongs();
  }, [generation]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">🎶 {generation.replace('-', ' ').toUpperCase()} CHART</h1>
      <div className="grid grid-cols-3 gap-4">
        {songs.map((song) => (
          <SongCard key={song.id} track={song} />
        ))}
      </div>
    </div>
  )
}

export default GenerationChart
