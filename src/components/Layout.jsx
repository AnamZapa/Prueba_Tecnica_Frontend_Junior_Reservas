import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const hostData = localStorage.getItem('host');
  const host = hostData ? JSON.parse(hostData) : { nombre: 'Host Anónimo', turno: 'N/A' };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: 'Se limpiarán los datos de sesión local.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#aa7c4c', 
      cancelButtonColor: '#374151',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f3f4f6'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('host');
        Swal.fire({
          title: 'Sesión Cerrada',
          text: 'Vuelva pronto.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#f3f4f6'
        });
        navigate('/login');
      }
    });
  };

  // Turn translation/badges
  const getTurnBadgeStyle = (turno) => {
    switch (turno?.toLowerCase()) {
      case 'mañana':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'tarde':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'noche':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-gray-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-default">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/10">
            <span className="font-serif font-bold text-xl text-black">T</span>
          </div>
          <div>
            <h1 className="font-serif font-extrabold text-2xl tracking-wide bg-gradient-to-r from-white via-gold-200 to-gold-400 bg-clip-text text-transparent my-0">
              LumiTable
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold">
              Host Assistant System
            </p>
          </div>
        </div>

        {/* Información del host activo y cierre de sesión */}
        <div className="flex items-center justify-between md:justify-end space-x-6">
          <div className="flex items-center space-x-3 text-right">
            <div className="hidden sm:block">
              <p className="text-xs text-gray-400">Anfitrión Activo</p>
              <h3 className="font-medium text-sm text-gray-100">{host.nombre}</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-gray-200 uppercase border border-white/10 sm:hidden">
              {host.nombre ? host.nombre.substring(0, 2) : 'H'}
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getTurnBadgeStyle(host.turno)}`}>
              Turno: {host.turno}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200 text-xs font-semibold cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-gray-600 border-t border-white/5 bg-[#08090d]">
        <p>© 2026 Table-Track. Diseñado para la excelencia en gestión de restaurantes.</p>
      </footer>
    </div>
  );
};

export default Layout;
