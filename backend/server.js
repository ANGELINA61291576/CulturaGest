const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =========================================
// CONFIGURACIÓN
// =========================================
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// =========================================
// ✅ RUTA DE LOGIN DIRECTA
// =========================================
app.post('/api/login', (req, res) => {
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

// =========================================
// HEALTH CHECK
// =========================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CulturaGest API funcionando' });
});

// =========================================
// RUTA PRINCIPAL
// =========================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// =========================================
// ✅ IMPORTAR RUTAS
// =========================================
const participanteRoutes = require('./routes/participantes');
const profesorRoutes = require('./routes/profesores');
const tallerRoutes = require('./routes/talleres');
const inscripcionRoutes = require('./routes/inscripciones');
const asistenciaRoutes = require('./routes/asistencia');
const consultaRoutes = require('./routes/consultas');
const reporteRoutes = require('./routes/reportes');

// =========================================
// ✅ REGISTRAR RUTAS
// =========================================
console.log('📌 Registrando rutas...');
app.use('/api/participantes', participanteRoutes);
console.log('✅ /api/participantes registrada');

app.use('/api/profesores', profesorRoutes);
console.log('✅ /api/profesores registrada');

app.use('/api/talleres', tallerRoutes);
console.log('✅ /api/talleres registrada');

app.use('/api/inscripciones', inscripcionRoutes);
console.log('✅ /api/inscripciones registrada');

app.use('/api/asistencia', asistenciaRoutes);
console.log('✅ /api/asistencia registrada');

app.use('/api/consultas', consultaRoutes);
console.log('✅ /api/consultas registrada');

app.use('/api/reportes', reporteRoutes);
console.log('✅ /api/reportes registrada');

// =========================================
// 404 - Ruta no encontrada
// =========================================
app.use((req, res) => {
    console.log('❌ Ruta no encontrada:', req.method, req.originalUrl);
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// =========================================
// INICIAR SERVIDOR
// =========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`👤 Login: http://localhost:${PORT}/api/login (POST)`);
});