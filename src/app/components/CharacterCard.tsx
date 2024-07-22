// src/components/CharacterCard.tsx

import React from 'react';
import Image from 'next/image';
import { CharacterCardProps } from '../utils/types';

const CharacterCard: React.FC<CharacterCardProps> = ({ image, name, gender, type }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <Image className="w-full" src={image} alt={name} width={500} height={500} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">Genero: {gender}</p>
        <p className="text-gray-700 text-base">Tipo: {type || 'Unknown'}</p>
      </div>
    </div>
  );
}

export default CharacterCard;
