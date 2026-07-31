-- Tabla de Horarios
CREATE TABLE IF NOT EXISTS horarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taller_id INTEGER NOT NULL,
    dia_semana TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fin TEXT NOT NULL,
    FOREIGN KEY (taller_id) REFERENCES talleres(id)
);