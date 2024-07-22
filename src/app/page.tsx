'use client';

import { useEffect, useState } from 'react';
import Sidebar from "./components/Sidebar";
import withAuth from "./components/WithAuth";
import Header from "./components/Header";
import CharacterCard from "./components/CharacterCard";
import { CharacterCardProps } from "./utils/types";
import { fetchAndStoreCharacters } from "./utils/api";

function Home() {
  const [personajes, setPersonajes] = useState<CharacterCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCharacters() {
      const storedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
      
      if (storedCharacters.length === 0) {
        console.log('LocalStorage vacío. Fetching characters...');
        await fetchAndStoreCharacters();
        // After fetching, update the state with the newly fetched data
        const updatedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
        setPersonajes(updatedCharacters);
      } else {
        setPersonajes(storedCharacters);
      }
      
      setLoading(false);
    }

    loadCharacters();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <div className="flex-1 p-4 md:ml-64 md:mt-40">
          <h1 className="text-6xl font-bold text-center">Rick and Morty app</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personajes.map((personaje) => (
              <CharacterCard 
                key={personaje.id}
                id={personaje.id}
                image={personaje.image}
                name={personaje.name}
                gender={personaje.gender}
                type={personaje.type}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuth(Home);
