import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SongCard from './SongCard';

const GenerationChart = () => {
  const { generation } = useParams();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const generationPlaylistMap = {
      'boomers': '3cEYpjA9oz9GiPac4AsH4n',
      'gen-x': '3cEYpjA9oz9GiPac4AsH4n',
      'millennials': '3cEYpjA9oz9GiPac4AsH4n',
      'gen-z': '3cEYpjA9oz9GiPac4AsH4n',
      'alpha': '3cEYpjA9oz9GiPac4AsH4n'
    };

    const playlistId = generationPlaylistMap[generation.toLowerCase()];
    const accessToken = localStorage.getItem('spotify_access_token');

    if (!playlistId || !accessToken) return;

    console.log(`Using playlist ID:` , playlistId)

    const fetchSongs = async () => {
      try {
        const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        const items = res.data.items.map(item => item.track);
        setSongs(items);
      } catch (error) {
        console.error('Error fetching playlist songs:', error);
      }
    };

    fetchSongs();
  }, [generation]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        🎶 {generation.replace('-', ' ').toUpperCase()} CHART
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {songs.map(song => (
          <SongCard key={song.id} track={song} />
        ))}
      </div>
    </div>
  );
};

export default GenerationChart;
