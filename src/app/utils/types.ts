//tipado para personaje
export interface Character {
  id: string;
  name: string;
  species: string;
  type: string;
  gender: string;
  status?: string;
  image: string; // opcional
}
// tipado del modal
export  interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }

// tipado para las opciones de personajes
export interface CharacterOptions {
  species: string[];
  types: string[];
  genders: string[];
}
// tipado de episodio
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  created: string;
}

export interface EpisodeResponse {
  results: Episode[];
}

// tipado para filtros
export interface Filters {
  species: string;
  type: string;
  gender: string;
  name: string;
}
// tipado para las card de los personajes
export interface CharacterCardProps {
  id: number;
  image: string;
  name: string;
  gender: string;
  type: string;
}

