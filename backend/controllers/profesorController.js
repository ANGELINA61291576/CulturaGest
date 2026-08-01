const Profesor = require('../models/Profesor');

exports.getAll = (req, res) => {
    try {
        const profesores = Profesor.getAll();
        res.json({ success: true, data: profesores });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = (req, res) => {
    try {
        const { nombre, apellido, email, especialidad, telefono } = req.body;
        const profesor = Profesor.create({ nombre, apellido, email, especialidad, telefono });
        res.status(201).json({ success: true, data: profesor });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getById = (req, res) => {
    try {
        const { id } = req.params;
        const profesor = Profesor.getById(id);
        if (!profesor) {
            return res.status(404).json({ success: false, error: 'Profesor no encontrado' });
        }
        res.json({ success: true, data: profesor });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.update = (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, especialidad, telefono } = req.body;
        const profesor = Profesor.update(id, { nombre, apellido, email, especialidad, telefono });
        res.json({ success: true, data: profesor });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.delete = (req, res) => {
    try {
        const { id } = req.params;
        Profesor.delete(id);
        res.json({ success: true, message: 'Profesor eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};