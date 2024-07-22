'use client';

import React, { useEffect, useState } from 'react';
import { fetchEpisodes } from '../utils/api';
import WithAuth from '../components/WithAuth';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell} from '@/app/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/app/components/ui/dropdown-menu'
import { Button } from '@/app/components/ui/button';
import Modal from '../components/Modal';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Episode } from '../utils/types';

const EpisodesPage = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [filterEpisode, setFilterEpisode] = useState<string>('');
  const [selectedEpisode, setSelectedEpisode] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'edit' | 'status'>('edit');

  useEffect(() => {
    const loadEpisodes = async () => {
      const data = await fetchEpisodes();
      setEpisodes(data || []);
    };
    loadEpisodes();
  }, []);

  const handleEdit = (episode: any) => {
    setSelectedEpisode(episode);
    setModalType('edit');
    setModalOpen(true);
  };

  const handleChangeStatus = (episode: any) => {
    setSelectedEpisode(episode);
    setModalType('status');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (selectedEpisode) {
      // Update the episode in the state
      const updatedEpisodes = episodes.map((episode) =>
        episode.id === selectedEpisode.id ? selectedEpisode : episode
      );
      setEpisodes(updatedEpisodes);

      // Update the episodes in localStorage
      localStorage.setItem('episodes', JSON.stringify(updatedEpisodes));
    }
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const filteredEpisodes = episodes.filter((episode) =>
    episode?.name?.toLowerCase().includes(filterName.toLowerCase()) &&
    episode?.episode?.toLowerCase().includes(filterEpisode.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Sidebar />
      <div className="flex flex-col md:flex-row flex-1">
        <div className="md:ml-64 md:mt-20 p-4">
          <h2 className="text-xl font-bold mb-4">Consulta de Episodios</h2>
          <div className="mb-4 grid grid-cols-1 gap-2">
            <input
              type="text"
              name="name"
              placeholder="Buscar por nombre"
              onChange={(e) => setFilterName(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              name="episode"
              placeholder="Buscar por episodio"
              onChange={(e) => setFilterEpisode(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha de emisión</TableHead>
                  <TableHead>Episodio</TableHead>
                  <TableHead>Opciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEpisodes.map((episode) => (
                  <TableRow key={episode.id}>
                    <TableCell>{episode.name}</TableCell>
                    <TableCell>{episode.air_date}</TableCell>
                    <TableCell>{episode.episode}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Opciones</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEdit(episode)}>Cambiar datos básicos</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(episode)}>Cambiar estatus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Modal isOpen={modalOpen} onClose={handleCloseModal} title={modalType === 'edit' ? 'Editar Datos Básicos' : 'Cambiar Estatus'}>
              {modalType === 'edit' ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      value={selectedEpisode?.name || ''}
                      onChange={(e) => setSelectedEpisode({ ...selectedEpisode, name: e.target.value })}
                      className="mt-1 p-2 border rounded w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Fecha de emisión</label>
                    <input
                      type="text"
                      value={selectedEpisode?.air_date || ''}
                      onChange={(e) => setSelectedEpisode({ ...selectedEpisode, air_date: e.target.value })}
                      className="mt-1 p-2 border rounded w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Episodio</label>
                    <input
                      type="text"
                      value={selectedEpisode?.episode || ''}
                      onChange={(e) => setSelectedEpisode({ ...selectedEpisode, episode: e.target.value })}
                      className="mt-1 p-2 border rounded w-full"
                      required
                    />
                  </div>
                  <Button type="submit">Guardar</Button>
                </form>
              ) : (
                <div className="p-4">
                  <p>Cambiar estatus del episodio: {selectedEpisode?.name}</p>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(EpisodesPage);
