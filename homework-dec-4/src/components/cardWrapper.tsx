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

const maxPictures = 20;

const getRandomImage = () => {

    let randomNumbers = Math.floor(Math.random() * maxPictures)

    if (randomNumbers === 0) {
        randomNumbers++;
    }

    return `https://generatorfun.com/code/uploads/Random-Medieval-image-${randomNumbers}.jpg`
}

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
        image: getRandomImage(),
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
            image: getRandomImage(),
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
    <div>
        <div className='form-wrapper'>
            <h1 className='form__header'>My CRUD App</h1>
            <form className='js-song-edit-form song-form' onSubmit={handleSubmit}>
                <input
                type='text'
                className='song__title'
                value={isEditing ? editedSongName : newSongName}
                placeholder='Song name...'
                onChange={(e) =>
                    isEditing ? setEditSong(e.target.value) : setNewSong(e.target.value)
                }
                />
                <input
                type='text'
                className='song__performer'
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
                className='song__description'
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
                className='song__releaseYear'
                value={isEditing ? editedReleaseYear : newReleaseYear}
                placeholder='Release year...'
                onChange={(e) =>
                    isEditing
                    ? setEditReleaseYear(e.target.value)
                    : setNewReleaseYear(e.target.value)
                }
                />
                <div className='add-button-wrapper'>
                    <button type='submit' className='song__add-button'>
                    {isEditing ? 'Edit' : 'Add'}
                    </button>
                    {isEditing && (
                    <button type='button' className='song__cancel-button' onClick={handleCancelEdit}>
                        Cancel
                    </button>
                    )}
                </div>
            </form>
        </div>
        <div className='song-card-wrapper'>
      {songs.map((song) => (
        <div key={song.id} className='song'>
            <img src={song.image} alt="Medieval image" className='images'/>
            <h1 className='title'>{song.name}</h1>
            <h3 className='performer'>{song.performer}</h3>
            <h5 className='description'>{song.description}</h5>
            <h6 className='releaseYear'>{song.releaseYear}</h6>
            <div className='song__buttons'>
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
            </div>
         ))}
      </div>
    </div>
  );
};
