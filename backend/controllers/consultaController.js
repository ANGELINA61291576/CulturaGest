const Consulta = require('../models/Consulta');

exports.getAll = (req, res) => {
    try {
        const consultas = Consulta.getAll();
        res.json({ success: true, data: consultas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = (req, res) => {
    try {
        const { participante_id, tipo, descripcion } = req.body;
        const consulta = Consulta.create({ participante_id, tipo, descripcion });
        res.status(201).json({ success: true, data: consulta });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.update = (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const consulta = Consulta.update(id, { estado });
        res.json({ success: true, data: consulta });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};