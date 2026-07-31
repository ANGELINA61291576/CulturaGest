const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =========================================
// RUTAS DE PARTICIPANTES (ALUMNOS)
// =========================================

// GET /api/participantes - Obtener todos
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM participantes WHERE activo = 1 ORDER BY id DESC');
        const participantes = stmt.all();
        res.json({ success: true, data: participantes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/participantes/:id - Obtener por ID
router.get('/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM participantes WHERE id = ? AND activo = 1');
        const participante = stmt.get(req.params.id);
        if (!participante) {
            return res.status(404).json({ success: false, error: 'Participante no encontrado' });
        }
        res.json({ success: true, data: participante });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/participantes - Crear
router.post('/', (req, res) => {
    try {
        const { nombre, apellido, email, telefono } = req.body;
        const stmt = db.prepare(`
            INSERT INTO participantes (nombre, apellido, email, telefono)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(nombre, apellido, email, telefono);
        const participante = db.prepare('SELECT * FROM participantes WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: participante });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ success: false, error: 'Email ya registrado' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/participantes/:id - Actualizar
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, telefono } = req.body;
        const stmt = db.prepare(`
            UPDATE participantes SET nombre = ?, apellido = ?, email = ?, telefono = ?
            WHERE id = ?
        `);
        stmt.run(nombre, apellido, email, telefono, id);
        const participante = db.prepare('SELECT * FROM participantes WHERE id = ?').get(id);
        res.json({ success: true, data: participante });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/participantes/:id - Eliminar
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('UPDATE participantes SET activo = 0 WHERE id = ?');
        stmt.run(id);
        res.json({ success: true, message: 'Participante eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/participantes/count - Contar participantes
router.get('/count', (req, res) => {
    try {
        const stmt = db.prepare('SELECT COUNT(*) as total FROM participantes WHERE activo = 1');
        const result = stmt.get();
        res.json({ success: true, total: result.total });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;