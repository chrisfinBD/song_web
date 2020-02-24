
import React, { useState, useEffect } from 'react'

const Separator = () => (<span> - </span>)

const Song = (props) => {
  return (
    <div>
      <p>{props.title}</p>
      <p>{props.artist_name}</p>
      <p>{props.released_at}</p>
      <p>{props.rating}</p>
    </div>
  )
}


const EditSong = (props) => {
  const [titleValue, setTitleValue] = useState(props.title)
  const [artistNameValue, setArtistNameValue] = useState(props.artist_name)
  const handleTitleChange = (event) => { setTitleValue(event.currentTarget.value) }
  const handleArtistNameChange = (event) => { setArtistNameValue(event.currentTarget.value) }
  const handleSubmit = (event) => {
    const params = { song: { title: titleValue, artist_name: artistNameValue } }
    alert(JSON.stringify(params))
    fetch(`http://songs.api:3020/songs/${props.id}`, {
      method: "PATCH",
      body: JSON.stringify(params),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => console.log(res))
      .catch((err) => console.log("Oops", err))
  }
  return (
    <div>
      <form onSubmit={handleSubmit} method="PATCH">
        <p><input type="text" name="song[title]" value={titleValue} onChange={handleTitleChange} /></p>
        <p><input type="text" name="song[artist_name]" value={artistNameValue} onChange={handleArtistNameChange} /></p>
        <p>{props.released_at}</p>
        <p>{props.rating}</p>

        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}


const Songs = () => {
  const [songs, setSongs] = useState([])
  const [displaySong, setDisplaySong] = useState(false)
  const [displayEditSong, setDisplayEditSong] = useState(false)
  const [currentSong, setCurrentSong] = useState({})

  const [currentEditSong, setCurrentEditSong] = useState({})

  const showSong = (song) => {
    //console.log(song);
    setDisplaySong(true);
    setDisplayEditSong(false);
    //console.log(displaySong);
    setCurrentSong(song)
    //console.log(currentSong)
  }


  const editSong = (song) => {

    setCurrentSong(song)
    setDisplayEditSong(true);
    setDisplaySong(false);
    console.log(song)

    setCurrentEditSong(song)
  }

  const deleteSong = (song) => {

    // TODO: tell rails to remove song from db
    console.log(song.id)

    fetch(`http://songs.api:3020/songs/${song.id}`, { method: "DELETE" })
      .then(res => {
        console.log(res)
        if (res.status === 204) {
          // TODO: remove song from songs list

          let newSongsList = [...songs]
          let index = newSongsList.indexOf(song)
          newSongsList.splice(index, 1)
          setSongs(newSongsList)
          console.log(songs.length, newSongsList.length)
          setCurrentSong({})

        }
      })
      .catch(err => console.log("Oops", err))

  }

  const songList = songs.map((song, i) => (
    <li key={i}>
      <span>{song.title}</span>
      <Separator />
      <a href="#" onClick={() => showSong(song)}> Show</a>
      <Separator />
      <a href="#" onClick={() => editSong(song)}>Edit</a>
      <Separator />
      <a href="#" onClick={() => deleteSong(song)}>Delete</a>
    </li>)
  )
  useEffect(() => {
    fetch("http://songs.api:3020/songs.json")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((error) => console.log("Oops", error))
  }, [])
  return (
    <div style={{ clear: "both" }}>
      <ul style={{ float: "left", width: "250px" }}>{songList}</ul>

      {displaySong ? (
        <div style={{ float: "right", width: "450px" }}>
          <Song {...currentSong} />
        </div>
      ) : (

          null
        )}
      {displayEditSong ? (
        <div style={{ float: "right", width: "450px" }}>
          <EditSong {...currentSong} />
        </div>
      ) : (
          null
        )
      }
    </div>
  )
}
export default Songs