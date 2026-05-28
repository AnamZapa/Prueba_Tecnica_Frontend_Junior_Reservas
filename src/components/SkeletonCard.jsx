import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="w-full bg-[#16171d]/60 border border-white/5 rounded-2xl p-5 space-y-4 animate-pulse">
      
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          {/* Nombre del cliente */}
          <div className="h-5 bg-gray-700/60 rounded-md w-36"></div>
          {/* Fecha y hora */}
          <div className="h-3.5 bg-gray-700/40 rounded-md w-28"></div>
        </div>
        {/* Status */}
        <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
      </div>

      {/* Seccion central */}
      <div className="flex justify-between items-center py-2 border-y border-white/5">
        <div className="flex items-center space-x-2">
          {/* Icono */}
          <div className="w-4 h-4 bg-gray-700/40 rounded-full"></div>
          {/* Texto */}
          <div className="h-4 bg-gray-700/40 rounded-md w-16"></div>
        </div>
        {/* ID Label */}
        <div className="h-3 bg-gray-700/30 rounded-md w-8"></div>
      </div>

      {/* Botones de Accion */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="h-9 bg-gray-700/40 rounded-lg w-full"></div>
        <div className="h-9 bg-gray-700/40 rounded-lg w-full"></div>
        <div className="h-9 bg-gray-700/40 rounded-lg w-full"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;