'use client';

import React, { useEffect, useState } from 'react';
import { fetchEpisodes } from '../utils/api';
import WithAuth from '../components/WithAuth';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/app/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import Modal from '../components/Modal';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Episode } from '../utils/types';

const EpisodesPage = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEpisode, setSelectedEpisode] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'edit' | 'status'>('edit');
  const [startDate, setStartDate] = useState<Date | null>()

  useEffect(() => {
    const loadEpisodes = async () => {
      const data = await fetchEpisodes();
      setEpisodes(data || []);
    };
    loadEpisodes();
  }, []);

  const handleEdit = (episode: any) => {
    setSelectedEpisode(episode);
    setStartDate(new Date(episode.air_date))
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
      // Actualizar la fecha de emisión del episodio seleccionado
      const updatedEpisode = { ...selectedEpisode, air_date: format(startDate || new Date(), 'MMMM d, yyyy') };
      // Update the episode in the state
      const updatedEpisodes = episodes.map((episode) =>
        episode.id === selectedEpisode.id ? updatedEpisode : episode
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
    episode?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    episode?.episode?.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Buscar por nombre o episodio"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-full md:w-80" // Cambia el tamaño aquí
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
                    <DatePicker 
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select a date"
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
