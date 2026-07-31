/**
 * ========================================
 * CULTURAGEST - SCRIPTS GLOBALES
 * ========================================
 */

// =========================================
// 1. ESPERA QUE EL DOM ESTÉ CARGADO
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CulturaGest - Sistema iniciado correctamente');
    inicializarComponentes();
});

// =========================================
// 2. INICIALIZAR COMPONENTES GLOBALES
// =========================================
function inicializarComponentes() {
    inicializarTogglePassword();
    inicializarCerrarSesion();
    inicializarNotificaciones();
    inicializarBusquedaTablas();
}

// =========================================
// 3. MOSTRAR/OCULTAR CONTRASEÑA
// =========================================
function inicializarTogglePassword() {
    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

// =========================================
// 4. CERRAR SESIÓN
// =========================================
function inicializarCerrarSesion() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Está seguro que desea cerrar sesión?')) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('userEmail');
                sessionStorage.removeItem('userName');
                window.location.href = 'login.html';
            }
        });
    }
}

// =========================================
// 5. NOTIFICACIONES
// =========================================
function inicializarNotificaciones() {
    const notificaciones = document.querySelectorAll('.alert:not(.position-fixed)');
    notificaciones.forEach(alert => {
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'btn-close';
        closeBtn.setAttribute('data-bs-dismiss', 'alert');
        closeBtn.setAttribute('aria-label', 'Cerrar');
        alert.appendChild(closeBtn);
    });
}

// =========================================
// 6. BÚSQUEDA EN TABLAS
// =========================================
function inicializarBusquedaTablas() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const filter = this.value.toLowerCase();
            const tableBody = document.getElementById('participantesTable');
            if (!tableBody) return;
            
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }
}

// =========================================
// 7. FUNCIÓN DE BÚSQUEDA GENÉRICA
// =========================================
function buscarEnTabla(inputId, tableBodyId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = document.querySelectorAll(`#${tableBodyId} tr`);
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    });
}

// =========================================
// 8. FORMATEAR FECHAS
// =========================================
function formatearFecha(fecha) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(fecha).toLocaleDateString('es-PE', options);
}

// =========================================
// 9. VALIDACIONES
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
    return valor.trim().length > 0;
}

// =========================================
// 10. MOSTRAR MENSAJES
// =========================================
function mostrarMensaje(mensaje, tipo = 'success') {
    const alertClass = tipo === 'success' ? 'alert-success' : 'alert-danger';
    const icon = tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" 
             style="z-index: 9999; min-width: 320px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); border-radius: 12px;" role="alert">
            <i class="fas ${icon} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    
    const container = document.createElement('div');
    container.innerHTML = alertHtml;
    document.body.appendChild(container.firstElementChild);
    
    setTimeout(() => {
        const alert = document.querySelector('.alert.position-fixed');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 500);
        }
    }, 5000);
}

// =========================================
// 11. ENVÍO DE FORMULARIOS (SIMULACIÓN)
// =========================================
function enviarFormulario(formId, endpoint, metodo = 'POST') {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        console.log(`📤 Enviando a ${endpoint}:`, data);
        mostrarMensaje('✅ Datos guardados correctamente', 'success');
        this.reset();
    });
}

// =========================================
// 12. CONFIRMAR ACCIONES PELIGROSAS
// =========================================
function confirmarAccion(mensaje) {
    return confirm(mensaje || '¿Está seguro de realizar esta acción?');
}

// =========================================
// 13. VERIFICAR SESIÓN ACTIVA
// =========================================
function verificarSesion() {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}