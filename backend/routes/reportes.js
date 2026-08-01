const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =========================================
// RUTAS DE REPORTES
// =========================================

// GET /api/reportes/participantes
router.get('/participantes', (req, res) => {
    try {
        const stmt = db.prepare('SELECT COUNT(*) as total FROM participantes WHERE activo = 1');
        const total = stmt.get();
        res.json({ success: true, data: total });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/reportes/talleres
router.get('/talleres', (req, res) => {
    try {
        const stmt = db.prepare('SELECT COUNT(*) as total FROM talleres WHERE estado = "activo"');
        const total = stmt.get();
        res.json({ success: true, data: total });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/reportes/asistencia
router.get('/asistencia', (req, res) => {
    try {
        const stmt = db.prepare('SELECT COUNT(*) as total FROM asistencia WHERE presente = 1');
        const total = stmt.get();
        res.json({ success: true, data: total });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/reportes/inscripciones
router.get('/inscripciones', (req, res) => {
    try {
        const stmt = db.prepare('SELECT COUNT(*) as total FROM inscripciones WHERE estado = "activo"');
        const total = stmt.get();
        res.json({ success: true, data: total });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;