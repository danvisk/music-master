import './App.css';
import { GoSearch } from 'react-icons/go';
import { BsPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import {Button, Form, InputGroup } from 'react-bootstrap';
import {useState} from 'react';
import {IconContext} from 'react-icons';

function Profile(props) {
  let artist = {name: '', fans: '', img: '', genre: ''};
  
  if (props.result) {
    artist = props.result;
  }
    
  return (
    <div className='profile'>
      <img alt='Profile-pic' className='profile-img'
      src={artist.img} />
      <div className='profile-info'>
        <div className='profile-name'>{artist.name}</div>
        <div className='profile-followers'>
          {artist.fans !== '' && Intl.NumberFormat('de-DE').format(artist.fans)} fans
        </div>
        <div className='profile-genres'>{artist.genre}</div>
      </div>
    </div>
  )
}

function Gallery(props) {
  const {tracks} = props;
  
  let toID = 0, count = 0, lastUrl = '', cEqual = 0, audio = null;
  function onClick(previewUrl) {
    if(count===1) {
      clearTimeout(toID);
      count--;
      audio.pause();
    }

    if(count===0 && previewUrl!==lastUrl || (previewUrl===lastUrl && cEqual===1)) {
      count++;
      audio = new Audio(previewUrl)
      audio.play();
      toID = setTimeout(()=>count--, 30000);
    }
    if(cEqual === 1) {cEqual --; lastUrl=previewUrl; return;}
    if(previewUrl===lastUrl && cEqual===0) cEqual++;
    lastUrl=previewUrl;
  }

  return ( 
    <div className='gallery'>
      {tracks.map((track, k) => {
        const trackImg = track.artworkUrl100;
        let trackText = track.trackName;
        if (trackText.length>27)
        trackText = track.trackName.substr(0, 24) + '.';
        return (
        <div key={k} className='track'>
          <img onClick={()=>onClick(track.previewUrl)}src={trackImg} className='track-img' alt='track'/>
          <IconContext.Provider value={{size: '40px'}}>
            <div onClick={()=>onClick(track.previewUrl)} className='track-play' >
              { track.previewUrl===lastUrl ? <BsPauseCircleFill /> :
              <BsPlayCircleFill /> }
            </div>
          </IconContext.Provider>
          <p className='track-text'>{trackText}</p>
        </div>
        )
      })}
    </div>  
  );
}    

function App() {
  const [query, setQuery] = useState('');
  const FETCH_URL1 = `http://localhost:8080/https://api.deezer.com/search/artist?q=${query}&index=0&limit=1`;
  const FETCH_URL2 = `http://localhost:8080/https://itunes.apple.com/search?media=music&entity=song&limit=10&term=${query}`;
  const [res1, setResult1] = useState(null); //(fetchFirst('http://localhost:8080/https://api.deezer.com/search/artist?q=The Beatles&index=0&limit=1'));  
  const [res2, setResult2] = useState(null); //(fetchSec(`http://localhost:8080/https://itunes.apple.com/search?term=The+Beatles&limit=10`));
    
  function search(e) {
    console.log('query:', query);
    e.preventDefault();

    fetch(FETCH_URL1)
      .then(response => response.json())
      .then(json => {
        const result = json.data[0];
        setResult1(result);
        console.log(result);
      });

    //const BASE_URL = 'https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&';
    //const API_KEY = 'f21088bf9097b49ad4e7f487abab981e';
    // `${BASE_URL}artist=${query}&limit=10&api_key=${API_KEY}&format=json`;
    
    fetch(FETCH_URL2)
    .then(response => response.json())
    .then(json => {
      const result = json.results;
      setResult2(result);
      console.log(result);
    });
    setQuery(''); 
    }    

    let resConc = null;
    if (res1 && res2) {
      resConc = {
        name: res1.name, 
        fans: res1.nb_fan, 
        img: res1.picture_medium,
        genre: res2[0].primaryGenreName
      }
    }     
    
  return (
    <div className='app'>
      <p className='app-title'>Music Master</p>
      
      <Form>
        <Form.Group>
          <InputGroup className='input'>
            <Form.Control
              placeholder="Search for an Artist" className='box'
              value={query} onChange={e=>setQuery(e.target.value)}
            />
            <Button onClick= {search} variant="secondary" type="submit">
              <GoSearch />
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
      {resConc!==null && <div><Profile result={ resConc } /> 
        <Gallery tracks= {res2}/> 
      </div>}
    </div>
  );
}  
  
export default App;

/*
const INIT_URL1 = `http://localhost:8080/https://api.deezer.com/search/artist?q=The Beatles&index=0&limit=1`;
  const INIT_URL2 = `http://localhost:8080/https://itunes.apple.com/search?media=music&entity=song&limit=10&term=The+Beatles`;

  async function fetchFunc(URL) {
    const response = await fetch(URL);
    result = await response.json();
  }
  let result = null;
  fetchFunc(INIT_URL1);
  setTimeout(() => console.log(result.data[0]), 3000);
  //const result1 = result.data[0];  */