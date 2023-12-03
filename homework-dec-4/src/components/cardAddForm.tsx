import React, { useState } from 'react'
import axios from 'axios'
import { dataBaseURL } from './cardWrapper'

type NewSong = {
    addSong: (song: string) => void
}

export const CardAddForm: React.FC<NewSong> = ({addSong}) => {
    const [newSongName, setNewSong] = useState('');

   const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
        addSong(newSongName)

        await axios.post(dataBaseURL, {
        name: newSongName,
    })

    setNewSong('')
    } catch (error) {
        console.error('Error adding a song', error)
    }
   }

  return (
    <form className='song-form' onSubmit={handleSubmit}>
        <input 
            type="text" 
            className='song-input' 
            value={newSongName} 
            placeholder='Add song...' 
            onChange={(e) => setNewSong(e.target.value)}/>
        <button type='submit' className='add-song-button'>
          Add song
        </button>
    </form>
  )
}
