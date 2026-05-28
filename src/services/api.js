const API_BASE_URL = 'http://localhost:5001';

// Helper to simulate a small network delay for showing skeleton/spinners
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getReservas = async () => {
  await delay(600); // 600ms artificial delay for UX demonstration
  const response = await fetch(`${API_BASE_URL}/reservas`);
  if (!response.ok) {
    throw new Error('No se pudieron cargar las reservas. Verifique si el servidor API está activo.');
  }
  return response.json();
};

export const createReserva = async (reserva) => {
  await delay(600);
  const response = await fetch(`${API_BASE_URL}/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reserva),
  });
  if (!response.ok) {
    throw new Error('No se pudo registrar la reserva.');
  }
  return response.json();
};

export const updateReserva = async (id, data) => {
  await delay(600);
  const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
    method: 'PATCH', // Using PATCH to allow partial updates (e.g. just status)
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('No se pudo actualizar la reserva.');
  }
  return response.json();
};

export const deleteReserva = async (id) => {
  await delay(600);
  const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('No se pudo cancelar la reserva.');
  }
  return response.json();
};
