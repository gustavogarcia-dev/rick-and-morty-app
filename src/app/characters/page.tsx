'use client';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/app/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import withAuth from '../components/WithAuth';
import Modal from '../components/Modal';
import { fetchAndStoreCharacters, fetchAndStoreCharacterOptions } from '../utils/api';
import { Character, CharacterOptions, Filters } from '../utils/types';

const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filters, setFilters] = useState<Filters>({ species: '', type: '', gender: '', name: '' });
  const [options, setOptions] = useState<CharacterOptions>({ species: [], types: [], genders: [] });
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [modalType, setModalType] = useState<'edit' | 'status' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  
  useEffect(() => {
    const loadCharacters = async () => {
      // Verificar si ya hay personajes en localStorage
      const storedCharacters = getLocalStorageCharacters();

      if (storedCharacters.length === 0) {
        // Si no hay datos, obtener y almacenar en localStorage
        await fetchAndStoreCharacters();
      }

      // Cargar personajes desde localStorage y aplicar filtros
      setCharacters(filterCharacters(filters));
      setLoading(false);
    };

    loadCharacters();
  }, [filters]);

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const openModal = (character: Character, type: 'edit' | 'status') => {
    setSelectedCharacter(character);
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCharacter(null);
    setModalType(null);
  };

  const getLocalStorageCharacters = (): Character[] => {
    return JSON.parse(localStorage.getItem('characters') || '[]');
  };

  const getLocalStorageCharacterOptions = () => {
    return JSON.parse(localStorage.getItem('characterOptions') || 'null');
  };

  const filterCharacters = (filters: Filters) => {
    const allCharacters = getLocalStorageCharacters();

    return allCharacters.filter((char) =>
      (!filters.species || char.species === filters.species) &&
      (!filters.type || char.type === filters.type) &&
      (!filters.gender || char.gender === filters.gender) &&
      (!filters.name || char.name.toLowerCase().includes(filters.name.toLowerCase()))
    );
  };

  const updateLocalStorageCharacter = (updatedCharacter: Character) => {
    const characters = getLocalStorageCharacters();
    const updatedCharacters = characters.map((char) =>
      char.id === updatedCharacter.id ? updatedCharacter : char
    );
    localStorage.setItem('characters', JSON.stringify(updatedCharacters));
  };

  const handleSave = () => {
    if (selectedCharacter) {
      // Actualiza los datos en localStorage
      updateLocalStorageCharacter(selectedCharacter);

      // Actualiza el estado con los datos filtrados
      setCharacters(filterCharacters(filters));
    }
    closeModal();
  };

  const handleEditCharacter = (character: Character) => {
    openModal(character, 'edit');
  };

  const handleChangeStatus = (character: Character) => {
    openModal(character, 'status');
  };

  return (
    <div className="flex flex-col ">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
      <main className="flex-1 p-4 md:mt-20 md:ml-64">
        <h2 className="text-xl font-bold mb-4">Consulta de Personajes</h2>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2">
          <input
            type="text"
            name="name"
            placeholder="Buscar por nombre"
            onChange={handleFilterChange}
            className="p-2 border rounded w-full"
          />
          <select name="species" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">Seleccionar Especie</option>
            {options.species.map((species) => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>
          <select name="type" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">Seleccionar Tipo</option>
            {options.types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select name="gender" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">Seleccionar Género</option>
            {options.genders.map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableCaption>Lista de personajes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Especie</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Género</TableHead>
                <TableHead>Opciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {characters.map((character) => (
                <TableRow key={character.id}>
                  <TableCell>{character.name}</TableCell>
                  <TableCell>{character.species}</TableCell>
                  <TableCell>{character.type}</TableCell>
                  <TableCell>{character.gender}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Opciones</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditCharacter(character)}>Cambiar datos básicos</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(character)}>Cambiar status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Modal isOpen={modalOpen} onClose={closeModal} title={modalType === 'edit' ? 'Editar Datos Básicos' : 'Cambiar Estatus'}>
          {modalType === 'edit' ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={selectedCharacter?.name || ''}
                  onChange={(e) => setSelectedCharacter({ ...selectedCharacter!, name: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Especie</label>
                <input
                  type="text"
                  value={selectedCharacter?.species || ''}
                  onChange={(e) => setSelectedCharacter({ ...selectedCharacter!, species: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <input
                  type="text"
                  value={selectedCharacter?.type || ''}
                  onChange={(e) => setSelectedCharacter({ ...selectedCharacter!, type: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Género</label>
                <input
                  type="text"
                  value={selectedCharacter?.gender || ''}
                  onChange={(e) => setSelectedCharacter({ ...selectedCharacter!, gender: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <Button type="submit">Guardar</Button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Estatus</label>
                <input
                  type="text"
                  value={selectedCharacter?.status || ''}
                  onChange={(e) => setSelectedCharacter({ ...selectedCharacter!, status: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                  required
                />
              </div>
              <Button type="submit">Guardar</Button>
            </form>
          )}
        </Modal>
      </main>
    </div>
  </div>

  );
};

export default withAuth(CharactersPage);
