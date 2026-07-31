-- Tabla de Asistencia
CREATE TABLE IF NOT EXISTS asistencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inscripcion_id INTEGER NOT NULL,
    fecha DATE NOT NULL,
    presente BOOLEAN DEFAULT 0,
    observacion TEXT,
    FOREIGN KEY (inscripcion_id) REFERENCES inscripciones(id)
);