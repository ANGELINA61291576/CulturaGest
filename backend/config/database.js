const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// =========================================
// CONEXIÓN A SQLITE
// =========================================

// Ruta de la base de datos
const dbPath = path.join(__dirname, '../database/culturagest.db');

// Crear la carpeta database si no existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Conectar a la base de datos
const db = new Database(dbPath, {
    verbose: console.log  // Muestra las consultas SQL en consola
});

// Habilitar claves foráneas
db.pragma('foreign_keys = ON');

console.log('✅ Base de datos conectada:', dbPath);

// =========================================
// CREAR TABLAS (si no existen)
// =========================================

// Tabla de Participantes (Alumnos)
db.exec(`
    CREATE TABLE IF NOT EXISTS participantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefono TEXT NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        activo BOOLEAN DEFAULT 1
    )
`);

// Tabla de Profesores (Docentes)
db.exec(`
    CREATE TABLE IF NOT EXISTS profesores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        especialidad TEXT NOT NULL,
        telefono TEXT NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        activo BOOLEAN DEFAULT 1
    )
`);

// Tabla de Talleres
db.exec(`
    CREATE TABLE IF NOT EXISTS talleres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        categoria TEXT NOT NULL,
        profesor_id INTEGER,
        cupos_maximos INTEGER NOT NULL,
        cupos_disponibles INTEGER NOT NULL,
        estado TEXT DEFAULT 'activo',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (profesor_id) REFERENCES profesores(id)
    )
`);

// Tabla de Inscripciones
db.exec(`
    CREATE TABLE IF NOT EXISTS inscripciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        participante_id INTEGER NOT NULL,
        taller_id INTEGER NOT NULL,
        fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado TEXT DEFAULT 'activo',
        FOREIGN KEY (participante_id) REFERENCES participantes(id),
        FOREIGN KEY (taller_id) REFERENCES talleres(id),
        UNIQUE(participante_id, taller_id)
    )
`);

// Tabla de Asistencia
db.exec(`
    CREATE TABLE IF NOT EXISTS asistencia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        inscripcion_id INTEGER NOT NULL,
        fecha DATE NOT NULL,
        presente BOOLEAN DEFAULT 0,
        observacion TEXT,
        FOREIGN KEY (inscripcion_id) REFERENCES inscripciones(id)
    )
`);

// Tabla de Consultas
db.exec(`
    CREATE TABLE IF NOT EXISTS consultas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        participante_id INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado TEXT DEFAULT 'pendiente',
        FOREIGN KEY (participante_id) REFERENCES participantes(id)
    )
`);

// Tabla de Usuarios
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT NOT NULL,
        activo BOOLEAN DEFAULT 1,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log('✅ Tablas creadas/verificadas correctamente');

module.exports = db;