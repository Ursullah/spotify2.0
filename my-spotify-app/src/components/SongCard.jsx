// Functional component that receives a 'track' object from Spotify API as props
const SongCard = ({ track }) => {
  // Destructure key properties from the track object
  const { name, album, artists, external_urls } = track;

  return (
    // The entire card is a link to the song on Spotify
    <a
      href={external_urls.spotify}                 // Link to play the song on Spotify
      target="_blank"                              // Open in a new tab
      rel="noopener noreferrer"                    // Security: prevent access to window.opener
      className="flex items-center gap-4 bg-gray-900 text-white  p-4 rounded-2xl shadow  hover:bg-gray-800 transition" 
    >
      {/* Album cover image */}
      <img
        src={album.images[0]?.url}                 // Use the first album image (usually the largest)
        alt={name}                                 // Alt text for accessibility
        className="w-16 h-16 rounded-xl object-cover" // Fixed size, rounded corners, cover fit
      />

      {/* Song information (title, artists, album) */}
      <div>
        <p className="font-semibold">{name}</p>    {/* Bold song name */}
        
        <p className="text-sm text-gray-400">
          {artists.map(artist => artist.name).join(', ')} {/* Display all artist names, comma-separated */}
        </p>
        
        <p className="text-xs text-gray-500">
          {album.name}                              {/* Display album name in small text */}
        </p>
      </div>
    </a>
  );
};

export default SongCard; // Export the component to be used elsewhere