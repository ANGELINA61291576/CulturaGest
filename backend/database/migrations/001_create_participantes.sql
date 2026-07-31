-- Tabla de Participantes (Alumnos)
CREATE TABLE IF NOT EXISTS participantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT 1
);