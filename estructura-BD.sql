CREATE DATABASE EspejoMagico;

USE EspejoMagico

CREATE TABLE TipoUsuario (
    idTipoUsuario INT NOT NULL AUTO_INCREMENT, 
    tipoUsuario VARCHAR(50), 
    PRIMARY KEY (idTipoUsuario)
);

CREATE TABLE Usuario (
    idUsuario INT NOT NULL AUTO_INCREMENT, 
    usuario VARCHAR(50), 
    contrasenia VARCHAR(50), 
    nombre VARCHAR(50), 
    idTipoUsuario INT, 
    PRIMARY KEY (idUsuario), 
    FOREIGN KEY (idTipoUsuario) REFERENCES TipoUsuario(idTipoUsuario)
);

CREATE TABLE Estilo (
    idEstilo INT NOT NULL AUTO_INCREMENT, 
    estilo LONGBLOB, 
    idUsuario INT, 
    PRIMARY KEY (idPeinado), 
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

INSERT INTO TipoUsuario(tipoUsuario) VALUES
("cliente"), 
("estilista");

INSERT INTO Usuario(usuario, contrasenia, nombre, idTipoUsuario) VALUES
("cliente", "123", "juan pablo lopez", 1), 
("estilista", "123", "nombre estilista", 2);