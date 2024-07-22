import { Character, CharacterOptions, Episode, EpisodeResponse } from './types';

// Función para obtener y almacenar personajes
export const fetchAndStoreCharacters = async (): Promise<Character[]> => {
  try {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data = await response.json();
    localStorage.setItem('characters', JSON.stringify(data.results));
    return data.results;
  } catch (error) {
    console.error('Error fetching characters:', error);
    return [];
  }
};

// Función para obtener y almacenar opciones de filtrado
export const fetchAndStoreCharacterOptions = async (): Promise<CharacterOptions> => {
  try {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data = await response.json();

    const species = new Set<string>();
    const types = new Set<string>();
    const genders = new Set<string>();

    data.results.forEach((character: Character) => {
      if (character.species) species.add(character.species);
      if (character.type) types.add(character.type);
      if (character.gender) genders.add(character.gender);
    });

    const options: CharacterOptions = {
      species: Array.from(species),
      types: Array.from(types),
      genders: Array.from(genders)
    };

    localStorage.setItem('characterOptions', JSON.stringify(options));
    return options;
  } catch (error) {
    console.error('Error fetching character options:', error);
    return { species: [], types: [], genders: [] };
  }
};




export const fetchEpisodes = async (): Promise<Episode[] | null> => {
  try {
    // Verificar si los episodios ya están almacenados en localStorage
    const storedEpisodes = localStorage.getItem('episodes');
    if (storedEpisodes) {
      return JSON.parse(storedEpisodes) as Episode[];
    }

    // Si no están en localStorage, hacer la petición a la API
    const response = await fetch('https://rickandmortyapi.com/api/episode');
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.results);

    // Almacenar los episodios en localStorage
    localStorage.setItem('episodes', JSON.stringify(data.results));

    return data.results;
  } catch (error) {
    console.error('Failed to fetch episodes', error);
    return null; // o lanzar el error para ser manejado en el componente
  }
};
