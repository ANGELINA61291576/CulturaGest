const Participante = require('../models/Participante');

exports.getAll = (req, res) => {
    try {
        const participantes = Participante.getAll();
        res.json({ success: true, data: participantes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = (req, res) => {
    try {
        const { nombre, apellido, email, telefono } = req.body;
        const participante = Participante.create({ nombre, apellido, email, telefono });
        res.status(201).json({ success: true, data: participante });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getById = (req, res) => {
    try {
        const { id } = req.params;
        const participante = Participante.getById(id);
        if (!participante) {
            return res.status(404).json({ success: false, error: 'Participante no encontrado' });
        }
        res.json({ success: true, data: participante });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.update = (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, telefono } = req.body;
        const participante = Participante.update(id, { nombre, apellido, email, telefono });
        res.json({ success: true, data: participante });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.delete = (req, res) => {
    try {
        const { id } = req.params;
        Participante.delete(id);
        res.json({ success: true, message: 'Participante eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};