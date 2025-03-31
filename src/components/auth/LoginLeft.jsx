import React from 'react';

export default function LoginLeft() {
  return (
    <div className="w-full lg:w-[40%] bg-deep-purple p-8 lg:p-12 flex flex-col justify-center text-white">
      <div>
        <p className="text-sm font-bold tracking-wider mb-8">
          PULSE <span className="font-serif font-normal">by BRAINIUP</span>
        </p>
        
        <h1 className="text-2xl lg:text-3xl font-medium leading-relaxed mb-6">
          Ai fost invitat să răspunzi la sondajul anual de angajament al companiei tale.
        </h1>
        
        <p className="text-base text-white/80 leading-relaxed">
          Sondajul este gestionat de Brainiup, iar anonimitatea ta este garantată.
        </p>
      </div>
    </div>
  );
} 