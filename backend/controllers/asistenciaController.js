const Asistencia = require('../models/Asistencia');

exports.getAll = (req, res) => {
    try {
        const asistencias = Asistencia.getAll();
        res.json({ success: true, data: asistencias });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = (req, res) => {
    try {
        const { inscripcion_id, fecha, presente, observacion } = req.body;
        const asistencia = Asistencia.create({ inscripcion_id, fecha, presente, observacion });
        res.status(201).json({ success: true, data: asistencia });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.update = (req, res) => {
    try {
        const { id } = req.params;
        const { presente, observacion } = req.body;
        const asistencia = Asistencia.update(id, { presente, observacion });
        res.json({ success: true, data: asistencia });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};