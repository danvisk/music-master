import './App.css';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { useState } from 'react';
import { IconContext } from 'react-icons';

function Gallery({tracks, artist}) {
  const [state, setState] = useState({
    playing: false,
    lastUrl: '',
    audio: null,
  })
  const [toID, setID] = useState(0);
  const [show, showMore] = useState(10);

  //let theseTracks 

  function onClick(previewUrl) {
    let audio = new Audio(previewUrl);
    
    function playAudio () {
      audio.play();
      let firstValue = setTimeout(()=>{
        setState({playing: false, lastUrl: previewUrl, audio});
      }, 30000);
      setID(firstValue);
    }

    if(!state.playing) {
      playAudio();
      setState ({playing: true, lastUrl: previewUrl, audio});
    } 
    else {
      if(state.lastUrl === previewUrl) {
        setTimeout(()=>{
          clearTimeout(toID);
        }, 100);
        state.audio.pause();
        setState ({playing: false, lastUrl: previewUrl, audio});
      }
      else {
        setTimeout(()=>{
          clearTimeout(toID);
        }, 100);
        state.audio.pause();
        playAudio();
        setState ({playing: true, lastUrl: previewUrl, audio});
      }
    }
  }  
  
    const BASE_URL = 'https://ws.audioscrobbler.com/2.0/?method=track.search&';
    const API_KEY = 'f21088bf9097b49ad4e7f487abab981e';

  let slicedTracks = [];
  if(tracks)
    if(tracks) slicedTracks = tracks.slice(0,show);
  
  return ( 
    <div className='cont'>
      <div className='gallery'>
        {slicedTracks.map((track, k) => {
          const trackImg = track.artworkUrl100;
          let trackText = track.trackName;
          let target = '';
          if (trackText.length>27)
          trackText = track.trackName.substring(0, 24) + '.';
          const FETCH_URL = `${BASE_URL}track=${track.trackName}&artist=${artist}&api_key=${API_KEY}&limit=1&format=json`;
          fetch(FETCH_URL)
          .then(response => response.json())
          .then(json => {
            if (json.results && json.results.trackmatches && 
              json.results.trackmatches.track.length)
            target = json.results.trackmatches.track[0].url;});
          return (
            <div key={k} className='track'>
              
              <img onClick={()=>onClick(track.previewUrl)}src={trackImg} className='track-img' alt='track'/>
              
              <IconContext.Provider value={{size: '40px'}}>
                <div onClick={()=>onClick(track.previewUrl)} className='track-play' >
                  { track.previewUrl===state.lastUrl && state.playing ? <BsPauseCircleFill /> :
                  <BsPlayCircleFill /> }
                </div>
              </IconContext.Provider>
              
              <p onClick={()=> window.open(target)} className='track-text'>{trackText}</p>

            </div> )
        })}
      </div>
      <div>
        <button onClick={()=>{showMore(10)}}
        className='button'>Show -10 results</button>
        <button onClick={()=>{showMore(20)}}
        className='button'>Show +10 results</button>
      </div> 
      <p className='instruct'>Click on an <b>image</b> to play the track, and on the <b>track name</b> to open the Last.fm page of the track</p>
    </div>     
  );
}

export default Gallery;