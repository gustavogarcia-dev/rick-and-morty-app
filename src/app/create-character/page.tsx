'use client';
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Button } from '@/app/components/ui/button';
import { Character } from '../utils/types';
import { useRouter } from 'next/navigation';
import withAuth from '../components/WithAuth';
import { useToast } from '../components/ui/use-toast';
import { fetchAndStoreCharacters } from '../utils/api';
import charterDefaultImage from '/images/charterDefaultImage.jpeg';
import { CharacterOptions } from '../utils/types';
import { useEffect } from 'react';
import { getLocalStorageCharacterOptions, fetchAndStoreCharacterOptions } from '../utils/api';




const CreateCharacterPage: React.FC = () => {
  const [character, setCharacter] = useState<Character>({id:'', name:'', species:'', type:'', gender:'', image:'/images/charterDefaultImage.jpeg'});
  const [options, setOptions] = useState<CharacterOptions>({ species: [], types: [], genders: [] });

  const router = useRouter();
  const {toast} = useToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      [name]: value
    }));
  };

  useEffect(() => {
    const loadOptions = async () => {
      const storedOptions = getLocalStorageCharacterOptions();

      if (!storedOptions) {
        // Si no hay opciones almacenadas, obtener y almacenar en localStorage
        const options = await fetchAndStoreCharacterOptions();
        setOptions(options);
      } else {
        setOptions(storedOptions);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const characters = JSON.parse(localStorage.getItem('characters') || '[]');
    if (characters.length === 0) {
      // Si no hay datos, obtener y almacenar en localStorage
       fetchAndStoreCharacters();
    }
    const newCharacter = { ...character, id: Date.now().toString() };
    toast({
      title: `el Personaje ${newCharacter.name} ha sido Creado Correctamente`,
      
    })
    localStorage.setItem('characters', JSON.stringify([...characters, newCharacter]));

    router.push('/characters'); // Redirige a la página de personajes
  };

  return (
    <div className="flex flex-col ">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 mt-20 flex justify-center items-center p-4">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Crear Personaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={character.name}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Especie</label>
                <select
                  name="species"
                  value={character.species}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                  required
                >
                  <option value="">Seleccionar Especie</option>
                  {options.species.map(specie => 
                    <option key={specie} value={specie}>{specie}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  
                  name="type"
                  value={character.type}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                >
                  <option value="">Seleccione el Tipo</option>
                  {options.types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Género</label>
                <select
                  name="gender"
                  value={character.gender}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                  required
                >
                  <option value="">Seleccionar Género</option>
                  {options.genders.map(gender => 
                    <option key={gender} value={gender}>{gender}</option>
                  )}
                </select>
              </div>
              <Button type="submit" className="w-full">Guardar</Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withAuth(CreateCharacterPage);
