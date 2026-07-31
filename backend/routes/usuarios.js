const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =========================================
// ✅ RUTA DE LOGIN DIRECTA (sin controlador)
// =========================================
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('📥 Login intentado:', email);
        
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email y contraseña son requeridos' });
        }
        
        const stmt = db.prepare('SELECT * FROM usuarios WHERE email = ? AND activo = 1');
        const usuario = stmt.get(email);
        
        if (!usuario) {
            console.log('❌ Usuario no encontrado:', email);
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }
        
        const valid = bcrypt.compareSync(password, usuario.password);
        if (!valid) {
            console.log('❌ Contraseña incorrecta para:', email);
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }
        
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            'culturagest_secret',
            { expiresIn: '8h' }
        );
        
        console.log('✅ Login exitoso:', email);
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
        console.error('❌ Error en login:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios');
        const usuarios = stmt.all();
        res.json({ success: true, data: usuarios });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/usuarios - Crear nuevo usuario
router.post('/', (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
        
        const stmt = db.prepare(`
            INSERT INTO usuarios (nombre, email, password, rol)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(nombre, email, passwordHash, rol);
        const usuario = db.prepare('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: usuario });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ success: false, error: 'Email ya registrado' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;