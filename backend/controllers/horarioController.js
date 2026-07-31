const Horario = require('../models/Horario');

exports.getAll = (req, res) => {
    try {
        const horarios = Horario.getAll();
        res.json({ success: true, data: horarios });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = (req, res) => {
    try {
        const { taller_id, dia_semana, hora_inicio, hora_fin } = req.body;
        const horario = Horario.create({ taller_id, dia_semana, hora_inicio, hora_fin });
        res.status(201).json({ success: true, data: horario });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.update = (req, res) => {
    try {
        const { id } = req.params;
        const { dia_semana, hora_inicio, hora_fin } = req.body;
        const horario = Horario.update(id, { dia_semana, hora_inicio, hora_fin });
        res.json({ success: true, data: horario });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.delete = (req, res) => {
    try {
        const { id } = req.params;
        Horario.delete(id);
        res.json({ success: true, message: 'Horario eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};