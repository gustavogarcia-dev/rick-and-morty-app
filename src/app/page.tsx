// src/app/page.tsx (o donde tengas tu componente Home)

'use client';

import Sidebar from "./components/Sidebar";
import withAuth from "./components/WithAuth";
import Header from "./components/Header";
import CharacterCard from "./components/CharacterCard";
import { CharacterCardProps } from "./utils/types";

function Home() {
  const personajes: CharacterCardProps[] = JSON.parse(localStorage.getItem('characters') || '[]');

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <div className="flex-1 p-4 md:ml-64 md:mt-40 ">
          <h1 className=" text-6xl font-bold text-center ">Rick and Morty app</h1>
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
