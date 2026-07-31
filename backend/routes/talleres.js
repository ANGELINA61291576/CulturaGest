const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =========================================
// RUTAS DE TALLERES
// =========================================

// GET /api/talleres - Obtener todos
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM talleres WHERE estado = 'activo' ORDER BY id DESC");
        const talleres = stmt.all();
        res.json({ success: true, data: talleres });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/talleres/count - Contar talleres activos
router.get('/count', (req, res) => {
    try {
        const stmt = db.prepare("SELECT COUNT(*) as total FROM talleres WHERE estado = 'activo'");
        const result = stmt.get();
        res.json({ success: true, total: result.total });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/talleres/:id - Obtener por ID
router.get('/:id', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM talleres WHERE id = ? AND estado = 'activo'");
        const taller = stmt.get(req.params.id);
        if (!taller) {
            return res.status(404).json({ success: false, error: 'Taller no encontrado' });
        }
        res.json({ success: true, data: taller });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/talleres - Crear
router.post('/', (req, res) => {
    try {
        const { nombre, categoria, profesor_id, cupos_maximos } = req.body;
        const stmt = db.prepare(`
            INSERT INTO talleres (nombre, categoria, profesor_id, cupos_maximos, cupos_disponibles)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = stmt.run(nombre, categoria, profesor_id, cupos_maximos, cupos_maximos);
        const taller = db.prepare('SELECT * FROM talleres WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: taller });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/talleres/:id - Actualizar
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, categoria, profesor_id, cupos_maximos } = req.body;
        const stmt = db.prepare(`
            UPDATE talleres 
            SET nombre = ?, categoria = ?, profesor_id = ?, cupos_maximos = ?
            WHERE id = ?
        `);
        stmt.run(nombre, categoria, profesor_id, cupos_maximos, id);
        const taller = db.prepare('SELECT * FROM talleres WHERE id = ?').get(id);
        res.json({ success: true, data: taller });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/talleres/:id - Eliminar (soft delete)
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare("UPDATE talleres SET estado = 'inactivo' WHERE id = ?");
        stmt.run(id);
        res.json({ success: true, message: 'Taller eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;