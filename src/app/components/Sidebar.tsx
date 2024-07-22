import React from 'react';
import Link from 'next/link';
import Logout from './Logout';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-auto bg-gray-800 text-white flex flex-col p-4 relative h-full md:fixed md:left-auto  md:w-auto ">
      <nav className="flex-1 mt-20">
        <ul>
        <li className="py-2">
            <Link href="/" className="hover:text-green-400">Home</Link>
          </li>
          <li className="py-2">
            <Link href="/create-character" className="hover:text-green-400">Crear Personaje</Link>
          </li>
          <li className="py-2">
            <Link href="/characters" className="hover:text-green-400">Personajes</Link>
          </li>
          <li className="py-2">
            <Link href="/episodes" className="hover:text-green-400">Episodios</Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <Logout />
      </div>
    </aside>
  );
};

export default Sidebar;
