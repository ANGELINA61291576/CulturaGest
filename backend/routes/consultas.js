const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =========================================
// RUTAS DE CONSULTAS
// =========================================

// GET /api/consultas - Obtener todas
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT c.*, p.nombre as participante
            FROM consultas c
            JOIN participantes p ON c.participante_id = p.id
            ORDER BY c.id DESC
        `);
        const consultas = stmt.all();
        res.json({ success: true, data: consultas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/consultas - Crear
router.post('/', (req, res) => {
    try {
        const { participante_id, tipo, descripcion } = req.body;
        const stmt = db.prepare(`
            INSERT INTO consultas (participante_id, tipo, descripcion)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(participante_id, tipo, descripcion);
        const consulta = db.prepare('SELECT * FROM consultas WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: consulta });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;