import React, { useState, useRef, useEffect } from 'react';
 const Music = () => {
        const [songs, setSongs] = useState(null);
        const [currentIndex, setCurrentIndex] = useState (null);
        const audioRef = useRef(null);

        useEffect (()=> {
            fetch ("https://playground.4geeks.com/sound/songs")
            .then (response => response.json())
            .then ( data => {
             if (Array.isArray(data.songs)) {
             setSongs(data.songs);                  // Save songs into state
              } else {
              console.error("Unexpected response format:", data);
              setSongs([]);                          // Clear state on error
        }
            })
             .catch(error => {
          console.error("Error fetching songs:", error);
          setSongs([]);                            // Clear state on network error
         });
        }, []);         
         const playSong = index => {
    setCurrentIndex(index);                      // Update current index
    const song = songs[index];                  
    if (!audioRef.current || !song) return;      // Safety check

    // Build the full URL for the audio file
    const fileUrl = `https://playground.4geeks.com${song.url}`;
    audioRef.current.crossOrigin = "anonymous";   // Avoid CORS blocks
    audioRef.current.src = fileUrl;               // Set new source
    audioRef.current.load();                      // Reload to apply src
    audioRef.current
      .play()                                     // Attempt playback
      .catch(err => console.error("Playback error:", err));
  };

  // Advance to the next song (wraps around)
  const handleNext = () => {
    if (songs.length === 0) return;
    const nextIndex =
      currentIndex !== null 
        ? (currentIndex + 1) % songs.length 
        : 0;
    playSong(nextIndex);
  };

  // Go back to the previous song (wraps around)
  const handlePrev = () => {
    if (songs.length === 0) return;
    const prevIndex =
      currentIndex !== null
        ? (currentIndex - 1 + songs.length) % songs.length
        : songs.length - 1;
    playSong(prevIndex);
  };
    if (songs === null) return <div>Loading songs...</div>;

return (
    
  <div className='container-fluid fullscreen-container' style={{display:"flex", flexDirection:"column", justifyContent:"center",backgroundColor:"gray",minHeight: "100vh", width: "100vw", margin: 0, padding: 0}}>  
    <div className="card-header" style={{color: "white", background:"gray"}}>     
       <strong style={{ display: "flex", justifyContent: "center", alignItems:"center"}}>Tyrone's Playlist</strong> 
       <p style={{ display: "flex", justifyContent: "center", alignItems:"center"}}>click song name to play. :)</p>
    </div>  
    <ul className="list-group custom-list-group">  
         {songs?.map((song, index) => (
  <button
    type="button"
    className="list-group-item active"
    aria-current="true"
    key={song.id}
    onClick={() => playSong(index)} style={{
      border: currentIndex === index ? "3px solid limegreen" : "1px solid #ccc",
      marginBottom: "5px",
      backgroundColor: currentIndex === index ? "#1e1e1e" : "#444",
      color: "white"
    }}
  >
    {song.name}
  </button>
))}
    </ul>  
    
    <div className="card-footer" style={{color: "white", background:"gray", display:"flex", justifyContent:"center", alignContent:"center", gap:"10px"}}>     
         <button type='button' onClick={handlePrev}>Back</button>
         <button type='button' onClick={() => playSong(0)}>Play</button>
         <button type='button' onClick={handleNext}>Skip</button>


         <audio ref={audioRef} />


    </div>     
</div>
)};


 export default Music;