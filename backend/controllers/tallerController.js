const Taller = require('../models/Taller');

exports.getAll = (req, res) => {
    try {
        const talleres = Taller.getAll();
        res.json({ success: true, data: talleres });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = (req, res) => {
    try {
        const { nombre, categoria, profesor_id, cupos_maximos } = req.body;
        const taller = Taller.create({ nombre, categoria, profesor_id, cupos_maximos });
        res.status(201).json({ success: true, data: taller });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getById = (req, res) => {
    try {
        const { id } = req.params;
        const taller = Taller.getById(id);
        if (!taller) {
            return res.status(404).json({ success: false, error: 'Taller no encontrado' });
        }
        res.json({ success: true, data: taller });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.update = (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, categoria, profesor_id, cupos_maximos } = req.body;
        const taller = Taller.update(id, { nombre, categoria, profesor_id, cupos_maximos });
        res.json({ success: true, data: taller });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.delete = (req, res) => {
    try {
        const { id } = req.params;
        Taller.delete(id);
        res.json({ success: true, message: 'Taller eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};