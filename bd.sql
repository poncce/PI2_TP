-- Hacer esto de forma local. Los cambios ya estan hechos en el Models, en teoria tendria que andar

create database proyecto;
use proyecto;

CREATE TABLE Usuarios (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(100) NOT NULL,
    Estado ENUM('activo', 'bloqueado', 'inactivo') DEFAULT 'activo'
);
CREATE TABLE ROL (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);
CREATE TABLE Sesion (
    Token VARCHAR(255) PRIMARY KEY,
    usuarioID INT NOT NULL,
    FOREIGN KEY (usuarioID) REFERENCES Usuarios(ID)
);
CREATE TABLE Bitacora (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    usuarioID INT NOT NULL,
    FechaHora DATETIME NOT NULL,
    FOREIGN KEY (usuarioID) REFERENCES Usuarios(ID)
);
CREATE TABLE Posteo (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    AutorID INT NOT NULL,
    Titulo VARCHAR(255) NOT NULL,
    Contenido TEXT NOT NULL,
    FechaPublicacion DATETIME NOT NULL,
    Estado ENUM('activo', 'eliminado', 'inactivo') DEFAULT 'activo',
    FOREIGN KEY (AutorID) REFERENCES Usuarios(ID)
);
CREATE TABLE Favorito (
    usuarioID INT NOT NULL,
    posteoID INT NOT NULL,
    PRIMARY KEY (usuarioID, posteoID),
    FOREIGN KEY (usuarioID) REFERENCES Usuarios(ID),
    FOREIGN KEY (posteoID) REFERENCES Posteo(ID)
);
CREATE TABLE Calificacion (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    usuarioID INT NOT NULL,
    posteoID INT NOT NULL,
    puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
    FOREIGN KEY (usuarioID) REFERENCES Usuarios(ID),
    FOREIGN KEY (posteoID) REFERENCES Posteo(ID)
);
CREATE TABLE Comentario (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    posteoID INT NOT NULL,
    usuarioID INT NOT NULL,
    contenido TEXT NOT NULL,
    FOREIGN KEY (posteoID) REFERENCES Posteo(ID),
    FOREIGN KEY (usuarioID) REFERENCES Usuarios(ID)
);
CREATE TABLE HistorialPosteo (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PosteoId INT NOT NULL,
    cambios TEXT NOT NULL,
    FechaCambio DATETIME NOT NULL,
    FOREIGN KEY (PosteoId) REFERENCES Posteo(ID)
);
CREATE TABLE MensajeChat (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    RemitenteId INT NOT NULL,
    DestinatarioId INT NOT NULL,
    Contenido TEXT NOT NULL,
    FechaEnvio DATETIME NOT NULL,
    FOREIGN KEY (RemitenteId) REFERENCES Usuarios(ID),
    FOREIGN KEY (DestinatarioId) REFERENCES Usuarios(ID)
);