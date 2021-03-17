import { useEffect, useState, createContext, useContext, ReactNode } from 'react';


import { api } from '../services/api';

interface MovieProps {
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}
interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}
interface MovieContextData {
  genres: GenreResponseProps[];
  movies: MovieProps[];
  selectedGenreId: number;
  selectedGenre: GenreResponseProps;
  handleClickButton: (id: number) => void;
}
interface MovieProviderProps {
  children: ReactNode;
}


const MovieContext = createContext({} as MovieContextData);

export default function MovieProvider({ children }: MovieProviderProps ) {  
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);


  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <MovieContext.Provider
      value={{
        genres,
        movies,
        selectedGenreId,
        selectedGenre,
        handleClickButton,
      }}
    >
      {children}
    </MovieContext.Provider>
  )
}

export function useMovie() {
  const context = useContext(MovieContext);
  const { genres, movies, selectedGenre, selectedGenreId, handleClickButton } = context;
  return  { genres, movies, selectedGenre, selectedGenreId, handleClickButton };
}