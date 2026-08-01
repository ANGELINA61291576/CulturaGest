const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =========================================
// RUTAS DE CONSULTAS
// =========================================

// GET /api/consultas - Obtener todas las consultas
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

// POST /api/consultas - Crear una consulta
router.post('/', (req, res) => {
    try {
        const { participante_id, tipo, descripcion } = req.body;
        
        if (!participante_id || !tipo || !descripcion) {
            return res.status(400).json({ 
                success: false, 
                error: 'Todos los campos son obligatorios' 
            });
        }

        const stmt = db.prepare(`
            INSERT INTO consultas (participante_id, tipo, descripcion, estado)
            VALUES (?, ?, ?, 'pendiente')
        `);
        const result = stmt.run(participante_id, tipo, descripcion);
        
        const consulta = db.prepare('SELECT * FROM consultas WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: consulta });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/consultas/:id - Actualizar consulta (marcar como atendida)
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const stmt = db.prepare('UPDATE consultas SET estado = ? WHERE id = ?');
        stmt.run(estado, id);
        
        const consulta = db.prepare('SELECT * FROM consultas WHERE id = ?').get(id);
        res.json({ success: true, data: consulta });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;