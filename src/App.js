import './App.css';
import { GoSearch } from 'react-icons/go';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import Gallery from './Gallery.jsx'

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
    
  function search(e) {
    console.log('query:', query);
    e.preventDefault();

    const FETCH_URL1 = `http://0.0.0.0:8080/https://api.deezer.com/search/artist?q=${query}&index=0&limit=1`;
  
    fetch(FETCH_URL1)
    .then(response => response.json())
    .then(json => {
      const result = json.data[0];
      setResult1(result);
      console.log(result);
    });
      
    const FETCH_URL2 = `http://0.0.0.0:8080/https://itunes.apple.com/search?media=music&entity=song&limit=20&term=${query}`;
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
        <Gallery tracks= {res2} artist={res1.name}/> 
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
  const result1 = result.data[0];  */

 //const FETCH_URL2 = `http://localhost:8080/https://itunes.apple.com/search?media=music&entity=song&limit=${res2.items}&term=${query}`;
    //if(res2.items > count) {
    //  count+=10;
    //    fetch(FETCH_URL2)
    //    .then(response => response.json())
    //    .then(json => {
    //    const result = json.results;
    //    console.log(result);
    //  });
    //}

    //useEffect(()=>{
    //  setTimeout(
    //    fetch(FETCH_URL2)
    //    .then(response => response.json())
    //    .then(json => {
    //    const result = json.results;
    //    console.log({result:json, items: res2.items});
    //  }), 100)}, [res2.items]);