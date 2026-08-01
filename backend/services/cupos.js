const db = require('../config/database');

// =========================================
// CONTROL DE CUPOS
// =========================================

function verificarCupoDisponible(tallerId, cuposSolicitados = 1) {
    const stmt = db.prepare('SELECT cupos_disponibles FROM talleres WHERE id = ? AND estado = "activo"');
    const resultado = stmt.get(tallerId);
    
    if (!resultado) {
        return { disponible: false, error: 'Taller no encontrado' };
    }
    
    const disponible = resultado.cupos_disponibles >= cuposSolicitados;
    return { 
        disponible, 
        cupos_disponibles: resultado.cupos_disponibles,
        cupos_solicitados: cuposSolicitados
    };
}

function actualizarCupos(tallerId, cantidad) {
    const stmt = db.prepare(`
        UPDATE talleres 
        SET cupos_disponibles = cupos_disponibles - ? 
        WHERE id = ? AND cupos_disponibles >= ?
    `);
    const result = stmt.run(cantidad, tallerId, cantidad);
    
    if (result.changes === 0) {
        return { success: false, error: 'No hay suficientes cupos disponibles' };
    }
    
    return { success: true };
}

function restaurarCupos(tallerId, cantidad) {
    const stmt = db.prepare(`
        UPDATE talleres 
        SET cupos_disponibles = cupos_disponibles + ? 
        WHERE id = ?
    `);
    stmt.run(cantidad, tallerId);
    return { success: true };
}

module.exports = {
    verificarCupoDisponible,
    actualizarCupos,
    restaurarCupos
};