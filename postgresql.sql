-- Asegurarte de estar en la BD
-- \c proyecto

-- 1) Crear los ENUM
CREATE TYPE estado_usuario AS ENUM ('activo', 'bloqueado', 'inactivo');
CREATE TYPE estado_posteo  AS ENUM ('activo', 'eliminado', 'inactivo');

-- 2) Crear las tablas
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    pasword VARCHAR(100) NOT NULL,
    estado estado_usuario DEFAULT 'activo' NOT NULL
);

CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE sesion (
    token VARCHAR(255) PRIMARY KEY,
    usuarioid INT NOT NULL REFERENCES usuarios(id)
);

CREATE TABLE bitacora (
    id SERIAL PRIMARY KEY,
    usuarioid INT NOT NULL REFERENCES usuarios(id),
    fechahora TIMESTAMP NOT NULL
);

CREATE TABLE posteo (
    id SERIAL PRIMARY KEY,
    autorid INT NOT NULL REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    fechapublicacion TIMESTAMP NOT NULL,
    estado estado_posteo DEFAULT 'activo'
);
