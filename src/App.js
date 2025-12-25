import React, { useState } from 'react';
import './App.css';

const initialMovies = [
  { 
    id: 1, 
    title: 'Avengers: Endgame', 
    genre: 'Action', 
    year: 2019, 
    watched: false, 
    inWatchlist: false,
    image: '/images/avengers.jpg'
  },
  { 
    id: 2, 
    title: 'Inception', 
    genre: 'Sci-Fi', 
    year: 2010, 
    watched: false, 
    inWatchlist: false,
    image: '/images/inception.jpg'
  },
  { 
    id: 3, 
    title: 'The Dark Knight', 
    genre: 'Action', 
    year: 2008, 
    watched: false, 
    inWatchlist: false,
    image: '/images/dark-knight.jpg'
  },
];

function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [newMovie, setNewMovie] = useState({ 
    title: '', 
    genre: '', 
    year: '',
    image: null,
    imageFile: null
  });
  const [editingId, setEditingId] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  // CRUD untuk Film
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(imageFile);
      setNewMovie({
        ...newMovie,
        image: imageUrl,
        imageFile: imageFile
      });
    }
  };

  const addMovie = (e) => {
    e.preventDefault();
    const movieData = {
      ...newMovie,
      id: editingId || Math.max(0, ...movies.map(m => m.id)) + 1,
      watched: false,
      inWatchlist: false
    };

    if (editingId) {
      setMovies(movies.map(movie => 
        movie.id === editingId ? movieData : movie
      ));
    } else {
      setMovies([...movies, movieData]);
    }

    setNewMovie({ 
      title: '', 
      genre: '', 
      year: '',
      image: null,
      imageFile: null
    });
    setEditingId(null);
  };

  const deleteMovie = (id) => {
    setMovies(movies.filter(movie => movie.id !== id));
    setWatchlist(watchlist.filter(movieId => movieId !== id));
  };

  const startEditing = (movie) => {
    setNewMovie({
      title: movie.title,
      genre: movie.genre,
      year: movie.year,
      image: movie.image,
      imageFile: null
    });
    setEditingId(movie.id);
  };

  const toggleWatchlist = (movieId) => {
    setMovies(movies.map(movie => 
      movie.id === movieId 
        ? { ...movie, inWatchlist: !movie.inWatchlist } 
        : movie
    ));
    
    setWatchlist(prev => 
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const toggleWatched = (movieId) => {
    setMovies(movies.map(movie => 
      movie.id === movieId 
        ? { ...movie, watched: !movie.watched } 
        : movie
    ));
  };

  return (
    <div className="app">
      <h1>Netflix Clone</h1>
      <div className="movie-form">
        <h2>{editingId ? 'Edit Film' : 'Tambah Film Baru'}</h2>
        <form onSubmit={addMovie}>
          <input
            type="text"
            placeholder="Judul Film"
            value={newMovie.title}
            onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={newMovie.genre}
            onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Tahun Rilis"
            value={newMovie.year}
            onChange={(e) => setNewMovie({...newMovie, year: e.target.value})}
            required
          />
          <div className="form-group">
            <label htmlFor="movie-image">Unggah Gambar:</label>
            <input
              type="file"
              id="movie-image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {newMovie.image && (
              <div className="image-preview">
                <img 
                  src={newMovie.image} 
                  alt="Preview" 
                />
              </div>
            )}
          </div>
          <button type="submit">
            {editingId ? 'Update Film' : 'Tambah Film'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {
              setNewMovie({ title: '', genre: '', year: '' });
              setEditingId(null);
            }}>
              Batal
            </button>
          )}
        </form>
      </div>
      <div className="movie-list">
        <h2>Daftar Film</h2>
        {movies.length === 0 ? (
          <p>Tidak ada film yang tersedia</p>
        ) : (
          <ul>
            {movies.map((movie) => (
              <li key={movie.id} className={movie.watched ? 'watched' : ''}>
                <div className="movie-info">
                  <div className="movie-poster">
                    {movie.image ? (
                      <img 
                        src={movie.image} 
                        alt={movie.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150x225?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="no-image">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="movie-details">
                    <h3>{movie.title}</h3>
                    <p>Genre: {movie.genre}</p>
                    <p>Tahun: {movie.year}</p>
                    <p>Status: {movie.watched ? 'Sudah ditonton' : 'Belum ditonton'}</p>
                  </div>
                </div>
                <div className="actions">
                  <button onClick={() => startEditing(movie)}>Edit</button>
                  <button onClick={() => deleteMovie(movie.id)}>Hapus</button>
                  <button 
                    onClick={() => toggleWatchlist(movie.id)}
                    className={movie.inWatchlist ? 'in-watchlist' : ''}
                  >
                    {movie.inWatchlist ? 'Hapus dari' : 'Tambah ke'} Daftar Tonton
                  </button>
                  <button onClick={() => toggleWatched(movie.id)}>
                    {movie.watched ? 'Tandai Belum Ditonton' : 'Tandai Sudah Ditonton'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="watchlist">
        <h2>Daftar Tontonan Saya</h2>
        {watchlist.length === 0 ? (
          <p>Belum ada film di daftar tontonan</p>
        ) : (
          <ul>
            {movies
              .filter(movie => movie.inWatchlist)
              .map(movie => (
                <li key={movie.id}>
                  <h3>{movie.title}</h3>
                  <p>Status: {movie.watched ? '✓ Sudah ditonton' : 'Belum ditonton'}</p>
                  <div className="actions">
                    <button onClick={() => toggleWatched(movie.id)}>
                      {movie.watched ? 'Tandai Belum' : 'Tandai Sudah'}
                    </button>
                    <button onClick={() => toggleWatchlist(movie.id)}>
                      Hapus dari Daftar
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;