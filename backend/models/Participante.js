const db = require('../config/database');

// =========================================
// MODELO DE PARTICIPANTE (ALUMNO)
// =========================================

class Participante {
    // Obtener todos los participantes activos
    static getAll() {
        const stmt = db.prepare('SELECT * FROM participantes WHERE activo = 1 ORDER BY id DESC');
        return stmt.all();
    }

    // Obtener participante por ID
    static getById(id) {
        const stmt = db.prepare('SELECT * FROM participantes WHERE id = ? AND activo = 1');
        return stmt.get(id);
    }

    // Crear nuevo participante
    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO participantes (nombre, apellido, email, telefono)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(data.nombre, data.apellido, data.email, data.telefono);
        return this.getById(result.lastInsertRowid);
    }

    // Actualizar participante
    static update(id, data) {
        const stmt = db.prepare(`
            UPDATE participantes 
            SET nombre = ?, apellido = ?, email = ?, telefono = ?
            WHERE id = ?
        `);
        stmt.run(data.nombre, data.apellido, data.email, data.telefono, id);
        return this.getById(id);
    }

    // Eliminar (soft delete)
    static delete(id) {
        const stmt = db.prepare('UPDATE participantes SET activo = 0 WHERE id = ?');
        return stmt.run(id);
    }

    // Buscar participantes
    static search(termino) {
        const stmt = db.prepare(`
            SELECT * FROM participantes 
            WHERE activo = 1 
            AND (nombre LIKE ? OR apellido LIKE ? OR email LIKE ?)
            ORDER BY id DESC
        `);
        const searchTerm = `%${termino}%`;
        return stmt.all(searchTerm, searchTerm, searchTerm);
    }

    // Contar participantes
    static count() {
        const stmt = db.prepare('SELECT COUNT(*) as total FROM participantes WHERE activo = 1');
        return stmt.get();
    }
}

module.exports = Participante;