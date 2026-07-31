const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validaciones = require('../services/validaciones');

// =========================================
// CONTROLADOR DE USUARIOS
// =========================================

function getUsuarios(req, res) {
    try {
        const db = require('../config/database');
        const stmt = db.prepare('SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios');
        const usuarios = stmt.all();
        res.json({ success: true, data: usuarios });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

function getUsuarioById(req, res) {
    try {
        const { id } = req.params;
        const db = require('../config/database');
        const stmt = db.prepare('SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios WHERE id = ?');
        const usuario = stmt.get(id);
        
        if (!usuario) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        
        res.json({ success: true, data: usuario });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

function createUsuario(req, res) {
    try {
        const { nombre, email, password, rol } = req.body;
        
        if (!validaciones.validarCampoVacio(nombre)) {
            return res.status(400).json({ success: false, error: 'Nombre es requerido' });
        }
        
        if (!validaciones.validarEmail(email)) {
            return res.status(400).json({ success: false, error: 'Email no válido' });
        }
        
        if (!validaciones.validarLongitudMinima(password, 4)) {
            return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 4 caracteres' });
        }
        
        if (!validaciones.validarRol(rol)) {
            return res.status(400).json({ success: false, error: 'Rol no válido' });
        }
        
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
        
        const usuario = Usuario.create({ nombre, email, password: passwordHash, rol });
        res.status(201).json({ 
            success: true, 
            data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ success: false, error: 'Email ya registrado' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}

// =========================================
// ✅ LOGIN - Autenticar usuario
// =========================================
function login(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email y contraseña son requeridos' });
        }
        
        const usuario = Usuario.verificarCredenciales(email, password);
        
        if (!usuario) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }
        
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET || 'culturagest_secret',
            { expiresIn: '8h' }
        );
        
        res.json({
            success: true,
            data: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    login
};