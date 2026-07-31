const Inscripcion = require('../models/Inscripcion');

exports.getAll = (req, res) => {
    try {
        const inscripciones = Inscripcion.getAll();
        res.json({ success: true, data: inscripciones });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = (req, res) => {
    try {
        const { participante_id, taller_id } = req.body;
        const inscripcion = Inscripcion.create({ participante_id, taller_id });
        res.status(201).json({ success: true, data: inscripcion });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.delete = (req, res) => {
    try {
        const { id } = req.params;
        Inscripcion.delete(id);
        res.json({ success: true, message: 'Inscripción cancelada' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};