const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =========================================
// RUTAS DE PROFESORES (DOCENTES)
// =========================================

// GET /api/profesores - Obtener todos
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM profesores WHERE activo = 1 ORDER BY id DESC');
        const profesores = stmt.all();
        res.json({ success: true, data: profesores });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/profesores - Crear
router.post('/', (req, res) => {
    try {
        const { nombre, apellido, email, especialidad, telefono } = req.body;
        const stmt = db.prepare(`
            INSERT INTO profesores (nombre, apellido, email, especialidad, telefono)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = stmt.run(nombre, apellido, email, especialidad, telefono);
        const profesor = db.prepare('SELECT * FROM profesores WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: profesor });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ success: false, error: 'Email ya registrado' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;