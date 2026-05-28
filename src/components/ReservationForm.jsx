import React, { useState, useEffect } from 'react';

const ReservationForm = ({ reserva, onSubmit, onClose }) => {
  const [nombreCliente, setNombreCliente] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [cantidadPersonas, setCantidadPersonas] = useState(2);
  const [estado, setEstado] = useState('Confirmada');
  const [error, setError] = useState('');

  const isEditing = !!reserva;

  // Cargar datos de reserva si estamos editando
  useEffect(() => {
    if (reserva) {
      setNombreCliente(reserva.nombreCliente || '');
      setFechaHora(reserva.fechaHora || '');
      setCantidadPersonas(reserva.cantidadPersonas || 2);
      setEstado(reserva.estado || 'Confirmada');
    } else {
      // Redondear fecha y hora actual por defecto para nueva reserva
      const now = new Date();
      now.setMinutes(0);
      const tzOffset = now.getTimezoneOffset() * 60000; 
      const localISOTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);
      setFechaHora(localISOTime);
      setNombreCliente('');
      setCantidadPersonas(2);
      setEstado('Confirmada');
    }
  }, [reserva]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedNombre = nombreCliente.trim();
    if (!trimmedNombre) {
      setError('El nombre del cliente es obligatorio.');
      return;
    }

    if (trimmedNombre.length < 3) {
      setError('El nombre del cliente debe tener al menos 3 caracteres.');
      return;
    }

    if (!fechaHora) {
      setError('La fecha y hora de la reserva son obligatorias.');
      return;
    }

    if (!cantidadPersonas || cantidadPersonas < 1) {
      setError('La cantidad de personas debe ser al menos 1.');
      return;
    }

    setError('');

    const payload = {
      nombreCliente: trimmedNombre,
      fechaHora,
      cantidadPersonas: parseInt(cantidadPersonas, 10),
      estado,
    };

    if (isEditing) {
      onSubmit({ ...payload, id: reserva.id });
    } else {
      onSubmit(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8 animate-scale-up">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif font-bold text-xl text-gray-100 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500"></span>
            <span>{isEditing ? 'Editar Reserva' : 'Nueva Reserva'}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg p-1.5 transition-all duration-200 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 flex items-start space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 flex-shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre Cliente */}
          <div className="space-y-1.5">
            <label htmlFor="nombreCliente" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Nombre del Cliente
            </label>
            <input
              type="text"
              id="nombreCliente"
              value={nombreCliente}
              onChange={(e) => {
                setNombreCliente(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ej. Sofia Loren"
              className="block w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/80 transition-all duration-200"
              autoFocus
            />
          </div>

          {/* Cantidad de Personas */}
          <div className="space-y-1.5">
            <label htmlFor="cantidadPersonas" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Cantidad de Personas
            </label>
            <input
              type="number"
              id="cantidadPersonas"
              value={cantidadPersonas}
              min="1"
              max="50"
              onChange={(e) => {
                setCantidadPersonas(e.target.value);
                if (error) setError('');
              }}
              className="block w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/80 transition-all duration-200"
            />
          </div>

          {/* Fecha y Hora */}
          <div className="space-y-1.5">
            <label htmlFor="fechaHora" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Fecha y Hora
            </label>
            <input
              type="datetime-local"
              id="fechaHora"
              value={fechaHora}
              onChange={(e) => {
                setFechaHora(e.target.value);
                if (error) setError('');
              }}
              className="block w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/80 transition-all duration-200 text-gray-300"
            />
          </div>

          {/* Estado de la Reserva */}
          <div className="space-y-1.5">
            <label htmlFor="estado" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Estado
            </label>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="block w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/80 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="Confirmada" className="bg-gray-900 text-gray-200">Confirmada</option>
              <option value="En Espera" className="bg-gray-900 text-gray-200">En Espera</option>
              <option value="Finalizada" className="bg-gray-900 text-gray-200">Finalizada</option>
            </select>
          </div>

          {/* Enviar y cancelar acciones */}
          <div className="flex items-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-gray-200 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-semibold rounded-xl text-sm shadow-lg shadow-gold-600/10 hover:shadow-gold-600/20 active:scale-98 transition-all duration-200 cursor-pointer"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Reserva'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReservationForm;