const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =========================================
// RUTAS DE ASISTENCIA
// =========================================

// GET /api/asistencia - Obtener todas
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT a.*, p.nombre as participante, t.nombre as taller
            FROM asistencia a
            JOIN inscripciones i ON a.inscripcion_id = i.id
            JOIN participantes p ON i.participante_id = p.id
            JOIN talleres t ON i.taller_id = t.id
            ORDER BY a.fecha DESC
        `);
        const asistencias = stmt.all();
        res.json({ success: true, data: asistencias });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/asistencia/:id - Obtener por ID
router.get('/:id', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT a.*, p.nombre as participante, t.nombre as taller
            FROM asistencia a
            JOIN inscripciones i ON a.inscripcion_id = i.id
            JOIN participantes p ON i.participante_id = p.id
            JOIN talleres t ON i.taller_id = t.id
            WHERE a.id = ?
        `);
        const asistencia = stmt.get(req.params.id);
        if (!asistencia) {
            return res.status(404).json({ success: false, error: 'Asistencia no encontrada' });
        }
        res.json({ success: true, data: asistencia });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/asistencia - Registrar
router.post('/', (req, res) => {
    try {
        const { inscripcion_id, fecha, presente, observacion } = req.body;
        const stmt = db.prepare(`
            INSERT INTO asistencia (inscripcion_id, fecha, presente, observacion)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(inscripcion_id, fecha, presente, observacion);
        const asistencia = db.prepare('SELECT * FROM asistencia WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: asistencia });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/asistencia/:id - Actualizar
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { presente, observacion } = req.body;
        const stmt = db.prepare(`
            UPDATE asistencia 
            SET presente = ?, observacion = ?
            WHERE id = ?
        `);
        stmt.run(presente, observacion, id);
        const asistencia = db.prepare('SELECT * FROM asistencia WHERE id = ?').get(id);
        res.json({ success: true, data: asistencia });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/asistencia/:id - Eliminar
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM asistencia WHERE id = ?');
        stmt.run(id);
        res.json({ success: true, message: 'Asistencia eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ GET /api/asistencia/promedio - Obtener promedio de asistencia
router.get('/promedio', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT 
                ROUND(AVG(CASE WHEN presente = 1 THEN 100 ELSE 0 END), 0) as promedio,
                COUNT(*) as total_registros
            FROM asistencia
        `);
        const result = stmt.get();
        res.json({ 
            success: true, 
            promedio: result.promedio || 0,
            total_registros: result.total_registros || 0
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;