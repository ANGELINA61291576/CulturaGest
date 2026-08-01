const db = require('../config/database');
const bcrypt = require('bcryptjs');

// =========================================
// MODELO DE USUARIO
// =========================================

class Usuario {
    static findByEmail(email) {
        const stmt = db.prepare('SELECT * FROM usuarios WHERE email = ? AND activo = 1');
        return stmt.get(email);
    }

    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO usuarios (nombre, email, password, rol)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(data.nombre, data.email, data.password, data.rol);
        return this.findByEmail(data.email);
    }

    // ✅ Verificar credenciales (login)
    static verificarCredenciales(email, password) {
        const usuario = this.findByEmail(email);
        if (!usuario) return null;
        
        const valid = bcrypt.compareSync(password, usuario.password);
        return valid ? usuario : null;
    }
}

module.exports = Usuario;