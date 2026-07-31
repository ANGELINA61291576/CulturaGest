// =========================================
// VALIDACIONES PARA EL SISTEMA
// =========================================

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefono(telefono) {
    const regex = /^[0-9]{9}$/;
    return regex.test(telefono);
}

function validarCampoVacio(valor) {
    return valor && valor.trim().length > 0;
}

function validarCupos(cuposDisponibles, cuposSolicitados = 1) {
    return cuposDisponibles >= cuposSolicitados;
}

function validarLongitudMinima(valor, minimo) {
    return valor && valor.trim().length >= minimo;
}

function validarRol(rol) {
    const rolesPermitidos = ['administrador', 'coordinador', 'recepcion', 'profesor', 'administracion', 'comunicacion'];
    return rolesPermitidos.includes(rol);
}

module.exports = {
    validarEmail,
    validarTelefono,
    validarCampoVacio,
    validarCupos,
    validarLongitudMinima,
    validarRol
};