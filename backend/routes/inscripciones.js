const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =========================================
// RUTAS DE INSCRIPCIONES
// =========================================

// GET /api/inscripciones - Obtener todas
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT i.*, p.nombre as participante, t.nombre as taller
            FROM inscripciones i
            JOIN participantes p ON i.participante_id = p.id
            JOIN talleres t ON i.taller_id = t.id
            WHERE i.estado = 'activo'
            ORDER BY i.id DESC
        `);
        const inscripciones = stmt.all();
        res.json({ success: true, data: inscripciones });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/inscripciones/:id - Obtener por ID
router.get('/:id', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT i.*, p.nombre as participante, t.nombre as taller
            FROM inscripciones i
            JOIN participantes p ON i.participante_id = p.id
            JOIN talleres t ON i.taller_id = t.id
            WHERE i.id = ? AND i.estado = 'activo'
        `);
        const inscripcion = stmt.get(req.params.id);
        if (!inscripcion) {
            return res.status(404).json({ success: false, error: 'Inscripción no encontrada' });
        }
        res.json({ success: true, data: inscripcion });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/inscripciones - Crear
router.post('/', (req, res) => {
    try {
        const { participante_id, taller_id } = req.body;
        
        const checkStmt = db.prepare('SELECT cupos_disponibles FROM talleres WHERE id = ?');
        const taller = checkStmt.get(taller_id);
        if (!taller || taller.cupos_disponibles <= 0) {
            return res.status(400).json({ success: false, error: 'No hay cupos disponibles' });
        }
        
        const stmt = db.prepare(`
            INSERT INTO inscripciones (participante_id, taller_id)
            VALUES (?, ?)
        `);
        const result = stmt.run(participante_id, taller_id);
        
        const updateStmt = db.prepare('UPDATE talleres SET cupos_disponibles = cupos_disponibles - 1 WHERE id = ?');
        updateStmt.run(taller_id);
        
        const inscripcion = db.prepare('SELECT * FROM inscripciones WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: inscripcion });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ success: false, error: 'Ya inscrito en este taller' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/inscripciones/:id - Cancelar inscripción
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        const getStmt = db.prepare('SELECT taller_id FROM inscripciones WHERE id = ? AND estado = "activo"');
        const inscripcion = getStmt.get(id);
        if (!inscripcion) {
            return res.status(404).json({ success: false, error: 'Inscripción no encontrada' });
        }
        
        const stmt = db.prepare('UPDATE inscripciones SET estado = "cancelada" WHERE id = ?');
        stmt.run(id);
        
        const updateStmt = db.prepare('UPDATE talleres SET cupos_disponibles = cupos_disponibles + 1 WHERE id = ?');
        updateStmt.run(inscripcion.taller_id);
        
        res.json({ success: true, message: 'Inscripción cancelada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ GET /api/inscripciones/count - Contar inscripciones activas
router.get('/count', (req, res) => {
    try {
        const stmt = db.prepare('SELECT COUNT(*) as total FROM inscripciones WHERE estado = "activo"');
        const result = stmt.get();
        res.json({ success: true, total: result.total });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;