-- Tabla de Talleres
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
);