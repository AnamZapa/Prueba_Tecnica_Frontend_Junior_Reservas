## LUMITABLE - Gestor de Reservas

Es una aplicacion web de pagina unica (SPA) desarrollada en React.js y Vite, diseñada para que los anfitriones (hosts) de un restaurante puedan gestionar las reservas de mesas de los clientes de manera eficiente. El sistema permite el control de sesiones locales y la gestion completa del ciclo de vida de una reserva (CRUD) mediante el consumo de una API RESTful simulada.

## Stack Tecnologico
El proyecto utiliza las siguientes herramientas y librerias:

Framework principal: React.js (inicializado con Vite)
Enrutamiento: react-router-dom
Estilos: Tailwind CSS
Alertas e Interacciones: SweetAlert2
Persistencia de sesion: LocalStorage (Simulacion)
Base de datos mock y API RESTful: json-server
Estructura del Proyecto
El codigo fuente esta organizado bajo una arquitectura modular y escalable:

├── db.json                 # Base de datos local para json-server
├── package.json            # Configuracion de scripts y dependencias
├── vite.config.js          # Configuracion de Vite y compilador de Tailwind
├── index.html              # Plantilla HTML y metadatos SEO
└── src
    ├── main.jsx            # Punto de entrada de la aplicacion
    ├── App.jsx             # Definicion de rutas publicas y protegidas
    ├── index.css           # Estilos globales y variables de diseño
    ├── services
    │   └── api.js          # Cliente API para peticiones HTTP (GET, POST, PATCH, DELETE)
    ├── components
    │   ├── ProtectedRoute.jsx  # Control de acceso seguro a rutas
    │   ├── Layout.jsx          # Header, footer y barra de estado del anfitrion
    │   ├── ReservationCard.jsx # Tarjeta de visualizacion de reservas
    │   ├── ReservationForm.jsx # Formulario modal de creacion y edicion
    │   └── SkeletonCard.jsx    # Componente de carga visual (Skeleton loader)
    └── pages
        ├── Login.jsx       # Interfaz de acceso para anfitriones
        └── Panel.jsx       # Vista principal de gestion y control de reservas

## Requisitos Previos
Antes de ejecutar la aplicacion, asegurese de tener instalado:

- Node.js (version 18.0.0 o superior recomendada)
- npm (incluido por defecto con la instalacion de Node.js)
- Instalacion y Configuracion

Siga estos pasos para configurar el entorno en su maquina local:

- Clonar el repositorio o ingresar al directorio del proyecto.
- Abrir la terminal en la ruta raiz del proyecto.
- Instalar las dependencias del proyecto ejecutando:
bas  
- npm install
  
## Ejecucion del Proyecto

Para ejecutar la aplicacion de manera completa, se deben iniciar dos servicios de forma simultanea: el servidor de desarrollo de React y el servidor local de la API.

Paso 1: Iniciar el Servidor de la API (Backend Mock)
Abra una ventana de la terminal en la raiz del proyecto y ejecute:
bash
- npm run api
Este comando levantara json-server en el puerto 5001 utilizando el archivo db.json como base de datos persistente.

Paso 2: Iniciar la Aplicacion Frontend (Vite)
Abra una segunda ventana de la terminal en la raiz del proyecto y ejecute:

bash
- npm run dev

Este comando iniciara el servidor local de desarrollo de Vite (usualmente en la direccion http://localhost:5173).

Paso 3: Acceder al Navegador

Abra su navegador de internet e ingrese a la url indicada por el servidor de desarrollo (http://localhost:5173).

## Flujos de Negocio Implementados
## Modulo de Ingreso Seguro (Simulado):

- El usuario es redirigido obligatoriamente a /login si no cuenta con una sesion activa en el LocalStorage.
- El formulario solicita un Nombre Completo (minimo 3 caracteres) y un Turno (Mañana, Tarde o Noche).
- Al ingresar, los datos del anfitrion persisten en el navegador y se habilita el acceso a la ruta protegida /panel.
- La interfaz principal muestra el nombre y turno del host activo en el encabezado junto a una opcion para cerrar sesion de forma segura.

##Consumo de API y Gestion CRUD:

- Lectura (GET): El panel recupera y muestra el listado de reservas activas. Mientras se procesa la peticion, se muestran esqueletos de carga visuales para mejorar la experiencia de usuario (UX).
- Creacion (POST): Un formulario modal permite registrar nuevas reservas, validando que el nombre del cliente y la cantidad de personas sean completados de manera correcta.
- Actualizacion (PATCH): Permite modificar la fecha, hora y cantidad de comensales. Incluye tambien una opcion rapida en la tarjeta para marcar una reserva como "Finalizada" una vez los clientes se retiren de la mesa.
- Eliminacion (DELETE): Boton para cancelar reservas que dispara un cuadro de confirmacion de SweetAlert2 preguntando "¿Estás seguro de cancelar esta reserva?" antes de confirmar la eliminacion definitiva de la API.
