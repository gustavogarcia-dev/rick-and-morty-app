import React from 'react';
import Link from 'next/link';
const Header: React.FC = () => {
  return (
    <header className="w-full fixed z-10  bg-green-600 text-white p-4">
      <Link href={'/'}><h2 className="text-2xl font-bold">Rick and Morty App</h2></Link>
    </header>
  );
};

export default Header;
