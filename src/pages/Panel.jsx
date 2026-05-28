import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import * as api from '../services/api';
import ReservationCard from '../components/ReservationCard';
import SkeletonCard from '../components/SkeletonCard';
import ReservationForm from '../components/ReservationForm';

const Panel = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Busqueda y filtro de estados
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas');

  // Modal para estados
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  // Reservas desde la API
  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReservas();
      setReservas(data);
    } catch (err) {
      setError(err.message || 'Error al obtener las reservas.');
      Swal.fire({
        title: 'Error de Conexión',
        text: 'No se pudo comunicar con el servidor de base de datos. Por favor, asegúrese de que el backend esté ejecutándose en el puerto 5001.',
        icon: 'error',
        background: '#1f2937',
        color: '#f3f4f6',
        confirmButtonColor: '#aa7c4c'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Calcular estadísticas para las barras superiores
  const stats = {
    total: reservas.length,
    confirmadas: reservas.filter(r => r.estado === 'Confirmada').length,
    enEspera: reservas.filter(r => r.estado === 'En Espera').length,
    finalizadas: reservas.filter(r => r.estado === 'Finalizada').length,
  };

  // Agregar nueva reserva
  const handleAddReserva = async (newReserva) => {
    setIsFormOpen(false);
    setLoading(true);
    try {
      await api.createReserva(newReserva);
      Swal.fire({
        title: '¡Creada con éxito!',
        text: 'La reserva ha sido agregada al sistema.',
        icon: 'success',
        background: '#1f2937',
        color: '#f3f4f6',
        confirmButtonColor: '#aa7c4c',
        timer: 1500,
        showConfirmButton: false
      });
      fetchReservas();
    } catch (err) {
      Swal.fire({
        title: 'Error al crear',
        text: err.message || 'No se pudo completar la operación.',
        icon: 'error',
        background: '#1f2937',
        color: '#f3f4f6',
        confirmButtonColor: '#aa7c4c'
      });
      setLoading(false);
    }
  };

  // Editar reserva existente 
  const handleEditReserva = async (updatedReserva) => {
    setIsFormOpen(false);
    setSelectedReserva(null);
    setLoading(true);
    try {
      await api.updateReserva(updatedReserva.id, updatedReserva);
      Swal.fire({
        title: '¡Modificada con éxito!',
        text: 'Los cambios de la reserva han sido guardados.',
        icon: 'success',
        background: '#1f2937',
        color: '#f3f4f6',
        confirmButtonColor: '#aa7c4c',
        timer: 1500,
        showConfirmButton: false
      });
      fetchReservas();
    } catch (err) {
      Swal.fire({
        title: 'Error al guardar',
        text: err.message || 'No se pudo guardar la información.',
        icon: 'error',
        background: '#1f2937',
        color: '#f3f4f6',
        confirmButtonColor: '#aa7c4c'
      });
      setLoading(false);
    }
  };

  // Cambio de estado a "Finalizada"
  const handleCompleteReserva = async (id) => {
    try {
      // Buscar nombre del cliente
      const clientName = reservas.find(r => r.id === id)?.nombreCliente || 'Cliente';
      
      setLoading(true);
      await api.updateReserva(id, { estado: 'Finalizada' });
      
      Swal.fire({
        title: '¡Mesa Liberada!',
        text: `La reserva de ${clientName} ha sido marcada como Finalizada.`,
        icon: 'success',
        background: '#1f2937',
        color: '#f3f4f6',
        confirmButtonColor: '#aa7c4c',
        timer: 2000,
        showConfirmButton: false
      });
      fetchReservas();
    } catch (err) {
      Swal.fire({
        title: 'Error al actualizar estado',
        text: err.message || 'No se pudo cambiar el estado de la reserva.',
        icon: 'error',
        background: '#1f2937',
        color: '#f3f4f6',
        confirmButtonColor: '#aa7c4c'
      });
      setLoading(false);
    }
  };

  // Eliminar/Cancelar/Confirmar reserva
  const handleDeleteReserva = async (id) => {
    const clientName = reservas.find(r => r.id === id)?.nombreCliente || 'esta reserva';
    
    // OBLIGATORIO: Se requiere el uso de SweetAlert2 para mostrar un cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro de cancelar esta reserva?',
      text: `Esta acción cancelará permanentemente la reserva de ${clientName}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', 
      cancelButtonColor: '#374151',
      confirmButtonText: 'Sí, cancelar reserva',
      cancelButtonText: 'No, mantener',
      background: '#1f2937',
      color: '#f3f4f6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await api.deleteReserva(id);
          // Confirmar el éxito de la cancelación con otra alerta
          Swal.fire({
            title: '¡Reserva Cancelada!',
            text: 'La reserva ha sido eliminada del sistema con éxito.',
            icon: 'success',
            background: '#1f2937',
            color: '#f3f4f6',
            confirmButtonColor: '#aa7c4c',
            timer: 2000,
            showConfirmButton: false
          });
          fetchReservas();
        } catch (err) {
          Swal.fire({
            title: 'Error al cancelar',
            text: err.message || 'No se pudo realizar la petición de eliminación.',
            icon: 'error',
            background: '#1f2937',
            color: '#f3f4f6',
            confirmButtonColor: '#aa7c4c'
          });
          setLoading(false);
        }
      }
    });
  };

  // Logica de busqueda y filtrado
  const filteredReservas = reservas.filter((reserva) => {
    const matchesSearch = reserva.nombreCliente
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      statusFilter === 'Todas' || reserva.estado === statusFilter;
      
    return matchesSearch && matchesFilter;
  });

  const openAddModal = () => {
    setSelectedReserva(null);
    setIsFormOpen(true);
  };

  const openEditModal = (reserva) => {
    setSelectedReserva(reserva);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Barras */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-[#151720] border border-white/5 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Reservas</p>
            <h4 className="text-3xl font-bold font-serif text-white mt-1">{loading ? '...' : stats.total}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-800/80 border border-white/5 flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Reservas Confirmadas */}
        <div className="bg-[#151720] border border-white/5 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirmadas</p>
            <h4 className="text-3xl font-bold font-serif text-amber-400 mt-1">{loading ? '...' : stats.confirmadas}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Reservas En Espera */}
        <div className="bg-[#151720] border border-white/5 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">En Espera</p>
            <h4 className="text-3xl font-bold font-serif text-blue-400 mt-1">{loading ? '...' : stats.enEspera}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Reservas Finalizadas */}
        <div className="bg-[#151720] border border-white/5 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Finalizadas</p>
            <h4 className="text-3xl font-bold font-serif text-emerald-400 mt-1">{loading ? '...' : stats.finalizadas}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.585a.75.75 0 011.05 0l2.25 2.25a.75.75 0 010 1.05l-2.25 2.25a.75.75 0 11-1.05-1.05l.973-.973H3.75a.75.75 0 010-1.5h3.49l-.973-.973a.75.75 0 010-1.05zm7.466 6a.75.75 0 011.05 0l2.25 2.25a.75.75 0 010 1.05l-2.25 2.25a.75.75 0 11-1.05-1.05l.973-.973h-3.49a.75.75 0 010-1.5h3.49l-.973-.973a.75.75 0 010-1.05z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Control de acciones */}
      <section className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        
        {/* Botón de busqueda y filtro de estado */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 max-w-2xl">

          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente..."
              className="block w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/80 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtros  */}
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 overflow-x-auto whitespace-nowrap scrollbar-none">
            {['Todas', 'Confirmada', 'En Espera', 'Finalizada'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-black shadow-md shadow-gold-500/10'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {filter === 'Todas' ? 'Todas' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Botón para agregar reserva */}
        <button
          onClick={openAddModal}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-semibold rounded-xl text-sm shadow-lg shadow-gold-600/10 hover:shadow-gold-600/20 active:scale-98 transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Nueva Reserva</span>
        </button>
      </section>

      {/* 3. Vista principal de datos */}
      <section>

        {loading && reservas.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          /* Error */
          <div className="glass-panel rounded-2xl p-12 text-center border border-red-500/10 max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-xl text-gray-200">Error de Conexión</h3>
            <p className="text-sm text-gray-400">
              No pudimos sincronizar las reservas. Verifique si el servidor de desarrollo API está corriendo en su terminal (`npm run api`).
            </p>
            <button
              onClick={fetchReservas}
              className="px-6 py-2 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-400 font-semibold rounded-xl text-sm transition-all duration-200 cursor-pointer"
            >
              Reintentar Conexión
            </button>
          </div>
        ) : filteredReservas.length === 0 ? (
        
          <div className="glass-panel rounded-2xl p-12 text-center border border-white/5 max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-xl text-gray-200">Sin Reservas Encontradas</h3>
            <p className="text-sm text-gray-400">
              {searchTerm || statusFilter !== 'Todas'
                ? 'Ninguna reserva coincide con los filtros aplicados actualmente.'
                : 'No hay reservas registradas en el sistema para hoy.'}
            </p>
            {(searchTerm || statusFilter !== 'Todas') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('Todas');
                }}
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl text-xs transition-all duration-200 cursor-pointer"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        ) : (
          /* Lista de datos */
          <div className="relative">
            {/* Indicador de carga superpuesto durante las actualizaciones en segundo plano */}
            {loading && (
              <div className="absolute inset-0 bg-[#0b0c10]/40 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 border-4 border-gold-500/25 border-t-gold-500 rounded-full animate-spin"></div>
                  <span className="text-xs text-gold-400 font-semibold tracking-wider">Procesando...</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReservas.map((reserva) => (
                <ReservationCard
                  key={reserva.id}
                  reserva={reserva}
                  onEdit={openEditModal}
                  onComplete={handleCompleteReserva}
                  onDelete={handleDeleteReserva}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. superposición del formulario */}
      {isFormOpen && (
        <ReservationForm
          reserva={selectedReserva}
          onSubmit={selectedReserva ? handleEditReserva : handleAddReserva}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedReserva(null);
          }}
        />
      )}
    </div>
  );
};

export default Panel;
