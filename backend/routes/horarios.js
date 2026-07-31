const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =========================================
// RUTAS DE HORARIOS
// =========================================

// GET /api/horarios - Obtener todos
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT h.*, t.nombre as taller
            FROM horarios h
            JOIN talleres t ON h.taller_id = t.id
            ORDER BY h.dia_semana, h.hora_inicio
        `);
        const horarios = stmt.all();
        res.json({ success: true, data: horarios });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/horarios - Crear
router.post('/', (req, res) => {
    try {
        const { taller_id, dia_semana, hora_inicio, hora_fin } = req.body;
        const stmt = db.prepare(`
            INSERT INTO horarios (taller_id, dia_semana, hora_inicio, hora_fin)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(taller_id, dia_semana, hora_inicio, hora_fin);
        const horario = db.prepare('SELECT * FROM horarios WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: horario });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;