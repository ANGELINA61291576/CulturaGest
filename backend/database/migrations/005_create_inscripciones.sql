-- Tabla de Inscripciones
CREATE TABLE IF NOT EXISTS inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participante_id INTEGER NOT NULL,
    taller_id INTEGER NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TEXT DEFAULT 'activo',
    FOREIGN KEY (participante_id) REFERENCES participantes(id),
    FOREIGN KEY (taller_id) REFERENCES talleres(id),
    UNIQUE(participante_id, taller_id)
);