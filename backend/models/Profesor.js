const db = require('../config/database');

// =========================================
// MODELO DE PROFESOR (DOCENTE)
// =========================================

class Profesor {
    static getAll() {
        const stmt = db.prepare('SELECT * FROM profesores WHERE activo = 1 ORDER BY id DESC');
        return stmt.all();
    }

    static getById(id) {
        const stmt = db.prepare('SELECT * FROM profesores WHERE id = ? AND activo = 1');
        return stmt.get(id);
    }

    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO profesores (nombre, apellido, email, especialidad, telefono)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = stmt.run(data.nombre, data.apellido, data.email, data.especialidad, data.telefono);
        return this.getById(result.lastInsertRowid);
    }

    static update(id, data) {
        const stmt = db.prepare(`
            UPDATE profesores 
            SET nombre = ?, apellido = ?, email = ?, especialidad = ?, telefono = ?
            WHERE id = ?
        `);
        stmt.run(data.nombre, data.apellido, data.email, data.especialidad, data.telefono, id);
        return this.getById(id);
    }

    static delete(id) {
        const stmt = db.prepare('UPDATE profesores SET activo = 0 WHERE id = ?');
        return stmt.run(id);
    }

    static search(termino) {
        const stmt = db.prepare(`
            SELECT * FROM profesores 
            WHERE activo = 1 
            AND (nombre LIKE ? OR apellido LIKE ? OR email LIKE ?)
            ORDER BY id DESC
        `);
        const searchTerm = `%${termino}%`;
        return stmt.all(searchTerm, searchTerm, searchTerm);
    }
}

module.exports = Profesor;