import './App.css';
import { GoSearch } from 'react-icons/go';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Gallery from './Gallery.jsx';

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

function App() {
  const [query, setQuery] = useState('');
  const [res1, setResult1] = useState(null); 
  const [res2, setResult2] = useState(null);
  const [resConc, setResConc] = useState(null);

  function search(e) {
    e.preventDefault();
    //console.log('query:', query);
    setResConc(null);
    setResult1(null);
    setResult2(null);

    const FETCH_URL1 = `https://info-getthekt.herokuapp.com/https://api.deezer.com/search/artist?q=${query}&index=0&limit=1`;
  
    fetch(FETCH_URL1)
    .then(response => response.json())
    .then(json => {
      const result = json.data[0];
      setResult1(result);
      console.log(result);
      if(json.data[0]===undefined) {
        console.log('deezer data is undefined');
        const dialogEl = document.getElementById('d1');
        dialogEl.show();
      }
    });
      
    const FETCH_URL2 = `https://info-getthekt.herokuapp.com/https://itunes.apple.com/search?media=music&entity=song&limit=20&term=${query}`;
    function fetchSec(url) {
      fetch(url)
      .then(response => response.json())
      .then(json => {
        const result = json.results;
        setResult2(result);
        console.log(result);
      });
    }
    fetchSec(FETCH_URL2);
    setQuery('');      
  }
  // (function fetchSec(FETCH_URL2) {
    function processResults() {
      if (res1 && res2) {
        if(res2.length===0) {
          const dialogEl = document.getElementById('d2');
          dialogEl.show();
          setResConc({
            name: res1.name, 
            fans: res1.nb_fan, 
            img: res1.picture_medium,
            genre: ''
          })
        }
        else
          setResConc({
            name: res1.name, 
            fans: res1.nb_fan, 
            img: res1.picture_medium,
            genre: res2[0].primaryGenreName
          });
      }      
    }
    
    useEffect(()=> { 
      processResults();

    }, [res1]);
      
  return (
    <div className='app'>
      <p className='app-title'>Music Master</p>
      <dialog id='d1'>
        <p className='alert'>No artitst was found that<br></br>closely matched your query.</p>
        <form method="dialog">
          <button className='diag-btn btn btn-success'>OK</button>
        </form>
      </dialog>
      <dialog id='d2'>
        <p className='alert'>Only the artist was found,<br></br>but not the tracks!</p>
        <form method="dialog">
          <button className='diag-btn btn btn-success'>OK</button>
        </form>
      </dialog>
      <dialog id='d2'>
        <p className='alert'>Artist not found!</p>
        <form method="dialog">
          <button className='diag-btn btn btn-success'>OK</button>
        </form>
      </dialog>
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
      {resConc && <Profile result={ resConc } /> }
      {resConc && <Gallery tracks= {res2} artist={res1.name}/> }
    </div>
  );
}  
  
export default App;

