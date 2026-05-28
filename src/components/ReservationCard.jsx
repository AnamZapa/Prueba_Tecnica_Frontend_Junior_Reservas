import React from 'react';

const ReservationCard = ({ reserva, onEdit, onComplete, onDelete }) => {
  const { id, nombreCliente, fechaHora, cantidadPersonas, estado } = reserva;

  const formatFechaHora = (isoString) => {
    if (!isoString) return 'Sin fecha';
    try {
      const date = new Date(isoString);
      const optionsDate = { weekday: 'short', month: 'short', day: 'numeric' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
      
      const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
      const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
      
      return `${formattedDate} - ${formattedTime} hs`;
    } catch (e) {
      return isoString;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmada':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'En Espera':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Finalizada':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="w-full bg-[#151720] hover:bg-[#1b1e2b] border border-white/5 hover:border-gold-500/20 rounded-2xl p-5 shadow-lg transition-all duration-300 flex flex-col justify-between group">
      
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-bold text-lg text-gray-100 group-hover:text-gold-300 transition-colors duration-200 truncate pr-2 max-w-[70%]">
            {nombreCliente}
          </h3>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusStyle(estado)}`}>
            {estado}
          </span>
        </div>

        <p className="text-xs text-gray-400 font-medium flex items-center space-x-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="capitalize">{formatFechaHora(fechaHora)}</span>
        </p>
      </div>

      <div className="flex justify-between items-center py-2.5 my-2 border-y border-white/5 text-xs text-gray-400">
        <div className="flex items-center space-x-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="font-semibold text-gray-300">{cantidadPersonas} {cantidadPersonas === 1 ? 'Persona' : 'Personas'}</span>
        </div>
        <span className="text-[10px] text-gray-600 font-mono">ID: #{id}</span>
      </div>

      {/* Botón de acciones */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {/* Botón de Editar */}
        <button
          onClick={() => onEdit(reserva)}
          className="flex items-center justify-center space-x-1 px-2.5 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium border border-white/5 transition-all duration-200 cursor-pointer"
          title="Editar reserva"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span>Editar</span>
        </button>

        {/* Finalización Rapida */}
        {estado !== 'Finalizada' ? (
          <button
            onClick={() => onComplete(id)}
            className="flex items-center justify-center space-x-1 px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer"
            title="Finalizar (Liberar mesa)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Liberar</span>
          </button>
        ) : (
          <div className="flex items-center justify-center text-[10px] text-gray-500 font-semibold border border-dashed border-gray-800 rounded-lg select-none">
            Finalizada
          </div>
        )}

        {/* Botón de Cancelar */}
        <button
          onClick={() => onDelete(id)}
          className="flex items-center justify-center space-x-1 px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-400 rounded-lg text-xs font-medium border border-red-500/20 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
          title="Cancelar reserva"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;