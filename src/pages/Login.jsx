import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [turno, setTurno] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hostData = localStorage.getItem('host');
    if (hostData) {
      try {
        const host = JSON.parse(hostData);
        if (host.nombre && host.turno) {
          navigate('/panel', { replace: true });
        }
      } catch (e) {
        localStorage.removeItem('host'); 
      }
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedNombre = nombre.trim();

    if (!trimmedNombre) {
      setError('Por favor, ingrese su nombre completo.');
      return;
    }

    if (trimmedNombre.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!turno) {
      setError('Por favor, seleccione su turno de trabajo.');
      return;
    }

    setError('');

    const hostSession = {
      nombre: trimmedNombre,
      turno: turno
    };
    
    localStorage.setItem('host', JSON.stringify(hostSession));

    Swal.fire({
      title: '¡Acceso Concedido!',
      text: `Bienvenido(a), ${trimmedNombre}. Cargando panel de control.`,
      icon: 'success',
      background: '#1f2937',
      color: '#f3f4f6',
      confirmButtonColor: '#aa7c4c',
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      navigate('/panel');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080b] relative overflow-hidden px-4">
      {/* Desenfoque fondo dinámico */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center shadow-2xl shadow-gold-500/20 mx-auto mb-4 border border-gold-300/20">
            <span className="font-serif font-extrabold text-3xl text-black">T</span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl md:text-4xl text-gray-100 tracking-wide mb-1">
            TABLE-TRACK
          </h1>
          <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Sistema de Gestión de Reservas
          </p>
        </div>

        {/* Login */}
        <div className="glass-panel rounded-2xl p-8 border border-white/5 shadow-2xl">
          <h2 className="font-serif font-bold text-xl text-gray-200 text-center mb-6">
            Ingreso de Anfitrión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Si existe un error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 flex items-start space-x-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 flex-shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Input Nombre Completo */}
            <div className="space-y-1.5">
              <label htmlFor="nombre" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Ej. Juan Pérez"
                  className="block w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/80 transition-all duration-200"
                />
              </div>
            </div>

            {/* Select Turno */}
            <div className="space-y-1.5">
              <label htmlFor="turno" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Turno de Trabajo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <select
                  id="turno"
                  value={turno}
                  onChange={(e) => {
                    setTurno(e.target.value);
                    if (error) setError('');
                  }}
                  className="block w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/80 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-gray-900 text-gray-500">Seleccione un turno</option>
                  <option value="Mañana" className="bg-gray-900 text-gray-200">Mañana (08:00 - 16:00)</option>
                  <option value="Tarde" className="bg-gray-900 text-gray-200">Tarde (16:00 - 20:00)</option>
                  <option value="Noche" className="bg-gray-900 text-gray-200">Noche (20:00 - Cierre)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-semibold rounded-xl text-sm shadow-lg shadow-gold-600/10 hover:shadow-gold-600/20 active:scale-98 transition-all duration-200 cursor-pointer"
            >
              Ingresar al Panel
            </button>
          </form>
        </div>

        {/* Informativo */}
        <p className="text-center text-[10px] text-gray-600 mt-6 tracking-wide uppercase">
          Acceso confidencial • Solo personal autorizado
        </p>
      </div>
    </div>
  );
};

export default Login;
