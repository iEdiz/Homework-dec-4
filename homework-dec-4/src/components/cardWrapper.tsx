import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Song = {
  id: number;
  name: string;
  performer: string;
  description: string;
  releaseYear: string;
  createdAt: string;
  image: string;
};

export const dataBaseURL = 'http://localhost:3030/songs';

export const CardWrapper: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSongName, setNewSong] = useState('');
  const [newPerformerName, setNewPerformer] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newReleaseYear, setNewReleaseYear] = useState('');

  const [editedSongName, setEditSong] = useState('');
  const [editedPerformer, setEditPerformer] = useState('');
  const [editedDescription, setEditDescription] = useState('');
  const [editedReleaseYear, setEditReleaseYear] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editSongId, setEditSongId] = useState<number | null>(null);

  const getSongs = async () => {
    try {
      const response = await axios.get(dataBaseURL);
      setSongs(response.data || []);
    } catch (error) {
      console.error('Error getting song data', error);
    }
  };

  const addSong = async () => {
    try {
      await axios.post(dataBaseURL, {
        name: newSongName,
        performer: newPerformerName,
        description: newDescription,
        releaseYear: newReleaseYear,
      });

      setNewSong('');
      setNewPerformer('');
      setNewDescription('');
      setNewReleaseYear('');

      await getSongs()
    } catch (error) {
      console.error('Error adding a song', error);
    }
  };

  const editSong = async (id: number) => {
    try {
        await axios.put(`http://localhost:3030/songs/${id}`, {
            name: editedSongName,
            performer: editedPerformer,
            description: editedDescription,
            releaseYear: editedReleaseYear,
        })
        await getSongs();
    } catch (error) {
        console.error('Error editing a song', error)
    }
  }

  const handleDeleteClick = async (id: number) => {

    try {
         await axios.delete(`http://localhost:3030/songs/${id}`)

        getSongs();
    } catch(error) {
        console.error('Error deleting a song', error)
    }
  }

  const handleEditClick = (song: Song) => {
    setIsEditing(true);
    setEditSongId(song.id);
    setEditSong(song.name);
    setEditPerformer(song.performer);
    setEditDescription(song.description);
    setEditReleaseYear(song.releaseYear);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditSongId(null);
    // Reset the edit state variables
    setEditSong('');
    setEditPerformer('');
    setEditDescription('');
    setEditReleaseYear('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isEditing && editSongId) {
      try {
        await editSong(editSongId);
        handleCancelEdit();
      } catch (error) {
        console.error('Error editing a song', error);
      }
    } else {
      try {
        await addSong();
      } catch (error) {
        console.error('Error adding a song', error);
      }
    }

    await getSongs();
  };


  useEffect(() => {
    getSongs();
  }, []);

  return (
    <div className='card-wrapper'>
      <form className='js-song-edit-form song-form' onSubmit={handleSubmit}>
        <input
          type='text'
          className='song-input'
          value={isEditing ? editedSongName : newSongName}
          placeholder='Song name...'
          onChange={(e) =>
            isEditing ? setEditSong(e.target.value) : setNewSong(e.target.value)
          }
        />
        <input
          type='text'
          className='song-input'
          value={isEditing ? editedPerformer : newPerformerName}
          placeholder='Song performer...'
          onChange={(e) =>
            isEditing
              ? setEditPerformer(e.target.value)
              : setNewPerformer(e.target.value)
          }
        />
        <input
          type='text'
          className='song-input'
          value={isEditing ? editedDescription : newDescription}
          placeholder='Song description...'
          onChange={(e) =>
            isEditing
              ? setEditDescription(e.target.value)
              : setNewDescription(e.target.value)
          }
        />
        <input
          type='text'
          className='song-input'
          value={isEditing ? editedReleaseYear : newReleaseYear}
          placeholder='Release year...'
          onChange={(e) =>
            isEditing
              ? setEditReleaseYear(e.target.value)
              : setNewReleaseYear(e.target.value)
          }
        />
        <button type='submit' className='add-song-button'>
          {isEditing ? 'Edit song' : 'Add song'}
        </button>
        {isEditing && (
          <button type='button' onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>
      {songs.map((song) => (
        <div key={song.id}>
          <h1>{song.name}</h1>
          <h3>{song.performer}</h3>
          <p>{song.description}</p>
          <h6>{song.releaseYear}</h6>
          <button
            className='js-song-delete song__delete'
            onClick={() => handleDeleteClick(song.id)}
          >
            Delete
          </button>
          <button
            className='js-song-edit song__edit'
            onClick={() => handleEditClick(song)}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};
