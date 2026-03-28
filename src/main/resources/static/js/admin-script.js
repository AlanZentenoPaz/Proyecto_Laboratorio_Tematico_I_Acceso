// static/js/admin-script.js

// ==================== VARIABLES GLOBALES ====================
let adminActual = null;
let alumnoActual = null;
let credencialActual = null;
let reporteSeleccionado = null;

// Variables para registro facial
let facialMediaStream = null;
let facialAlumnoActual = null;
let facialRegistroActual = null;

// Variables para historiales
let entradasActuales = [];
let salidasActuales = [];
let paginaActualEntradas = 1;
let paginaActualSalidas = 1;
let registrosPorPagina = 15;
let registroEntradaSeleccionado = null;
let registroSalidaSeleccionado = null;
let registroBitacoraSeleccionado = null;

// Variables para puntos de acceso
let puntosAccesoLista = [];
let puntoSeleccionado = null;

// ==================== FUNCIONES DE UTILERÍA ====================

function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');

    if (dateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('es-MX', options);
    }

    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('es-MX');
    }
}

if (document.getElementById('current-date')) {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function showMessage(message, type, autoHide = true) {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';

    if (autoHide) {
        setTimeout(() => {
            if (messageBox) messageBox.style.display = 'none';
        }, 5000);
    }
}

function clearMessage() {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.style.display = 'none';
        messageBox.textContent = '';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function registrarBitacora(accion, entidadAfectada, idRegistroAfectado, descripcion, idAdmin) {
    const bitacoraData = {
        accion: accion,
        entidadAfectada: entidadAfectada,
        idRegistroAfectado: idRegistroAfectado,
        descripcion: descripcion,
        fechaHora: new Date().toISOString(),
        idAdmin: idAdmin
    };

    try {
        await fetch('http://localhost:8080/api/bitacora', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bitacoraData)
        });
    } catch (error) {
        console.error('Error al registrar en bitácora:', error);
    }
}

function verificarAutenticacion() {
    const adminGuardado = sessionStorage.getItem('adminActual');
    const protectedPages = ['dashboard.html', 'bitacora.html', 'administrar-credencial.html',
        'administrar-facial.html', 'reportes-tecnicos.html', 'puntos-acceso.html',
        'alta-alumno.html', 'baja-alumno.html', 'actualizar-alumno.html',
        'historial-entradas.html', 'historial-salidas.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (!adminGuardado && protectedPages.includes(currentPage)) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ==================== AUTENTICACIÓN ====================

async function iniciarSesion() {
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    if (!correo || !contrasena) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }

    clearMessage();

    try {
        const response = await fetch(`http://localhost:8080/api/administradores/correo/${correo}`);
        if (!response.ok) {
            showMessage('Correo o contraseña incorrectos', 'error');
            return;
        }

        const admin = await response.json();
        if (admin.contrasenaHash !== contrasena) {
            showMessage('Correo o contraseña incorrectos', 'error');
            return;
        }
        if (admin.estado !== 'Activo') {
            showMessage('Tu cuenta está inactiva. Contacta al administrador del sistema.', 'error');
            return;
        }

        sessionStorage.setItem('adminActual', JSON.stringify(admin));
        showMessage('Inicio de sesión exitoso. Redirigiendo...', 'success', false);
        setTimeout(() => window.location.href = 'dashboard.html', 2000);

    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}

async function registrarAdministrador() {
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const rol = document.getElementById('rol').value;
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;

    if (!nombre || !apellidos || !correo || !telefono || !rol || !usuario || !contrasena) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }
    if (contrasena !== confirmarContrasena) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }

    clearMessage();

    const adminData = {
        nombre, apellidos, correoInstitucional: correo, telefono, rol,
        usuario, contrasenaHash: contrasena, estado: 'Activo'
    };

    try {
        const response = await fetch('http://localhost:8080/api/administradores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminData)
        });

        if (response.ok) {
            showMessage('Registro exitoso. Ahora puedes iniciar sesión.', 'success', false);
            setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
            const error = await response.text();
            showMessage(`Error al registrar: ${error}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}

async function actualizarContrasena() {
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const correo = document.getElementById('correo').value;
    const usuario = document.getElementById('usuario').value;
    const nuevaContrasena = document.getElementById('nueva-contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;

    if (!nombre || !apellidos || !correo || !usuario || !nuevaContrasena) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }

    clearMessage();

    try {
        const response = await fetch(`http://localhost:8080/api/administradores/correo/${correo}`);
        if (!response.ok) {
            showMessage('No se encontró un administrador con ese correo', 'error');
            return;
        }

        const admin = await response.json();
        if (admin.nombre !== nombre || admin.apellidos !== apellidos || admin.usuario !== usuario) {
            showMessage('Los datos proporcionados no coinciden con los registrados', 'error');
            return;
        }

        admin.contrasenaHash = nuevaContrasena;
        const updateResponse = await fetch(`http://localhost:8080/api/administradores/${admin.idAdmin}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(admin)
        });

        if (updateResponse.ok) {
            showMessage('Contraseña actualizada exitosamente. Ahora puedes iniciar sesión.', 'success', false);
            setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
            showMessage('Error al actualizar la contraseña', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}

function cerrarSesion() {
    sessionStorage.removeItem('adminActual');
    window.location.href = 'login.html';
}


// Variable para almacenar datos del admin a eliminar
let adminEliminar = null;

// Función para abrir modal de eliminación de cuenta
function abrirModalEliminarCuenta() {
    // Verificar que los campos del formulario estén completos
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const usuario = document.getElementById('usuario').value.trim();

    if (!nombre || !apellidos || !correo || !usuario) {
        showMessage('Por favor, complete todos los campos de identificación antes de eliminar su cuenta', 'error');
        return;
    }

    // Guardar temporalmente los datos para verificación
    adminEliminar = { nombre, apellidos, correo, usuario };

    // Limpiar campos del modal
    document.getElementById('confirmar-correo-eliminar').value = '';
    document.getElementById('motivo-eliminar-cuenta').value = '';

    // Limpiar mensajes previos
    const messageModal = document.getElementById('message-modal-eliminar-cuenta');
    if (messageModal) {
        messageModal.style.display = 'none';
        messageModal.textContent = '';
    }

    // Mostrar modal
    const modal = document.getElementById('modal-eliminar-cuenta');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Función para cerrar modal de eliminación de cuenta
function cerrarModalEliminarCuenta() {
    const modal = document.getElementById('modal-eliminar-cuenta');
    if (modal) {
        modal.style.display = 'none';
    }
    adminEliminar = null;
}

// Función para confirmar eliminación de cuenta
async function confirmarEliminarCuenta() {
    const correoConfirmacion = document.getElementById('confirmar-correo-eliminar').value.trim();
    const motivo = document.getElementById('motivo-eliminar-cuenta').value.trim();

    // Validar campos
    if (!correoConfirmacion) {
        mostrarMensajeModalEliminarCuenta('Por favor, ingrese su correo institucional para confirmar', 'error');
        return;
    }

    if (!motivo) {
        mostrarMensajeModalEliminarCuenta('Por favor, ingrese el motivo de la eliminación de la cuenta', 'error');
        return;
    }

    // Verificar que el correo coincida con el ingresado en el formulario
    if (correoConfirmacion !== adminEliminar.correo) {
        mostrarMensajeModalEliminarCuenta('El correo ingresado no coincide con el registrado', 'error');
        return;
    }

    // Mostrar loading en el botón
    const btnEliminar = document.querySelector('#modal-eliminar-cuenta .btn-danger');
    const originalText = btnEliminar.textContent;
    btnEliminar.textContent = 'Eliminando cuenta...';
    btnEliminar.disabled = true;

    try {
        // Primero, buscar el administrador por correo para obtener su ID
        const response = await fetch(`http://localhost:8080/api/administradores/correo/${adminEliminar.correo}`);

        if (!response.ok) {
            mostrarMensajeModalEliminarCuenta('No se encontró la cuenta de administrador', 'error');
            btnEliminar.textContent = originalText;
            btnEliminar.disabled = false;
            return;
        }

        const admin = await response.json();

        // Verificar que los datos coincidan completamente
        if (admin.nombre !== adminEliminar.nombre ||
            admin.apellidos !== adminEliminar.apellidos ||
            admin.usuario !== adminEliminar.usuario) {
            mostrarMensajeModalEliminarCuenta('Los datos ingresados no coinciden con los registrados', 'error');
            btnEliminar.textContent = originalText;
            btnEliminar.disabled = false;
            return;
        }

        // Verificar que el administrador no sea el único administrador activo
        const allAdminsResponse = await fetch('http://localhost:8080/api/administradores');
        const allAdmins = await allAdminsResponse.json();
        const adminsActivos = allAdmins.filter(a => a.estado === 'Activo');

        if (adminsActivos.length === 1 && adminsActivos[0].idAdmin === admin.idAdmin) {
            mostrarMensajeModalEliminarCuenta('No se puede eliminar la única cuenta de administrador activa. Primero debe haber al menos otro administrador activo.', 'error');
            btnEliminar.textContent = originalText;
            btnEliminar.disabled = false;
            return;
        }

        // Buscar un administrador por defecto para reasignar registros (el primer admin activo que no sea el que se elimina)
        const adminDefault = adminsActivos.find(a => a.idAdmin !== admin.idAdmin);

        if (!adminDefault) {
            mostrarMensajeModalEliminarCuenta('No hay un administrador alternativo para reasignar los registros', 'error');
            btnEliminar.textContent = originalText;
            btnEliminar.disabled = false;
            return;
        }

        // Registrar en bitácora antes de eliminar
        const descripcion = `Eliminación de cuenta de administrador: ${admin.nombre} ${admin.apellidos} (Usuario: ${admin.usuario}, Correo: ${admin.correoInstitucional}). Motivo: ${motivo}. Registros reasignados al administrador ${adminDefault.nombre} ${adminDefault.apellidos}`;

        await registrarBitacora(
            'Eliminación de Cuenta de Administrador',
            'Administrador',
            admin.idAdmin,
            descripcion,
            adminDefault.idAdmin // Registrar con el admin que recibe los registros
        );

        // Reasignar alumnos registrados por este administrador
        const alumnosResponse = await fetch('http://localhost:8080/api/alumnos');
        const alumnos = await alumnosResponse.json();
        const alumnosAReasignar = alumnos.filter(a => a.idAdminRegistro === admin.idAdmin);

        for (const alumno of alumnosAReasignar) {
            alumno.idAdminRegistro = adminDefault.idAdmin;
            await fetch(`http://localhost:8080/api/alumnos/${alumno.idAlumno}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alumno)
            });
        }

        // Reasignar credenciales autorizadas por este administrador
        const credencialesResponse = await fetch('http://localhost:8080/api/credenciales');
        const credenciales = await credencialesResponse.json();
        const credencialesAReasignar = credenciales.filter(c => c.idAdminAutorizo === admin.idAdmin);

        for (const credencial of credencialesAReasignar) {
            credencial.idAdminAutorizo = adminDefault.idAdmin;
            await fetch(`http://localhost:8080/api/credenciales/${credencial.idCredencial}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credencial)
            });
        }

        // Reasignar registros faciales autorizados por este administrador
        const facialesResponse = await fetch('http://localhost:8080/api/registros-faciales');
        const faciales = await facialesResponse.json();
        const facialesAReasignar = faciales.filter(f => f.idAdminAutorizo === admin.idAdmin);

        for (const facial of facialesAReasignar) {
            facial.idAdminAutorizo = adminDefault.idAdmin;
            await fetch(`http://localhost:8080/api/registros-faciales/${facial.idRegistroFacial}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(facial)
            });
        }

        // Finalmente, eliminar al administrador
        const deleteResponse = await fetch(`http://localhost:8080/api/administradores/${admin.idAdmin}`, {
            method: 'DELETE'
        });

        if (deleteResponse.ok) {
            mostrarMensajeModalEliminarCuenta('✅ Cuenta eliminada exitosamente. Redirigiendo al inicio de sesión...', 'success');

            // Limpiar sesión
            sessionStorage.removeItem('adminActual');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);

        } else {
            const error = await deleteResponse.text();
            mostrarMensajeModalEliminarCuenta(`Error al eliminar la cuenta: ${error}`, 'error');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarMensajeModalEliminarCuenta('Error al conectar con el servidor', 'error');
    } finally {
        btnEliminar.textContent = originalText;
        btnEliminar.disabled = false;
    }
}

// Función para mostrar mensaje en modal de eliminación de cuenta
function mostrarMensajeModalEliminarCuenta(mensaje, tipo) {
    const messageModal = document.getElementById('message-modal-eliminar-cuenta');
    if (messageModal) {
        messageModal.textContent = mensaje;
        messageModal.className = `message-box ${tipo}`;
        messageModal.style.display = 'block';

        // Si es éxito, no ocultar automáticamente
        if (tipo !== 'success') {
            setTimeout(() => {
                if (messageModal) {
                    messageModal.style.display = 'none';
                }
            }, 5000);
        }
    }
}




// ==================== DASHBOARD ====================

async function cargarDashboard() {
    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) {
        window.location.href = 'login.html';
        return;
    }

    adminActual = JSON.parse(adminGuardado);
    const welcomeElement = document.getElementById('welcome-message');
    if (welcomeElement) {
        welcomeElement.textContent = `Bienvenido ${adminActual.nombre} ${adminActual.apellidos}`;
    }

    try {
        const [alumnosResponse, credencialesResponse, facialesResponse, puntosResponse] = await Promise.all([
            fetch('http://localhost:8080/api/alumnos'),
            fetch('http://localhost:8080/api/credenciales'),
            fetch('http://localhost:8080/api/registros-faciales'),
            fetch('http://localhost:8080/api/puntos-acceso')
        ]);

        const alumnos = await alumnosResponse.json();
        const credenciales = await credencialesResponse.json();
        const faciales = await facialesResponse.json();
        const puntos = await puntosResponse.json();

        const alumnosActivos = alumnos.filter(a => a.estatusAcademico === 'Activo').length;
        const credencialesActivas = credenciales.filter(c => c.estatus === 'Activa').length;
        const facialesActivos = faciales.filter(f => f.estado === 'Activo').length;
        const puntosActivos = puntos.filter(p => p.estado === 'Activo').length;

        document.getElementById('alumnos-activos').textContent = alumnosActivos;
        document.getElementById('credenciales-activas').textContent = credencialesActivas;
        document.getElementById('registros-faciales').textContent = facialesActivos;
        document.getElementById('puntos-acceso').textContent = puntosActivos;

    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        showMessage('Error al cargar las estadísticas del dashboard', 'error');
    }
}

function redirectTo(section) {
    const pages = {
        'alta-alumno': 'alta-alumno.html',
        'baja-alumno': 'baja-alumno.html',
        'actualizar-alumno': 'actualizar-alumno.html',
        'administrar-credencial': 'administrar-credencial.html',
        'administrar-facial': 'administrar-facial.html',
        'historial-entradas': 'historial-entradas.html',
        'historial-salidas': 'historial-salidas.html',
        'reportes-tecnicos': 'reportes-tecnicos.html',
        'bitacora': 'bitacora.html',
        'puntos-acceso': 'puntos-acceso.html'
    };

    if (pages[section]) {
        window.location.href = pages[section];
    } else {
        console.log('Sección no implementada');
    }
}

// ==================== GESTIÓN DE ALUMNOS ====================

async function registrarAlumno() {
    const matricula = document.getElementById('matricula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    const licenciatura = document.getElementById('licenciatura').value.trim();
    const trimestreActual = document.getElementById('trimestre-actual').value;
    const estatusAcademico = document.getElementById('estatus-academico').value;

    if (!matricula || !nombre || !apellidos || !correo || !fechaNacimiento || !licenciatura || !trimestreActual || !estatusAcademico) {
        showMessage('Por favor, completa todos los campos requeridos', 'error');
        return;
    }

    if (!correo.endsWith('@cua.uam.mx') && !correo.endsWith('@uam.mx')) {
        showMessage('El correo debe ser institucional (@cua.uam.mx o @uam.mx)', 'error');
        return;
    }

    const trimestreNum = parseInt(trimestreActual);
    if (trimestreNum < 1 || trimestreNum > 12) {
        showMessage('El trimestre actual debe estar entre 1 y 12', 'error');
        return;
    }

    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) {
        showMessage('Sesión no válida', 'error');
        return;
    }
    const adminActualObj = JSON.parse(adminGuardado);

    const alumnoData = {
        matricula, nombre, apellidos, correoInstitucional: correo,
        telefono: telefono || null, fechaNacimiento, licenciatura,
        trimestreActual: trimestreNum, estatusAcademico,
        estadoCuenta: 'Activa', idAdminRegistro: adminActualObj.idAdmin
    };

    const btnSubmit = document.querySelector('.btn-registrar');
    const originalText = btnSubmit.textContent;
    btnSubmit.textContent = 'Registrando...';
    btnSubmit.disabled = true;

    try {
        const response = await fetch('http://localhost:8080/api/alumnos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alumnoData)
        });

        if (response.ok) {
            const nuevoAlumno = await response.json();
            await registrarBitacora('Alta de Alumno', 'Alumno', nuevoAlumno.idAlumno,
                `Alta de alumno: ${nombre} ${apellidos} (Matrícula: ${matricula})`, adminActualObj.idAdmin);
            showMessage('✅ Alumno registrado exitosamente. Redirigiendo...', 'success', false);
            setTimeout(() => window.location.href = 'dashboard.html', 3000);
        } else {
            const error = await response.text();
            let mensajeError = 'Error al registrar el alumno';
            if (error.includes('matrícula')) mensajeError = 'La matrícula ya existe';
            else if (error.includes('correo')) mensajeError = 'El correo ya está registrado';
            showMessage(`❌ ${mensajeError}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('❌ Error al conectar con el servidor', 'error');
    } finally {
        btnSubmit.textContent = originalText;
        btnSubmit.disabled = false;
    }
}

// ==================== CREDENCIALES ====================

function generarCodigoQR() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'QR_';
    for (let i = 0; i < 9; i++) codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return codigo + '_' + new Date().getFullYear();
}

async function buscarAlumno() {
    const matricula = document.getElementById('matricula').value.trim();
    if (!matricula) {
        showMessage('Por favor, ingrese una matrícula', 'error');
        return;
    }
    clearMessage();

    try {
        const response = await fetch(`http://localhost:8080/api/alumnos/matricula/${matricula}`);
        if (!response.ok) {
            showMessage('Alumno no encontrado', 'error');
            document.getElementById('alumno-container').style.display = 'none';
            document.getElementById('credencial-form').style.display = 'none';
            return;
        }

        alumnoActual = await response.json();
        let adminRegistroNombre = 'No disponible';
        if (alumnoActual.idAdminRegistro) {
            try {
                const adminResponse = await fetch(`http://localhost:8080/api/administradores/${alumnoActual.idAdminRegistro}`);
                if (adminResponse.ok) {
                    const admin = await adminResponse.json();
                    adminRegistroNombre = `${admin.nombre} ${admin.apellidos}`;
                }
            } catch (error) { console.error('Error:', error); }
        }

        mostrarInfoAlumno(alumnoActual, adminRegistroNombre);

        const credencialResponse = await fetch(`http://localhost:8080/api/credenciales/alumno/${alumnoActual.idAlumno}`);
        if (credencialResponse.ok) {
            credencialActual = await credencialResponse.json();
            mostrarFormularioCredencialExistente(credencialActual);
        } else {
            credencialActual = null;
            mostrarFormularioNuevaCredencial();
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}

function mostrarInfoAlumno(alumno, adminRegistroNombre) {
    const container = document.getElementById('alumno-container');
    container.innerHTML = `
        <div class="alumno-info">
            <h3>📋 Información del Alumno</h3>
            <div class="info-grid">
                ${[
        ['Nombre:', alumno.nombre], ['Apellidos:', alumno.apellidos],
        ['Matrícula:', alumno.matricula], ['Correo:', alumno.correoInstitucional],
        ['Teléfono:', alumno.telefono || 'No registrado'],
        ['Fecha Nacimiento:', alumno.fechaNacimiento ? new Date(alumno.fechaNacimiento).toLocaleDateString('es-MX') : 'No registrada'],
        ['Licenciatura:', alumno.licenciatura || 'No registrada'],
        ['Trimestre:', alumno.trimestreActual || 'No registrado'],
        ['Estatus Académico:', alumno.estatusAcademico],
        ['Fecha Registro:', new Date(alumno.fechaRegistro).toLocaleDateString('es-MX')],
        ['Registrado por:', adminRegistroNombre]
    ].map(([label, value]) => `<div class="info-item"><label>${label}</label><span>${escapeHtml(value)}</span></div>`).join('')}
            </div>
        </div>
    `;
    container.style.display = 'block';
}

function mostrarFormularioNuevaCredencial() {
    const container = document.getElementById('credencial-form');
    container.innerHTML = `
        <div class="credencial-section">
            <h3>🎫 Asignar Credencial</h3>
            <div class="alert-info">⚠️ El alumno no tiene credencial asignada.</div>
            <div class="qr-generator">
                <button class="btn btn-secondary" onclick="generarNuevoCodigo()">Generar Código QR</button>
                <div class="qr-code-display"><input type="text" id="codigo-qr" value="${generarCodigoQR()}" disabled></div>
            </div>
            <div class="btn-center"><button class="btn btn-success" onclick="asignarCredencial()">Asignar Código QR</button></div>
        </div>
    `;
    container.style.display = 'block';
}

function generarNuevoCodigo() {
    const inputCodigo = document.getElementById('codigo-qr');
    if (inputCodigo) {
        inputCodigo.value = generarCodigoQR();
        showMessage('Nuevo código QR generado', 'success');
    }
}

async function asignarCredencial() {
    const codigoQR = document.getElementById('codigo-qr').value;
    if (!codigoQR) {
        showMessage('No se ha generado un código QR', 'error');
        return;
    }

    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) return showMessage('Sesión no válida', 'error');
    const adminActualObj = JSON.parse(adminGuardado);

    const fechaEmision = new Date();
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 365);

    try {
        const response = await fetch('http://localhost:8080/api/credenciales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codigoQr: codigoQR, fechaEmision: fechaEmision.toISOString().split('T')[0],
                fechaExpiracion: fechaExpiracion.toISOString().split('T')[0], estatus: 'Activa',
                idAlumno: alumnoActual.idAlumno, idAdminAutorizo: adminActualObj.idAdmin
            })
        });

        if (response.ok) {
            await registrarBitacora('Asignación de Credencial', 'Credencial', alumnoActual.idAlumno,
                `Asignación de credencial QR al alumno ${alumnoActual.nombre} ${alumnoActual.apellidos}`, adminActualObj.idAdmin);
            showMessage('✅ Credencial asignada exitosamente. Redirigiendo...', 'success', false);
            setTimeout(() => window.location.href = 'dashboard.html', 4000);
        } else {
            showMessage(`Error al asignar credencial: ${await response.text()}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}

// Reemplazar la función mostrarFormularioCredencialExistente en admin-script.js

function mostrarFormularioCredencialExistente(credencial) {
    const container = document.getElementById('credencial-form');

    // Obtener administrador actual para mostrar en el botón de eliminación
    const adminGuardado = sessionStorage.getItem('adminActual');
    let adminNombre = '';
    if (adminGuardado) {
        const admin = JSON.parse(adminGuardado);
        adminNombre = `${admin.nombre} ${admin.apellidos}`;
    }

    container.innerHTML = `
        <div class="credencial-section">
            <h3>🎫 Credencial Existente</h3>
            <div class="credencial-info">
                <h4>Información de la Credencial Actual</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Código QR:</label>
                        <input type="text" id="codigo-actual" value="${escapeHtml(credencial.codigoQr)}" disabled>
                    </div>
                    <div class="info-item">
                        <label>Fecha de Emisión:</label>
                        <input type="text" value="${new Date(credencial.fechaEmision).toLocaleDateString('es-MX')}" disabled>
                    </div>
                    <div class="info-item">
                        <label>Fecha de Expiración:</label>
                        <input type="text" value="${new Date(credencial.fechaExpiracion).toLocaleDateString('es-MX')}" disabled>
                    </div>
                    <div class="info-item">
                        <label>Estatus:</label>
                        <input type="text" value="${credencial.estatus}" disabled>
                    </div>
                </div>
            </div>
            
            <div class="qr-generator">
                <button class="btn btn-warning-custom" onclick="generarNuevoCodigoExistente()">Generar Nuevo Código QR a Alumno</button>
                <div class="qr-code-display">
                    <input type="text" id="codigo-nuevo" value="${generarCodigoQR()}" disabled>
                </div>
            </div>
            
            <div class="status-select">
                <label>Estatus de Credencial:</label>
                <select id="estatus-credencial">
                    <option value="Activa" ${credencial.estatus === 'Activa' ? 'selected' : ''}>Activa</option>
                    <option value="Extraviada" ${credencial.estatus === 'Extraviada' ? 'selected' : ''}>Extraviada</option>
                    <option value="En_tramite" ${credencial.estatus === 'En_tramite' ? 'selected' : ''}>En trámite</option>
                    <option value="Cancelada" ${credencial.estatus === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                </select>
            </div>
            
            <div class="form-actions" style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                <button class="btn btn-primary" onclick="actualizarCredencialExistente(${credencial.idCredencial})">Registrar Actualización de Credencial</button>
                <button class="btn btn-danger" onclick="abrirModalEliminarCredencial(${credencial.idCredencial})">🗑️ Eliminar Credencial</button>
            </div>
        </div>
    `;

    container.style.display = 'block';
    credencialActual = credencial;
}

function generarNuevoCodigoExistente() {
    const inputCodigo = document.getElementById('codigo-nuevo');
    if (inputCodigo) {
        inputCodigo.value = generarCodigoQR();
        showMessage('Nuevo código QR generado', 'success');
    }
}

async function actualizarCredencialExistente(idCredencial) {
    const nuevoCodigo = document.getElementById('codigo-nuevo').value;
    const nuevoEstatus = document.getElementById('estatus-credencial').value;

    if (!nuevoCodigo) {
        showMessage('No se ha generado un nuevo código QR', 'error');
        return;
    }

    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) return showMessage('Sesión no válida', 'error');
    const adminActualObj = JSON.parse(adminGuardado);

    const fechaEmision = new Date();
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 365);

    try {
        const response = await fetch(`http://localhost:8080/api/credenciales/${idCredencial}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idCredencial, codigoQr: nuevoCodigo,
                fechaEmision: fechaEmision.toISOString().split('T')[0],
                fechaExpiracion: fechaExpiracion.toISOString().split('T')[0],
                estatus: nuevoEstatus, idAlumno: alumnoActual.idAlumno, idAdminAutorizo: adminActualObj.idAdmin
            })
        });

        if (response.ok) {
            await registrarBitacora('Actualización de Credencial', 'Credencial', alumnoActual.idAlumno,
                `Actualización credencial para ${alumnoActual.nombre} ${alumnoActual.apellidos}. Nuevo estatus: ${nuevoEstatus}`, adminActualObj.idAdmin);
            showMessage('✅ Credencial actualizada exitosamente. Redirigiendo...', 'success', false);
            setTimeout(() => window.location.href = 'dashboard.html', 4000);
        } else {
            showMessage(`Error al actualizar: ${await response.text()}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}


// Agregar esta función en la sección de CREDENCIALES

async function abrirModalEliminarCredencial(idCredencial) {
    try {
        const response = await fetch(`http://localhost:8080/api/credenciales/${idCredencial}`);

        if (!response.ok) {
            showMessage('Error al cargar los datos de la credencial', 'error');
            return;
        }

        const credencial = await response.json();

        // Obtener datos del alumno
        const alumnoResponse = await fetch(`http://localhost:8080/api/alumnos/${credencial.idAlumno}`);
        let alumnoNombre = 'No disponible';
        if (alumnoResponse.ok) {
            const alumno = await alumnoResponse.json();
            alumnoNombre = `${alumno.nombre} ${alumno.apellidos}`;
        }

        const modalHtml = `
            <div id="modal-eliminar-credencial" class="modal-editar" style="display: block;">
                <div class="modal-editar-content">
                    <div class="modal-editar-header" style="background: #dc3545;">
                        <h3>⚠️ Confirmar Eliminación de Credencial</h3>
                        <span class="modal-editar-close" onclick="cerrarModalEliminarCredencial()">&times;</span>
                    </div>
                    <div class="modal-editar-body">
                        <p>¿Está seguro de que desea eliminar esta credencial?</p>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p><strong>ID Credencial:</strong> ${credencial.idCredencial}</p>
                            <p><strong>Alumno:</strong> ${escapeHtml(alumnoNombre)}</p>
                            <p><strong>Código QR:</strong> ${escapeHtml(credencial.codigoQr)}</p>
                            <p><strong>Fecha Emisión:</strong> ${new Date(credencial.fechaEmision).toLocaleDateString('es-MX')}</p>
                            <p><strong>Estatus:</strong> ${credencial.estatus}</p>
                        </div>
                        <p style="color: #dc3545; font-size: 14px; margin-top: 10px;">
                            <strong>Advertencia:</strong> Esta acción eliminará permanentemente la credencial del sistema.
                            El alumno quedará sin credencial asignada.
                        </p>
                        
                        <div class="form-group">
                            <label>Motivo de la eliminación:</label>
                            <textarea id="motivo-eliminar-credencial" placeholder="Describa el motivo por el cual se elimina esta credencial..." required></textarea>
                            <div class="field-info">Este motivo quedará registrado en la bitácora del sistema</div>
                        </div>
                        
                        <div id="message-modal-eliminar-credencial" class="message-box" style="display: none;"></div>
                    </div>
                    <div class="modal-editor-footer">
                        <button class="btn btn-secondary btn-small" onclick="cerrarModalEliminarCredencial()">Cancelar</button>
                        <button class="btn btn-danger btn-small" onclick="confirmarEliminarCredencial(${credencial.idCredencial}, ${credencial.idAlumno})">Eliminar Credencial</button>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('modal-eliminar-credencial');
        if (existingModal) existingModal.remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);

    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar los datos de la credencial', 'error');
    }
}

// Función para confirmar eliminación de credencial
async function confirmarEliminarCredencial(idCredencial, idAlumno) {
    const motivo = document.getElementById('motivo-eliminar-credencial').value.trim();

    if (!motivo) {
        mostrarMensajeModalEliminarCredencial('Por favor, ingrese el motivo de la eliminación', 'error');
        return;
    }

    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) {
        mostrarMensajeModalEliminarCredencial('Sesión no válida', 'error');
        return;
    }

    const adminActualObj = JSON.parse(adminGuardado);

    // Obtener nombre del alumno para la bitácora
    let alumnoNombre = 'desconocido';
    try {
        const alumnoResponse = await fetch(`http://localhost:8080/api/alumnos/${idAlumno}`);
        if (alumnoResponse.ok) {
            const alumno = await alumnoResponse.json();
            alumnoNombre = `${alumno.nombre} ${alumno.apellidos}`;
        }
    } catch (error) {
        console.error('Error al obtener alumno:', error);
    }

    const btnEliminar = document.querySelector('#modal-eliminar-credencial .btn-danger');
    const originalText = btnEliminar.textContent;
    btnEliminar.textContent = 'Eliminando...';
    btnEliminar.disabled = true;

    try {
        const response = await fetch(`http://localhost:8080/api/credenciales/${idCredencial}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Registrar en bitácora
            const descripcion = `Eliminación de credencial del alumno ${alumnoNombre} (ID Credencial: ${idCredencial}). Motivo: ${motivo}`;

            await registrarBitacora(
                'Eliminación de Credencial',
                'Credencial',
                idAlumno,
                descripcion,
                adminActualObj.idAdmin
            );

            mostrarMensajeModalEliminarCredencial('✅ Credencial eliminada exitosamente', 'success');

            setTimeout(() => {
                cerrarModalEliminarCredencial();
                // Recargar la página para mostrar que ya no tiene credencial
                buscarAlumno();
            }, 1500);

        } else {
            const error = await response.text();
            mostrarMensajeModalEliminarCredencial(`Error al eliminar: ${error}`, 'error');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarMensajeModalEliminarCredencial('Error al conectar con el servidor', 'error');
    } finally {
        btnEliminar.textContent = originalText;
        btnEliminar.disabled = false;
    }
}

function mostrarMensajeModalEliminarCredencial(mensaje, tipo) {
    const messageModal = document.getElementById('message-modal-eliminar-credencial');
    if (messageModal) {
        messageModal.textContent = mensaje;
        messageModal.className = `message-box ${tipo}`;
        messageModal.style.display = 'block';

        setTimeout(() => {
            if (messageModal) {
                messageModal.style.display = 'none';
            }
        }, 3000);
    }
}

function cerrarModalEliminarCredencial() {
    const modal = document.getElementById('modal-eliminar-credencial');
    if (modal) {
        modal.remove();
    }
}






// ==================== REGISTRO FACIAL ====================

function generarPlantillaFacial() {
    const coordenadas = [];
    for (let i = 0; i < 8; i++) coordenadas.push((Math.random() * 0.9 + 0.1).toFixed(2));
    return coordenadas.join(', ');
}

async function iniciarCamaraFacial() {
    const video = document.getElementById('facial-video');
    if (!video) return;
    try {
        if (facialMediaStream) facialMediaStream.getTracks().forEach(track => track.stop());
        facialMediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = facialMediaStream;
        await video.play();
    } catch (err) {
        console.error('Error:', err);
        showMessage('No se pudo acceder a la cámara.', 'error');
    }
}

function detenerCamaraFacial() {
    if (facialMediaStream) {
        facialMediaStream.getTracks().forEach(track => track.stop());
        facialMediaStream = null;
    }
}

async function buscarAlumnoFacial() {
    const matricula = document.getElementById('matricula').value.trim();
    if (!matricula) {
        showMessage('Por favor, ingrese una matrícula', 'error');
        return;
    }
    clearMessage();

    try {
        const response = await fetch(`http://localhost:8080/api/alumnos/matricula/${matricula}`);
        if (!response.ok) {
            showMessage('Alumno no encontrado', 'error');
            document.getElementById('alumno-container-facial').style.display = 'none';
            document.getElementById('facial-form').style.display = 'none';
            return;
        }

        facialAlumnoActual = await response.json();
        let adminRegistroNombre = 'No disponible';
        if (facialAlumnoActual.idAdminRegistro) {
            try {
                const adminResponse = await fetch(`http://localhost:8080/api/administradores/${facialAlumnoActual.idAdminRegistro}`);
                if (adminResponse.ok) {
                    const admin = await adminResponse.json();
                    adminRegistroNombre = `${admin.nombre} ${admin.apellidos}`;
                }
            } catch (error) { console.error('Error:', error); }
        }

        mostrarInfoAlumnoFacial(facialAlumnoActual, adminRegistroNombre);

        const facialResponse = await fetch(`http://localhost:8080/api/registros-faciales/alumno/${facialAlumnoActual.idAlumno}`);
        if (facialResponse.ok) {
            facialRegistroActual = await facialResponse.json();
            mostrarFormularioFacialExistente(facialRegistroActual);
        } else {
            facialRegistroActual = null;
            mostrarFormularioNuevoRegistroFacial();
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}

function mostrarInfoAlumnoFacial(alumno, adminRegistroNombre) {
    const container = document.getElementById('alumno-container-facial');
    container.innerHTML = `
        <div class="alumno-info">
            <h3>📋 Información del Alumno</h3>
            <div class="info-grid">
                ${[
        ['Nombre:', alumno.nombre], ['Apellidos:', alumno.apellidos],
        ['Matrícula:', alumno.matricula], ['Correo:', alumno.correoInstitucional],
        ['Teléfono:', alumno.telefono || 'No registrado'],
        ['Fecha Nacimiento:', alumno.fechaNacimiento ? new Date(alumno.fechaNacimiento).toLocaleDateString('es-MX') : 'No registrada'],
        ['Licenciatura:', alumno.licenciatura || 'No registrada'],
        ['Trimestre:', alumno.trimestreActual || 'No registrado'],
        ['Estatus Académico:', alumno.estatusAcademico],
        ['Fecha Registro:', new Date(alumno.fechaRegistro).toLocaleDateString('es-MX')],
        ['Registrado por:', adminRegistroNombre]
    ].map(([label, value]) => `<div class="info-item"><label>${label}</label><span>${escapeHtml(value)}</span></div>`).join('')}
            </div>
        </div>
    `;
    container.style.display = 'block';
}

function mostrarFormularioNuevoRegistroFacial() {
    const container = document.getElementById('facial-form');
    container.innerHTML = `
        <div class="credencial-section">
            <h3>👤 Registrar Mapeo Facial</h3>
            <div class="alert-info">⚠️ El alumno no tiene registro facial.</div>
            <div class="facial-scanner">
                <h4>📸 Escaneo Facial</h4>
                <div class="video-container-facial"><video id="facial-video" autoplay playsinline></video></div>
                <div class="capture-button"><button class="btn btn-capture" onclick="capturarYGenerarPlantilla()">Escanear para Generar Plantilla</button></div>
            </div>
            <div id="coordenadas-generadas"></div>
            <div class="qr-generator">
                <button class="btn btn-secondary" onclick="generarNuevaPlantillaFacial()">Generar Plantilla Manual</button>
                <div class="qr-code-display"><input type="text" id="plantilla-facial" value="${generarPlantillaFacial()}" disabled style="font-family: monospace;"></div>
            </div>
            <div class="btn-center"><button class="btn btn-success" onclick="asignarRegistroFacial()">Asignar Registro Facial</button></div>
        </div>
    `;
    container.style.display = 'block';
    setTimeout(() => iniciarCamaraFacial(), 100);
}

function generarNuevaPlantillaFacial() {
    const inputPlantilla = document.getElementById('plantilla-facial');
    if (inputPlantilla) {
        inputPlantilla.value = generarPlantillaFacial();
        mostrarCoordenadasGeneradas(inputPlantilla.value);
        showMessage('Nueva plantilla facial generada', 'success');
    }
}

function mostrarCoordenadasGeneradas(plantilla) {
    const container = document.getElementById('coordenadas-generadas');
    if (!container) return;
    const valores = plantilla.split(', ');
    container.innerHTML = `
        <div class="facial-template-info">
            <h5>🎯 Coordenadas Generadas:</h5>
            <div class="template-values">
                ${valores.map((v, i) => `<div class="template-value"><strong>Punto ${i+1}</strong>${v}</div>`).join('')}
            </div>
        </div>
    `;
}

async function capturarYGenerarPlantilla() {
    const video = document.getElementById('facial-video');
    if (!video || !video.videoWidth) {
        showMessage('La cámara no está activa', 'error');
        return;
    }
    const nuevaPlantilla = generarPlantillaFacial();
    const inputPlantilla = document.getElementById('plantilla-facial');
    if (inputPlantilla) {
        inputPlantilla.value = nuevaPlantilla;
        mostrarCoordenadasGeneradas(nuevaPlantilla);
        showMessage('Plantilla facial generada desde la cámara', 'success');
    }
}

async function asignarRegistroFacial() {
    const plantillaFacial = document.getElementById('plantilla-facial').value;
    if (!plantillaFacial) {
        showMessage('No se ha generado una plantilla facial', 'error');
        return;
    }

    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) return showMessage('Sesión no válida', 'error');
    const adminActualObj = JSON.parse(adminGuardado);

    try {
        const response = await fetch('http://localhost:8080/api/registros-faciales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plantillaFacial, fechaRegistro: new Date().toISOString(),
                estado: 'Activo', idAlumno: facialAlumnoActual.idAlumno,
                idAdminAutorizo: adminActualObj.idAdmin
            })
        });

        if (response.ok) {
            await registrarBitacora('Asignación de Registro Facial', 'Registro Facial', facialAlumnoActual.idAlumno,
                `Asignación de registro facial al alumno ${facialAlumnoActual.nombre} ${facialAlumnoActual.apellidos}`, adminActualObj.idAdmin);
            showMessage('✅ Registro facial asignado. Redirigiendo...', 'success', false);
            setTimeout(() => { detenerCamaraFacial(); window.location.href = 'dashboard.html'; }, 4000);
        } else {
            showMessage(`Error: ${await response.text()}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}

// Reemplazar la función mostrarFormularioFacialExistente en admin-script.js

function mostrarFormularioFacialExistente(registro) {
    const container = document.getElementById('facial-form');

    const coordenadas = registro.plantillaFacial.split(', ');

    container.innerHTML = `
        <div class="credencial-section">
            <h3>👤 Registro Facial Existente</h3>
            <div class="credencial-info">
                <h4>Información del Registro Facial Actual</h4>
                <div class="facial-template-info">
                    <h5>📊 Coordenadas de Mapeo Facial Actuales:</h5>
                    <div class="template-values">
                        ${coordenadas.map((valor, index) => `
                            <div class="template-value">
                                <strong>Punto ${index + 1}</strong>
                                ${valor}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="info-item" style="margin-top: 15px;">
                    <label>Fecha de Registro:</label>
                    <input type="text" value="${new Date(registro.fechaRegistro).toLocaleString('es-MX')}" disabled>
                </div>
                <div class="info-item">
                    <label>Estado:</label>
                    <input type="text" value="${registro.estado}" disabled>
                </div>
            </div>
            
            <div class="facial-scanner">
                <h4>📸 Escaneo Facial</h4>
                <div class="video-container-facial">
                    <video id="facial-video" autoplay playsinline></video>
                </div>
                <div class="capture-button">
                    <button class="btn btn-capture" onclick="capturarYGenerarPlantilla()">Escanear para Generar Nueva Plantilla Facial</button>
                </div>
            </div>
            
            <div id="coordenadas-generadas"></div>
            
            <div class="qr-generator">
                <button class="btn btn-warning-custom" onclick="generarNuevaPlantillaFacialExistente()">Generar Nueva Plantilla Facial a Alumno</button>
                <div class="qr-code-display">
                    <input type="text" id="plantilla-facial-nueva" value="${generarPlantillaFacial()}" disabled style="font-family: monospace;">
                </div>
            </div>
            
            <div class="facial-status">
                <label>Estado del Registro Facial:</label>
                <select id="estado-facial">
                    <option value="Activo" ${registro.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                    <option value="Inactivo" ${registro.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                </select>
            </div>
            
            <div class="form-actions" style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                <button class="btn btn-primary" onclick="actualizarRegistroFacialExistente(${registro.idRegistroFacial})">Registrar Actualización de Registro Facial</button>
                <button class="btn btn-danger" onclick="abrirModalEliminarRegistroFacial(${registro.idRegistroFacial})">🗑️ Eliminar Registro Facial</button>
            </div>
        </div>
    `;

    container.style.display = 'block';
    facialRegistroActual = registro;

    setTimeout(() => {
        iniciarCamaraFacial();
    }, 100);
}

function generarNuevaPlantillaFacialExistente() {
    const inputPlantilla = document.getElementById('plantilla-facial-nueva');
    if (inputPlantilla) {
        inputPlantilla.value = generarPlantillaFacial();
        mostrarCoordenadasGeneradas(inputPlantilla.value);
        showMessage('Nueva plantilla facial generada', 'success');
    }
}

async function actualizarRegistroFacialExistente(idRegistroFacial) {
    const nuevaPlantilla = document.getElementById('plantilla-facial-nueva').value;
    const nuevoEstado = document.getElementById('estado-facial').value;

    if (!nuevaPlantilla) {
        showMessage('No se ha generado una nueva plantilla', 'error');
        return;
    }

    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) return showMessage('Sesión no válida', 'error');
    const adminActualObj = JSON.parse(adminGuardado);

    try {
        const response = await fetch(`http://localhost:8080/api/registros-faciales/${idRegistroFacial}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idRegistroFacial, plantillaFacial: nuevaPlantilla,
                fechaActualizacion: new Date().toISOString(), estado: nuevoEstado,
                idAlumno: facialAlumnoActual.idAlumno, idAdminAutorizo: adminActualObj.idAdmin
            })
        });

        if (response.ok) {
            await registrarBitacora('Actualización de Registro Facial', 'Registro Facial', facialAlumnoActual.idAlumno,
                `Actualización registro facial para ${facialAlumnoActual.nombre} ${facialAlumnoActual.apellidos}. Nuevo estado: ${nuevoEstado}`, adminActualObj.idAdmin);
            showMessage('✅ Registro facial actualizado. Redirigiendo...', 'success', false);
            setTimeout(() => { detenerCamaraFacial(); window.location.href = 'dashboard.html'; }, 4000);
        } else {
            showMessage(`Error: ${await response.text()}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}


// Agregar esta función en la sección de REGISTRO FACIAL

async function abrirModalEliminarRegistroFacial(idRegistroFacial) {
    try {
        const response = await fetch(`http://localhost:8080/api/registros-faciales/${idRegistroFacial}`);

        if (!response.ok) {
            showMessage('Error al cargar los datos del registro facial', 'error');
            return;
        }

        const registro = await response.json();

        // Obtener datos del alumno
        const alumnoResponse = await fetch(`http://localhost:8080/api/alumnos/${registro.idAlumno}`);
        let alumnoNombre = 'No disponible';
        if (alumnoResponse.ok) {
            const alumno = await alumnoResponse.json();
            alumnoNombre = `${alumno.nombre} ${alumno.apellidos}`;
        }

        // Mostrar primeras coordenadas para referencia
        const coordenadas = registro.plantillaFacial.split(', ');
        const coordenadasPreview = coordenadas.slice(0, 4).join(', ') + (coordenadas.length > 4 ? '...' : '');

        const modalHtml = `
            <div id="modal-eliminar-facial" class="modal-editar" style="display: block;">
                <div class="modal-editar-content">
                    <div class="modal-editar-header" style="background: #dc3545;">
                        <h3>⚠️ Confirmar Eliminación de Registro Facial</h3>
                        <span class="modal-editar-close" onclick="cerrarModalEliminarRegistroFacial()">&times;</span>
                    </div>
                    <div class="modal-editar-body">
                        <p>¿Está seguro de que desea eliminar este registro facial?</p>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p><strong>ID Registro:</strong> ${registro.idRegistroFacial}</p>
                            <p><strong>Alumno:</strong> ${escapeHtml(alumnoNombre)}</p>
                            <p><strong>Plantilla Facial:</strong> ${escapeHtml(coordenadasPreview)}</p>
                            <p><strong>Fecha Registro:</strong> ${new Date(registro.fechaRegistro).toLocaleDateString('es-MX')}</p>
                            <p><strong>Estado:</strong> ${registro.estado}</p>
                        </div>
                        <p style="color: #dc3545; font-size: 14px; margin-top: 10px;">
                            <strong>Advertencia:</strong> Esta acción eliminará permanentemente el registro facial del sistema.
                            El alumno quedará sin registro facial asignado.
                        </p>
                        
                        <div class="form-group">
                            <label>Motivo de la eliminación:</label>
                            <textarea id="motivo-eliminar-facial" placeholder="Describa el motivo por el cual se elimina este registro facial..." required></textarea>
                            <div class="field-info">Este motivo quedará registrado en la bitácora del sistema</div>
                        </div>
                        
                        <div id="message-modal-eliminar-facial" class="message-box" style="display: none;"></div>
                    </div>
                    <div class="modal-editor-footer">
                        <button class="btn btn-secondary btn-small" onclick="cerrarModalEliminarRegistroFacial()">Cancelar</button>
                        <button class="btn btn-danger btn-small" onclick="confirmarEliminarRegistroFacial(${registro.idRegistroFacial}, ${registro.idAlumno})">Eliminar Registro Facial</button>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('modal-eliminar-facial');
        if (existingModal) existingModal.remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);

    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar los datos del registro facial', 'error');
    }
}

// Función para confirmar eliminación de registro facial
async function confirmarEliminarRegistroFacial(idRegistroFacial, idAlumno) {
    const motivo = document.getElementById('motivo-eliminar-facial').value.trim();

    if (!motivo) {
        mostrarMensajeModalEliminarFacial('Por favor, ingrese el motivo de la eliminación', 'error');
        return;
    }

    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) {
        mostrarMensajeModalEliminarFacial('Sesión no válida', 'error');
        return;
    }

    const adminActualObj = JSON.parse(adminGuardado);

    // Obtener nombre del alumno para la bitácora
    let alumnoNombre = 'desconocido';
    try {
        const alumnoResponse = await fetch(`http://localhost:8080/api/alumnos/${idAlumno}`);
        if (alumnoResponse.ok) {
            const alumno = await alumnoResponse.json();
            alumnoNombre = `${alumno.nombre} ${alumno.apellidos}`;
        }
    } catch (error) {
        console.error('Error al obtener alumno:', error);
    }

    const btnEliminar = document.querySelector('#modal-eliminar-facial .btn-danger');
    const originalText = btnEliminar.textContent;
    btnEliminar.textContent = 'Eliminando...';
    btnEliminar.disabled = true;

    try {
        const response = await fetch(`http://localhost:8080/api/registros-faciales/${idRegistroFacial}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Registrar en bitácora
            const descripcion = `Eliminación de registro facial del alumno ${alumnoNombre} (ID Registro: ${idRegistroFacial}). Motivo: ${motivo}`;

            await registrarBitacora(
                'Eliminación de Registro Facial',
                'Registro Facial',
                idAlumno,
                descripcion,
                adminActualObj.idAdmin
            );

            mostrarMensajeModalEliminarFacial('✅ Registro facial eliminado exitosamente', 'success');

            setTimeout(() => {
                cerrarModalEliminarRegistroFacial();
                // Detener cámara y recargar la página para mostrar que ya no tiene registro facial
                detenerCamaraFacial();
                buscarAlumnoFacial();
            }, 1500);

        } else {
            const error = await response.text();
            mostrarMensajeModalEliminarFacial(`Error al eliminar: ${error}`, 'error');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarMensajeModalEliminarFacial('Error al conectar con el servidor', 'error');
    } finally {
        btnEliminar.textContent = originalText;
        btnEliminar.disabled = false;
    }
}

function mostrarMensajeModalEliminarFacial(mensaje, tipo) {
    const messageModal = document.getElementById('message-modal-eliminar-facial');
    if (messageModal) {
        messageModal.textContent = mensaje;
        messageModal.className = `message-box ${tipo}`;
        messageModal.style.display = 'block';

        setTimeout(() => {
            if (messageModal) {
                messageModal.style.display = 'none';
            }
        }, 3000);
    }
}

function cerrarModalEliminarRegistroFacial() {
    const modal = document.getElementById('modal-eliminar-facial');
    if (modal) {
        modal.remove();
    }
}







// ==================== REPORTES TÉCNICOS ====================

async function cargarReportesTecnicos() {
    const container = document.getElementById('reportes-container');
    if (!container) return;
    container.innerHTML = `<div style="text-align:center;padding:40px;"><div class="loading"></div>Cargando reportes...</div>`;

    try {
        const response = await fetch('http://localhost:8080/api/reportes-tecnicos');
        if (!response.ok) throw new Error('Error al cargar reportes');
        const reportes = await response.json();
        mostrarReportes(reportes);
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `<div class="no-reportes"><div class="icon">❌</div><p>Error al cargar reportes</p><button class="btn btn-primary btn-small" onclick="cargarReportesTecnicos()">Reintentar</button></div>`;
    }
}

function formatFechaReporte(fecha) {
    if (!fecha) return 'No disponible';
    const partes = fecha.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function mostrarReportes(reportes) {
    const container = document.getElementById('reportes-container');
    if (!reportes || reportes.length === 0) {
        container.innerHTML = `<div class="no-reportes"><div class="icon">✅</div><p>No hay reportes pendientes</p></div>`;
        return;
    }

    reportes.sort((a, b) => new Date(b.fecha + ' ' + b.hora) - new Date(a.fecha + ' ' + a.hora));
    const tipos = [...new Set(reportes.map(r => r.reporta))];
    const torniquetes = [...new Set(reportes.map(r => r.numeroTorniquete))];

    container.innerHTML = `
        <div class="reportes-stats">
            <div class="reportes-count">📊 Total: <span>${reportes.length}</span></div>
            <div class="filters-reportes">
                <select id="filtro-reporta" onchange="filtrarReportes()"><option value="">Todos</option>${tipos.map(t => `<option value="${t}">${t}</option>`).join('')}</select>
                <select id="filtro-torniquete" onchange="filtrarReportes()"><option value="">Todos los torniquetes</option>${torniquetes.map(t => `<option value="${t}">Torniquete ${t}</option>`).join('')}</select>
                <input type="date" id="filtro-fecha" onchange="filtrarReportes()">
                <button class="btn btn-secondary btn-small" onclick="limpiarFiltrosReportes()">Limpiar</button>
            </div>
        </div>
        <div id="reportes-list"></div>
    `;
    window.reportesOriginales = reportes;
    actualizarListaReportes(reportes);
}

function actualizarListaReportes(reportes) {
    const listContainer = document.getElementById('reportes-list');
    if (!reportes || reportes.length === 0) {
        listContainer.innerHTML = `<div class="no-reportes"><div class="icon">🔍</div><p>No hay reportes que coincidan</p></div>`;
        return;
    }
    listContainer.innerHTML = reportes.map(r => `
        <div class="reporte-card">
            <div class="reporte-header"><span class="reporte-id">Reporte #${r.idReporte}</span><span class="reporte-fecha">📅 ${formatFechaReporte(r.fecha)} - ⏰ ${r.hora}</span></div>
            <div class="reporte-body">
                <div class="reporte-info">
                    <div class="reporte-info-item"><label>🔢 Torniquete:</label><span>Torniquete ${r.numeroTorniquete}</span></div>
                    <div class="reporte-info-item"><label>👤 Reporta:</label><span>${r.reporta}</span></div>
                </div>
                <div class="reporte-descripcion"><label>📝 Descripción:</label><p>${escapeHtml(r.descripcion)}</p></div>
            </div>
            <div class="reporte-footer"><button class="btn btn-atender" onclick="abrirModalAtender(${r.idReporte})">✅ Reporte Atendido</button></div>
        </div>
    `).join('');
}

function filtrarReportes() {
    const filtroReporta = document.getElementById('filtro-reporta')?.value || '';
    const filtroTorniquete = document.getElementById('filtro-torniquete')?.value || '';
    const filtroFecha = document.getElementById('filtro-fecha')?.value || '';
    let filtrados = [...window.reportesOriginales];
    if (filtroReporta) filtrados = filtrados.filter(r => r.reporta === filtroReporta);
    if (filtroTorniquete) filtrados = filtrados.filter(r => r.numeroTorniquete.toString() === filtroTorniquete);
    if (filtroFecha) filtrados = filtrados.filter(r => r.fecha === filtroFecha);
    actualizarListaReportes(filtrados);
    const countSpan = document.querySelector('.reportes-stats .reportes-count span');
    if (countSpan) countSpan.textContent = filtrados.length;
}

function limpiarFiltrosReportes() {
    const selects = ['filtro-reporta', 'filtro-torniquete', 'filtro-fecha'];
    selects.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    actualizarListaReportes(window.reportesOriginales);
    const countSpan = document.querySelector('.reportes-stats .reportes-count span');
    if (countSpan) countSpan.textContent = window.reportesOriginales.length;
}

async function abrirModalAtender(idReporte) {
    try {
        const response = await fetch(`http://localhost:8080/api/reportes-tecnicos/${idReporte}`);
        if (!response.ok) throw new Error('Error al cargar reporte');
        reporteSeleccionado = await response.json();

        const infoModal = document.getElementById('reporte-info-modal');
        if (infoModal) {
            infoModal.innerHTML = `
                <p><strong>Reporte #${reporteSeleccionado.idReporte}</strong></p>
                <p>📅 ${formatFechaReporte(reporteSeleccionado.fecha)} - ⏰ ${reporteSeleccionado.hora}</p>
                <p>🔢 Torniquete: ${reporteSeleccionado.numeroTorniquete}</p>
                <p>👤 Reporta: ${reporteSeleccionado.reporta}</p>
                <p><strong>Descripción:</strong><br>${escapeHtml(reporteSeleccionado.descripcion)}</p>
            `;
        }
        const btnConfirmar = document.getElementById('btn-confirmar-atender');
        if (btnConfirmar) btnConfirmar.onclick = () => atenderReporte(reporteSeleccionado.idReporte);
        document.getElementById('modal-atender').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar información', 'error');
    }
}

async function atenderReporte(idReporte) {
    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) return showMessage('Sesión no válida', 'error');
    const adminActualObj = JSON.parse(adminGuardado);

    try {
        const response = await fetch(`http://localhost:8080/api/reportes-tecnicos/${idReporte}`, { method: 'DELETE' });
        if (response.ok) {
            await registrarBitacora('Atención de Reporte Técnico', 'Reporte Técnico', idReporte,
                `Reporte #${idReporte} atendido. Torniquete: ${reporteSeleccionado.numeroTorniquete}, Reporta: ${reporteSeleccionado.reporta}`, adminActualObj.idAdmin);
            showMessage('✅ Reporte atendido', 'success', false);
            cerrarModal();
            setTimeout(() => cargarReportesTecnicos(), 500);
        } else {
            showMessage('Error al atender reporte', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al conectar con el servidor', 'error');
    }
}

function cerrarModal() {
    const modal = document.getElementById('modal-atender');
    if (modal) modal.style.display = 'none';
    reporteSeleccionado = null;
}

// ==================== BITÁCORA ====================

async function cargarBitacora() {
    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) { window.location.href = 'login.html'; return; }
    try {
        const response = await fetch('http://localhost:8080/api/bitacora');
        if (!response.ok) throw new Error('Error al cargar bitácora');
        const bitacora = await response.json();
        mostrarRegistrosBitacoraConAcciones(bitacora);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar bitácora', 'error');
    }
}

async function mostrarRegistrosBitacoraConAcciones(registros) {
    const tbody = document.getElementById('bitacora-table-body');
    if (!tbody) return;
    if (registros.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;">No hay registros</td></tr>`;
        return;
    }
    tbody.innerHTML = '';
    registros.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));

    for (const reg of registros) {
        const fecha = new Date(reg.fechaHora);
        let accionClass = '';
        if (reg.accion.includes('Alta')) accionClass = 'accion-alta';
        else if (reg.accion.includes('Modificación')) accionClass = 'accion-modificacion';
        else if (reg.accion.includes('Eliminación')) accionClass = 'accion-eliminacion';
        else if (reg.accion.includes('Credencial')) accionClass = 'accion-credencial';
        else if (reg.accion.includes('Facial')) accionClass = 'accion-facial';
        else if (reg.accion.includes('Reporte')) accionClass = 'accion-reporte';
        else if (reg.accion.includes('Entrada')) accionClass = 'accion-entrada';
        else if (reg.accion.includes('Salida')) accionClass = 'accion-salida';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fecha.toLocaleDateString('es-MX')}</td>
            <td>${fecha.toLocaleTimeString('es-MX')}</td>
            <td><span class="accion-badge ${accionClass}">${escapeHtml(reg.accion)}</span></td>
            <td>${escapeHtml(reg.entidadAfectada)}</td>
            <td>${escapeHtml(reg.descripcion)}</td>
            <td class="admin-cell" data-admin-id="${reg.idAdmin}">Cargando...</td>
            <td class="acciones-cell">
                <button class="btn-accion btn-editar-registro" onclick="abrirModalEditarBitacora(${reg.idBitacora})">✏️ Editar</button>
                <button class="btn-accion btn-eliminar-registro" onclick="abrirModalEliminarBitacora(${reg.idBitacora})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    }
    cargarNombresAdministradores();
    actualizarContadorRegistros();
}

async function cargarNombresAdministradores() {
    const cells = document.querySelectorAll('.admin-cell');
    const ids = [...new Set([...cells].map(c => c.getAttribute('data-admin-id')))];
    for (const id of ids) {
        try {
            const res = await fetch(`http://localhost:8080/api/administradores/${id}`);
            if (res.ok) {
                const admin = await res.json();
                document.querySelectorAll(`.admin-cell[data-admin-id="${id}"]`).forEach(c => c.textContent = `${admin.nombre} ${admin.apellidos}`);
            } else {
                document.querySelectorAll(`.admin-cell[data-admin-id="${id}"]`).forEach(c => c.textContent = 'No encontrado');
            }
        } catch (error) {
            document.querySelectorAll(`.admin-cell[data-admin-id="${id}"]`).forEach(c => c.textContent = 'Error');
        }
    }
}

function actualizarContadorRegistros() {
    const rows = document.querySelectorAll('#bitacora-table-body tr');
    const visible = Array.from(rows).filter(r => r.style.display !== 'none' && r.cells.length === 7);
    const total = document.getElementById('total-registros');
    if (total) total.textContent = `Total: ${visible.length} registros`;
}

function filtrarBitacora() {
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    const entidad = document.getElementById('filtro-entidad').value;
    const accion = document.getElementById('filtro-accion').value;
    const rows = document.querySelectorAll('#bitacora-table-body tr');
    let visible = 0;

    rows.forEach(row => {
        if (row.id === 'no-results-message') return;
        let mostrar = true;
        if (fechaInicio || fechaFin) {
            const fechaCelda = row.cells[0].textContent.split('/');
            const fechaReg = new Date(fechaCelda[2], fechaCelda[1]-1, fechaCelda[0]);
            if (fechaInicio && new Date(fechaInicio) > fechaReg) mostrar = false;
            if (fechaFin && new Date(fechaFin) < fechaReg) mostrar = false;
        }
        if (entidad && row.cells[3].textContent !== entidad) mostrar = false;
        if (accion && !row.cells[2].textContent.includes(accion)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
        if (mostrar) visible++;
    });

    const tbody = document.getElementById('bitacora-table-body');
    const existing = document.getElementById('no-results-message');
    if (visible === 0 && rows.length > 0 && !existing) {
        const noResults = document.createElement('tr');
        noResults.id = 'no-results-message';
        noResults.innerHTML = `<td colspan="7" style="text-align:center;padding:40px;">No hay registros que coincidan</td>`;
        tbody.appendChild(noResults);
    } else if (visible > 0 && existing) existing.remove();
    actualizarContadorRegistros();
}

function limpiarFiltros() {
    ['fecha-inicio', 'fecha-fin', 'filtro-entidad', 'filtro-accion'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.querySelectorAll('#bitacora-table-body tr').forEach(row => {
        if (row.id !== 'no-results-message') row.style.display = '';
    });
    const noResults = document.getElementById('no-results-message');
    if (noResults) noResults.remove();
    actualizarContadorRegistros();
}

function exportarBitacora() {
    const rows = document.querySelectorAll('#bitacora-table-body tr');
    const visible = Array.from(rows).filter(r => r.style.display !== 'none' && r.id !== 'no-results-message' && r.cells.length === 7);
    if (visible.length === 0) { showMessage('No hay datos para exportar', 'error'); return; }
    const headers = ['Fecha', 'Hora', 'Acción', 'Entidad', 'Descripción', 'Administrador'];
    const data = visible.map(r => [r.cells[0].textContent, r.cells[1].textContent, r.cells[2].textContent, r.cells[3].textContent, r.cells[4].textContent, r.cells[5].textContent]);
    const csv = [headers, ...data].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bitacora_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showMessage('Bitácora exportada', 'success');
}

// ==================== PUNTOS DE ACCESO ====================

async function cargarPuntosAccesoAdmin() {
    const tbody = document.getElementById('puntos-table-body');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;"><div class="loading"></div>Cargando...</td></tr>`;
    try {
        const response = await fetch('http://localhost:8080/api/puntos-acceso');
        if (!response.ok) throw new Error('Error');
        puntosAccesoLista = await response.json();
        mostrarPuntosAcceso(puntosAccesoLista);
        const total = document.getElementById('total-puntos');
        if (total) total.textContent = puntosAccesoLista.length;
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;">Error al cargar</td></tr>`;
    }
}

function mostrarPuntosAcceso(puntos) {
    const tbody = document.getElementById('puntos-table-body');
    if (!puntos || puntos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;">No hay puntos de acceso</td></tr>`;
        return;
    }
    tbody.innerHTML = puntos.map(p => `
        <tr>
            <td>${p.idPuntoAcceso}</td>
            <td><strong>${escapeHtml(p.nombre)}</strong></td>
            <td>${escapeHtml(p.ubicacion)}</td>
            <td><span class="badge-tipo ${p.tipo === 'Principal' ? 'badge-principal' : 'badge-secundario'}">${p.tipo}</span></td>
            <td><span class="badge-tipo ${p.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}">${p.estado}</span></td>
            <td>
                <button class="btn-editar" onclick="abrirModalEditar(${p.idPuntoAcceso})">✏️ Editar</button>
                <button class="btn-eliminar" onclick="abrirModalEliminar(${p.idPuntoAcceso})">🗑️ Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function abrirModalAgregar() {
    document.getElementById('modal-titulo').textContent = 'Agregar Punto de Acceso';
    ['punto-id', 'nombre', 'ubicacion', 'tipo', 'estado'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('modal-punto').style.display = 'block';
    const msg = document.getElementById('message-modal');
    if (msg) { msg.style.display = 'none'; msg.textContent = ''; }
}

async function abrirModalEditar(id) {
    try {
        const res = await fetch(`http://localhost:8080/api/puntos-acceso/${id}`);
        if (!res.ok) throw new Error();
        const punto = await res.json();
        document.getElementById('modal-titulo').textContent = 'Editar Punto de Acceso';
        document.getElementById('punto-id').value = punto.idPuntoAcceso;
        document.getElementById('nombre').value = punto.nombre;
        document.getElementById('ubicacion').value = punto.ubicacion;
        document.getElementById('tipo').value = punto.tipo;
        document.getElementById('estado').value = punto.estado;
        document.getElementById('modal-punto').style.display = 'block';
        const msg = document.getElementById('message-modal');
        if (msg) { msg.style.display = 'none'; msg.textContent = ''; }
    } catch (error) {
        showMessage('Error al cargar datos', 'error');
    }
}

function mostrarMensajeModal(mensaje, tipo) {
    const msg = document.getElementById('message-modal');
    if (msg) {
        msg.textContent = mensaje;
        msg.className = `message-box ${tipo}`;
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 3000);
    }
}

async function guardarPuntoAcceso() {
    const id = document.getElementById('punto-id').value;
    const nombre = document.getElementById('nombre').value.trim();
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const tipo = document.getElementById('tipo').value;
    const estado = document.getElementById('estado').value;

    if (!nombre || !ubicacion || !tipo || !estado) {
        mostrarMensajeModal('Complete todos los campos', 'error');
        return;
    }

    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) { mostrarMensajeModal('Sesión no válida', 'error'); return; }
    const adminActualObj = JSON.parse(adminGuardado);

    const puntoData = { nombre, ubicacion, tipo, estado };
    const esCreacion = !id;

    const btn = document.querySelector('#modal-punto .btn-primary');
    const original = btn.textContent;
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
        const url = esCreacion ? 'http://localhost:8080/api/puntos-acceso' : `http://localhost:8080/api/puntos-acceso/${id}`;
        const method = esCreacion ? 'POST' : 'PUT';
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(puntoData) });
        if (response.ok) {
            const punto = await response.json();
            const desc = esCreacion ? `Creación de punto: ${nombre} (Ubicación: ${ubicacion}, Tipo: ${tipo})` : `Actualización de punto ID ${id}: ${nombre}`;
            await registrarBitacora(esCreacion ? 'Creación de Punto de Acceso' : 'Actualización de Punto de Acceso', 'Punto de Acceso', punto.idPuntoAcceso, desc, adminActualObj.idAdmin);
            mostrarMensajeModal(esCreacion ? '✅ Punto creado' : '✅ Punto actualizado', 'success');
            setTimeout(() => { cerrarModalPunto(); cargarPuntosAccesoAdmin(); }, 1500);
        } else {
            mostrarMensajeModal(`Error: ${await response.text()}`, 'error');
        }
    } catch (error) {
        mostrarMensajeModal('Error de conexión', 'error');
    } finally {
        btn.textContent = original;
        btn.disabled = false;
    }
}

function cerrarModalPunto() {
    document.getElementById('modal-punto').style.display = 'none';
}

async function abrirModalEliminar(id) {
    try {
        const res = await fetch(`http://localhost:8080/api/puntos-acceso/${id}`);
        if (!res.ok) throw new Error();
        const punto = await res.json();
        const info = document.getElementById('punto-eliminar-info');
        if (info) info.innerHTML = `<p><strong>${escapeHtml(punto.nombre)}</strong><br>Ubicación: ${escapeHtml(punto.ubicacion)}<br>Tipo: ${punto.tipo}<br>Estado: ${punto.estado}</p>`;
        const btn = document.getElementById('btn-confirmar-eliminar');
        if (btn) btn.onclick = () => eliminarPuntoAcceso(punto.idPuntoAcceso);
        document.getElementById('modal-eliminar').style.display = 'block';
    } catch (error) {
        showMessage('Error al cargar datos', 'error');
    }
}

function cerrarModalEliminar() {
    document.getElementById('modal-eliminar').style.display = 'none';
}

function mostrarMensajeEliminar(mensaje, tipo) {
    const msg = document.getElementById('message-eliminar');
    if (msg) {
        msg.textContent = mensaje;
        msg.className = `message-box ${tipo}`;
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 3000);
    }
}

async function eliminarPuntoAcceso(id) {
    const adminGuardado = sessionStorage.getItem('adminActual');
    if (!adminGuardado) { mostrarMensajeEliminar('Sesión no válida', 'error'); return; }
    const adminActualObj = JSON.parse(adminGuardado);

    const btn = document.getElementById('btn-confirmar-eliminar');
    const original = btn.textContent;
    btn.textContent = 'Eliminando...';
    btn.disabled = true;

    try {
        const response = await fetch(`http://localhost:8080/api/puntos-acceso/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await registrarBitacora('Eliminación de Punto de Acceso', 'Punto de Acceso', id, `Punto eliminado`, adminActualObj.idAdmin);
            mostrarMensajeEliminar('✅ Punto eliminado', 'success');
            setTimeout(() => { cerrarModalEliminar(); cargarPuntosAccesoAdmin(); }, 1500);
        } else {
            mostrarMensajeEliminar(`Error: ${await response.text()}`, 'error');
        }
    } catch (error) {
        mostrarMensajeEliminar('Error de conexión', 'error');
    } finally {
        btn.textContent = original;
        btn.disabled = false;
    }
}

// ==================== HISTORIAL DE ENTRADAS ====================

async function cargarHistorialEntradas() {
    const container = document.getElementById('historial-container');
    if (!container) return;
    container.innerHTML = `<div style="text-align:center;padding:40px;"><div class="loading"></div>Cargando...</div>`;

    try {
        const response = await fetch('http://localhost:8080/api/accesos');
        if (!response.ok) throw new Error();
        const accesos = await response.json();
        accesos.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
        const [puntos, alumnos] = await Promise.all([cargarPuntosAcceso(), cargarAlumnosParaHistorial()]);

        const datos = accesos.map(a => ({
            id: a.idAcceso, fechaHora: new Date(a.fechaHora), metodoAutenticacion: a.metodoAutenticacion,
            resultado: a.resultado, puntoAccesoNombre: puntos.find(p => p.idPuntoAcceso === a.idPuntoAcceso)?.nombre || `ID: ${a.idPuntoAcceso}`,
            alumnoNombre: alumnos.find(al => al.idAlumno === a.idAlumno) ? `${alumnos.find(al => al.idAlumno === a.idAlumno).nombre} ${alumnos.find(al => al.idAlumno === a.idAlumno).apellidos}` : `ID: ${a.idAlumno}`,
            idAlumno: a.idAlumno
        }));

        window.datosEntradas = datos;
        paginaActualEntradas = 1;
        mostrarHistorialEntradasConAcciones(datos);
    } catch (error) {
        container.innerHTML = `<div class="no-reportes"><div class="icon">❌</div><p>Error al cargar</p><button class="btn btn-primary" onclick="cargarHistorialEntradas()">Reintentar</button></div>`;
    }
}

async function cargarPuntosAcceso() {
    try { const res = await fetch('http://localhost:8080/api/puntos-acceso'); return res.ok ? await res.json() : []; }
    catch { return []; }
}

async function cargarAlumnosParaHistorial() {
    try { const res = await fetch('http://localhost:8080/api/alumnos'); return res.ok ? await res.json() : []; }
    catch { return []; }
}

function mostrarHistorialEntradasConAcciones(datos) {
    const container = document.getElementById('historial-container');
    if (!datos?.length) { container.innerHTML = `<div class="no-reportes"><div class="icon">📭</div><p>No hay registros</p></div>`; return; }

    const total = datos.length, totalPag = Math.ceil(total / registrosPorPagina);
    const inicio = (paginaActualEntradas - 1) * registrosPorPagina;
    const pagina = datos.slice(inicio, inicio + registrosPorPagina);
    const metodos = [...new Set(datos.map(d => d.metodoAutenticacion))];
    const puntos = [...new Set(datos.map(d => d.puntoAccesoNombre))];

    container.innerHTML = `
        <div class="historial-stats">
            <div class="historial-count">📊 Total: <span>${total}</span></div>
            <div class="filters-historial">
                <select id="filtro-metodo" onchange="filtrarHistorialEntradas()"><option value="">Todos</option>${metodos.map(m => `<option value="${m}">${m}</option>`).join('')}</select>
                <select id="filtro-punto" onchange="filtrarHistorialEntradas()"><option value="">Todos</option>${puntos.map(p => `<option value="${p}">${p}</option>`).join('')}</select>
                <input type="date" id="filtro-fecha-inicio" onchange="filtrarHistorialEntradas()">
                <input type="date" id="filtro-fecha-fin" onchange="filtrarHistorialEntradas()">
                <button class="btn btn-export" onclick="exportarHistorialEntradas()">📥 Exportar</button>
                <button class="btn btn-secondary" onclick="limpiarFiltrosHistorialEntradas()">Limpiar</button>
            </div>
        </div>
        <div class="historial-table-container"><table class="historial-table"><thead><tr><th onclick="ordenarHistorialEntradas('id')">ID</th><th>Fecha/Hora</th><th>Método</th><th>Resultado</th><th>Punto Acceso</th><th>Alumno</th><th>Acciones</th></tr></thead>
        <tbody>${pagina.map(r => `
            <tr><td>${r.id}</td><td>${r.fechaHora.toLocaleDateString('es-MX')} ${r.fechaHora.toLocaleTimeString('es-MX')}</td>
            <td><span class="badge-metodo ${r.metodoAutenticacion === 'QR' ? 'badge-qr' : 'badge-facial'}">${r.metodoAutenticacion}</span></td>
            <td><span class="badge-metodo ${r.resultado === 'Permitido' ? 'badge-permitido' : 'badge-denegado'}">${r.resultado}</span></td>
            <td>${escapeHtml(r.puntoAccesoNombre)}</td>
            <td onclick="mostrarDetalleAlumno(${r.idAlumno})" style="cursor:pointer;color:#FF6B00;">${escapeHtml(r.alumnoNombre)}</td>
            <td class="acciones-cell"><button class="btn-accion btn-editar-registro" onclick="abrirModalEditarEntrada(${r.id})">✏️</button><button class="btn-accion btn-eliminar-registro" onclick="abrirModalEliminarEntrada(${r.id})">🗑️</button></td></tr>
        `).join('')}</tbody></table></div>
        <div class="pagination"><button onclick="cambiarPaginaHistorialEntradas('anterior')" ${paginaActualEntradas===1?'disabled':''}>← Anterior</button><span>Pág ${paginaActualEntradas} de ${totalPag}</span><button onclick="cambiarPaginaHistorialEntradas('siguiente')" ${paginaActualEntradas===totalPag?'disabled':''}>Siguiente →</button></div>
    `;
    window.datosEntradas = datos;
}

function cambiarPaginaHistorialEntradas(dir) {
    const total = Math.ceil(window.datosEntradas.length / registrosPorPagina);
    if (dir === 'anterior' && paginaActualEntradas > 1) paginaActualEntradas--;
    if (dir === 'siguiente' && paginaActualEntradas < total) paginaActualEntradas++;
    mostrarHistorialEntradasConAcciones(window.datosEntradas);
}

function ordenarHistorialEntradas(campo) {
    let datos = [...window.datosEntradas];
    const orden = { id: (a,b)=>a.id-b.id, fecha: (a,b)=>a.fechaHora-b.fechaHora, metodo: (a,b)=>a.metodoAutenticacion.localeCompare(b.metodoAutenticacion), resultado: (a,b)=>a.resultado.localeCompare(b.resultado), punto: (a,b)=>a.puntoAccesoNombre.localeCompare(b.puntoAccesoNombre), alumno: (a,b)=>a.alumnoNombre.localeCompare(b.alumnoNombre) };
    datos.sort(orden[campo]);
    paginaActualEntradas = 1;
    mostrarHistorialEntradasConAcciones(datos);
}

function filtrarHistorialEntradas() {
    const metodo = document.getElementById('filtro-metodo')?.value || '';
    const punto = document.getElementById('filtro-punto')?.value || '';
    const ini = document.getElementById('filtro-fecha-inicio')?.value || '';
    const fin = document.getElementById('filtro-fecha-fin')?.value || '';
    let filtrados = [...window.datosEntradas];
    if (metodo) filtrados = filtrados.filter(d => d.metodoAutenticacion === metodo);
    if (punto) filtrados = filtrados.filter(d => d.puntoAccesoNombre === punto);
    if (ini) { const fecha = new Date(ini); filtrados = filtrados.filter(d => d.fechaHora >= fecha); }
    if (fin) { const fecha = new Date(fin); fecha.setHours(23,59,59); filtrados = filtrados.filter(d => d.fechaHora <= fecha); }
    paginaActualEntradas = 1;
    mostrarHistorialEntradasConAcciones(filtrados);
}

function limpiarFiltrosHistorialEntradas() {
    ['filtro-metodo', 'filtro-punto', 'filtro-fecha-inicio', 'filtro-fecha-fin'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    paginaActualEntradas = 1;
    mostrarHistorialEntradasConAcciones(window.datosEntradas);
}

function exportarHistorialEntradas() {
    if (!window.datosEntradas?.length) { showMessage('No hay datos', 'error'); return; }
    const headers = ['ID', 'Fecha', 'Hora', 'Método', 'Resultado', 'Punto Acceso', 'Alumno'];
    const data = window.datosEntradas.map(r => [r.id, r.fechaHora.toLocaleDateString('es-MX'), r.fechaHora.toLocaleTimeString('es-MX'), r.metodoAutenticacion, r.resultado, r.puntoAccesoNombre, r.alumnoNombre]);
    const csv = [headers, ...data].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `entradas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showMessage('Exportado', 'success');
}

// ==================== HISTORIAL DE SALIDAS ====================

async function cargarHistorialSalidas() {
    const container = document.getElementById('historial-container');
    if (!container) return;
    container.innerHTML = `<div style="text-align:center;padding:40px;"><div class="loading"></div>Cargando...</div>`;

    try {
        const response = await fetch('http://localhost:8080/api/salidas');
        if (!response.ok) throw new Error();
        const salidas = await response.json();
        salidas.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
        const [puntos, alumnos] = await Promise.all([cargarPuntosAcceso(), cargarAlumnosParaHistorial()]);

        const datos = salidas.map(s => ({
            id: s.idSalida, fechaHora: new Date(s.fechaHora), metodoAutenticacion: s.metodoAutenticacion,
            resultado: s.resultado, puntoAccesoNombre: puntos.find(p => p.idPuntoAcceso === s.idPuntoAcceso)?.nombre || `ID: ${s.idPuntoAcceso}`,
            alumnoNombre: alumnos.find(al => al.idAlumno === s.idAlumno) ? `${alumnos.find(al => al.idAlumno === s.idAlumno).nombre} ${alumnos.find(al => al.idAlumno === s.idAlumno).apellidos}` : `ID: ${s.idAlumno}`,
            idAlumno: s.idAlumno
        }));

        window.datosSalidas = datos;
        paginaActualSalidas = 1;
        mostrarHistorialSalidasConAcciones(datos);
    } catch (error) {
        container.innerHTML = `<div class="no-reportes"><div class="icon">❌</div><p>Error al cargar</p><button class="btn btn-primary" onclick="cargarHistorialSalidas()">Reintentar</button></div>`;
    }
}

function mostrarHistorialSalidasConAcciones(datos) {
    const container = document.getElementById('historial-container');
    if (!datos?.length) { container.innerHTML = `<div class="no-reportes"><div class="icon">📭</div><p>No hay registros</p></div>`; return; }

    const total = datos.length, totalPag = Math.ceil(total / registrosPorPagina);
    const inicio = (paginaActualSalidas - 1) * registrosPorPagina;
    const pagina = datos.slice(inicio, inicio + registrosPorPagina);
    const metodos = [...new Set(datos.map(d => d.metodoAutenticacion))];
    const puntos = [...new Set(datos.map(d => d.puntoAccesoNombre))];

    container.innerHTML = `
        <div class="historial-stats">
            <div class="historial-count">📊 Total: <span>${total}</span></div>
            <div class="filters-historial">
                <select id="filtro-metodo" onchange="filtrarHistorialSalidas()"><option value="">Todos</option>${metodos.map(m => `<option value="${m}">${m}</option>`).join('')}</select>
                <select id="filtro-punto" onchange="filtrarHistorialSalidas()"><option value="">Todos</option>${puntos.map(p => `<option value="${p}">${p}</option>`).join('')}</select>
                <input type="date" id="filtro-fecha-inicio" onchange="filtrarHistorialSalidas()">
                <input type="date" id="filtro-fecha-fin" onchange="filtrarHistorialSalidas()">
                <button class="btn btn-export" onclick="exportarHistorialSalidas()">📥 Exportar</button>
                <button class="btn btn-secondary" onclick="limpiarFiltrosHistorialSalidas()">Limpiar</button>
            </div>
        </div>
        <div class="historial-table-container"><table class="historial-table"><thead><tr><th onclick="ordenarHistorialSalidas('id')">ID</th><th>Fecha/Hora</th><th>Método</th><th>Resultado</th><th>Punto Acceso</th><th>Alumno</th><th>Acciones</th></tr></thead>
        <tbody>${pagina.map(r => `
            <tr><td>${r.id}</td><td>${r.fechaHora.toLocaleDateString('es-MX')} ${r.fechaHora.toLocaleTimeString('es-MX')}</td>
            <td><span class="badge-metodo ${r.metodoAutenticacion === 'QR' ? 'badge-qr' : 'badge-facial'}">${r.metodoAutenticacion}</span></td>
            <td><span class="badge-metodo ${r.resultado === 'Permitido' ? 'badge-permitido' : 'badge-denegado'}">${r.resultado}</span></td>
            <td>${escapeHtml(r.puntoAccesoNombre)}</td>
            <td onclick="mostrarDetalleAlumno(${r.idAlumno})" style="cursor:pointer;color:#FF6B00;">${escapeHtml(r.alumnoNombre)}</td>
            <td class="acciones-cell"><button class="btn-accion btn-editar-registro" onclick="abrirModalEditarSalida(${r.id})">✏️</button><button class="btn-accion btn-eliminar-registro" onclick="abrirModalEliminarSalida(${r.id})">🗑️</button></td></tr>
        `).join('')}</tbody></table></div>
        <div class="pagination"><button onclick="cambiarPaginaHistorialSalidas('anterior')" ${paginaActualSalidas===1?'disabled':''}>← Anterior</button><span>Pág ${paginaActualSalidas} de ${totalPag}</span><button onclick="cambiarPaginaHistorialSalidas('siguiente')" ${paginaActualSalidas===totalPag?'disabled':''}>Siguiente →</button></div>
    `;
    window.datosSalidas = datos;
}

function cambiarPaginaHistorialSalidas(dir) {
    const total = Math.ceil(window.datosSalidas.length / registrosPorPagina);
    if (dir === 'anterior' && paginaActualSalidas > 1) paginaActualSalidas--;
    if (dir === 'siguiente' && paginaActualSalidas < total) paginaActualSalidas++;
    mostrarHistorialSalidasConAcciones(window.datosSalidas);
}

function ordenarHistorialSalidas(campo) {
    let datos = [...window.datosSalidas];
    const orden = { id: (a,b)=>a.id-b.id, fecha: (a,b)=>a.fechaHora-b.fechaHora, metodo: (a,b)=>a.metodoAutenticacion.localeCompare(b.metodoAutenticacion), resultado: (a,b)=>a.resultado.localeCompare(b.resultado), punto: (a,b)=>a.puntoAccesoNombre.localeCompare(b.puntoAccesoNombre), alumno: (a,b)=>a.alumnoNombre.localeCompare(b.alumnoNombre) };
    datos.sort(orden[campo]);
    paginaActualSalidas = 1;
    mostrarHistorialSalidasConAcciones(datos);
}

function filtrarHistorialSalidas() {
    const metodo = document.getElementById('filtro-metodo')?.value || '';
    const punto = document.getElementById('filtro-punto')?.value || '';
    const ini = document.getElementById('filtro-fecha-inicio')?.value || '';
    const fin = document.getElementById('filtro-fecha-fin')?.value || '';
    let filtrados = [...window.datosSalidas];
    if (metodo) filtrados = filtrados.filter(d => d.metodoAutenticacion === metodo);
    if (punto) filtrados = filtrados.filter(d => d.puntoAccesoNombre === punto);
    if (ini) { const fecha = new Date(ini); filtrados = filtrados.filter(d => d.fechaHora >= fecha); }
    if (fin) { const fecha = new Date(fin); fecha.setHours(23,59,59); filtrados = filtrados.filter(d => d.fechaHora <= fecha); }
    paginaActualSalidas = 1;
    mostrarHistorialSalidasConAcciones(filtrados);
}

function limpiarFiltrosHistorialSalidas() {
    ['filtro-metodo', 'filtro-punto', 'filtro-fecha-inicio', 'filtro-fecha-fin'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    paginaActualSalidas = 1;
    mostrarHistorialSalidasConAcciones(window.datosSalidas);
}

function exportarHistorialSalidas() {
    if (!window.datosSalidas?.length) { showMessage('No hay datos', 'error'); return; }
    const headers = ['ID', 'Fecha', 'Hora', 'Método', 'Resultado', 'Punto Acceso', 'Alumno'];
    const data = window.datosSalidas.map(r => [r.id, r.fechaHora.toLocaleDateString('es-MX'), r.fechaHora.toLocaleTimeString('es-MX'), r.metodoAutenticacion, r.resultado, r.puntoAccesoNombre, r.alumnoNombre]);
    const csv = [headers, ...data].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `salidas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showMessage('Exportado', 'success');
}

// ==================== MODALES DE EDICIÓN/ELIMINACIÓN (ENTRADAS) ====================

async function abrirModalEditarEntrada(id) {
    try {
        const res = await fetch(`http://localhost:8080/api/accesos/${id}`);
        if (!res.ok) throw new Error();
        const entrada = await res.json();
        registroEntradaSeleccionado = entrada;
        const [alumnoRes, puntoRes] = await Promise.all([fetch(`http://localhost:8080/api/alumnos/${entrada.idAlumno}`), fetch(`http://localhost:8080/api/puntos-acceso/${entrada.idPuntoAcceso}`)]);
        let alumnoNombre = 'No disponible', puntoNombre = 'No disponible';
        if (alumnoRes.ok) { const a = await alumnoRes.json(); alumnoNombre = `${a.nombre} ${a.apellidos}`; }
        if (puntoRes.ok) { const p = await puntoRes.json(); puntoNombre = p.nombre; }
        const fecha = new Date(entrada.fechaHora);
        const modal = `
            <div id="modal-editar-entrada" class="modal-editar" style="display:block">
                <div class="modal-editar-content"><div class="modal-editar-header"><h3>✏️ Editar Entrada</h3><span class="modal-editar-close" onclick="cerrarModalEditarEntrada()">&times;</span></div>
                <div class="modal-editar-body">
                    <input type="hidden" id="entrada-id" value="${entrada.idAcceso}">
                    <div class="form-row"><div class="form-group"><label>Alumno:</label><input value="${escapeHtml(alumnoNombre)}" disabled></div><div class="form-group"><label>Punto Acceso:</label><input value="${escapeHtml(puntoNombre)}" disabled></div></div>
                    <div class="form-row"><div class="form-group"><label>Fecha:</label><input type="date" id="fecha-editar" value="${fecha.toISOString().split('T')[0]}" required></div><div class="form-group"><label>Hora:</label><input type="time" id="hora-editar" value="${fecha.toTimeString().split(' ')[0]}" required></div></div>
                    <div class="form-row"><div class="form-group"><label>Método:</label><select id="metodo-editar"><option ${entrada.metodoAutenticacion==='QR'?'selected':''}>QR</option><option ${entrada.metodoAutenticacion==='Facial'?'selected':''}>Facial</option></select></div><div class="form-group"><label>Resultado:</label><select id="resultado-editar"><option ${entrada.resultado==='Permitido'?'selected':''}>Permitido</option><option ${entrada.resultado==='Denegado'?'selected':''}>Denegado</option></select></div></div>
                    <div class="form-group"><label>Motivo:</label><textarea id="motivo-cambio-editar" required></textarea></div>
                    <div id="msg-modal-editar" class="message-box" style="display:none"></div>
                </div>
                <div class="modal-editor-footer"><button class="btn btn-secondary" onclick="cerrarModalEditarEntrada()">Cancelar</button><button class="btn btn-primary" onclick="guardarEdicionEntrada()">Guardar</button></div></div></div>`;
        const existing = document.getElementById('modal-editar-entrada');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modal);
    } catch (error) { showMessage('Error al cargar', 'error'); }
}

function cerrarModalEditarEntrada() {
    const modal = document.getElementById('modal-editar-entrada');
    if (modal) modal.remove();
}

async function guardarEdicionEntrada() {
    const id = document.getElementById('entrada-id').value;
    const fecha = document.getElementById('fecha-editar').value;
    const hora = document.getElementById('hora-editar').value;
    const metodo = document.getElementById('metodo-editar').value;
    const resultado = document.getElementById('resultado-editar').value;
    const motivo = document.getElementById('motivo-cambio-editar').value.trim();
    if (!motivo) { mostrarMensajeModalEditar('Ingrese motivo', 'error'); return; }

    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    if (!admin) { mostrarMensajeModalEditar('Sesión no válida', 'error'); return; }

    const btn = document.querySelector('#modal-editar-entrada .btn-primary');
    const original = btn.textContent;
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
        const res = await fetch(`http://localhost:8080/api/accesos/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idAcceso: parseInt(id), fechaHora: new Date(`${fecha}T${hora}`).toISOString(), metodoAutenticacion: metodo, resultado, idAlumno: registroEntradaSeleccionado.idAlumno, idPuntoAcceso: registroEntradaSeleccionado.idPuntoAcceso })
        });
        if (res.ok) {
            await registrarBitacora('Modificación de Entrada', 'Acceso', id, `Motivo: ${motivo}`, admin.idAdmin);
            mostrarMensajeModalEditar('✅ Modificado', 'success');
            setTimeout(() => { cerrarModalEditarEntrada(); cargarHistorialEntradas(); }, 1500);
        } else { mostrarMensajeModalEditar('Error', 'error'); }
    } catch (error) { mostrarMensajeModalEditar('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

function mostrarMensajeModalEditar(msg, tipo) {
    const div = document.getElementById('msg-modal-editar');
    if (div) { div.textContent = msg; div.className = `message-box ${tipo}`; div.style.display = 'block'; setTimeout(() => div.style.display = 'none', 3000); }
}

async function abrirModalEliminarEntrada(id) {
    try {
        const res = await fetch(`http://localhost:8080/api/accesos/${id}`);
        if (!res.ok) throw new Error();
        const entrada = await res.json();
        registroEntradaSeleccionado = entrada;
        const alumnoRes = await fetch(`http://localhost:8080/api/alumnos/${entrada.idAlumno}`);
        let alumnoNombre = 'No disponible';
        if (alumnoRes.ok) { const a = await alumnoRes.json(); alumnoNombre = `${a.nombre} ${a.apellidos}`; }
        const fecha = new Date(entrada.fechaHora);
        const modal = `
            <div id="modal-eliminar-entrada" class="modal-editar" style="display:block">
                <div class="modal-editar-content"><div class="modal-editar-header" style="background:#dc3545"><h3>⚠️ Confirmar Eliminación</h3><span class="modal-editar-close" onclick="cerrarModalEliminarEntrada()">&times;</span></div>
                <div class="modal-editar-body">
                    <p>¿Eliminar este registro?</p>
                    <div style="background:#f5f5f5;padding:15px;border-radius:5px"><p><strong>ID:</strong> ${entrada.idAcceso}</p><p><strong>Alumno:</strong> ${escapeHtml(alumnoNombre)}</p><p><strong>Fecha:</strong> ${fecha.toLocaleDateString('es-MX')} ${fecha.toLocaleTimeString('es-MX')}</p></div>
                    <div class="form-group"><label>Motivo:</label><textarea id="motivo-eliminar" required></textarea></div>
                    <div id="msg-modal-eliminar" class="message-box" style="display:none"></div>
                </div>
                <div class="modal-editor-footer"><button class="btn btn-secondary" onclick="cerrarModalEliminarEntrada()">Cancelar</button><button class="btn btn-danger" onclick="confirmarEliminarEntrada()">Eliminar</button></div></div></div>`;
        const existing = document.getElementById('modal-eliminar-entrada');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modal);
    } catch (error) { showMessage('Error al cargar', 'error'); }
}

function cerrarModalEliminarEntrada() {
    const modal = document.getElementById('modal-eliminar-entrada');
    if (modal) modal.remove();
}

async function confirmarEliminarEntrada() {
    const motivo = document.getElementById('motivo-eliminar').value.trim();
    if (!motivo) { mostrarMensajeModalEliminar('Ingrese motivo', 'error'); return; }
    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    if (!admin) { mostrarMensajeModalEliminar('Sesión no válida', 'error'); return; }

    const btn = document.querySelector('#modal-eliminar-entrada .btn-danger');
    const original = btn.textContent;
    btn.textContent = 'Eliminando...';
    btn.disabled = true;

    try {
        const res = await fetch(`http://localhost:8080/api/accesos/${registroEntradaSeleccionado.idAcceso}`, { method: 'DELETE' });
        if (res.ok) {
            await registrarBitacora('Eliminación de Entrada', 'Acceso', registroEntradaSeleccionado.idAcceso, `Motivo: ${motivo}`, admin.idAdmin);
            mostrarMensajeModalEliminar('✅ Eliminado', 'success');
            setTimeout(() => { cerrarModalEliminarEntrada(); cargarHistorialEntradas(); }, 1500);
        } else { mostrarMensajeModalEliminar('Error', 'error'); }
    } catch (error) { mostrarMensajeModalEliminar('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

function mostrarMensajeModalEliminar(msg, tipo) {
    const div = document.getElementById('msg-modal-eliminar');
    if (div) { div.textContent = msg; div.className = `message-box ${tipo}`; div.style.display = 'block'; setTimeout(() => div.style.display = 'none', 3000); }
}

// ==================== MODALES DE EDICIÓN/ELIMINACIÓN (SALIDAS) ====================

async function abrirModalEditarSalida(id) {
    try {
        const res = await fetch(`http://localhost:8080/api/salidas/${id}`);
        if (!res.ok) throw new Error();
        const salida = await res.json();
        registroSalidaSeleccionado = salida;
        const [alumnoRes, puntoRes] = await Promise.all([fetch(`http://localhost:8080/api/alumnos/${salida.idAlumno}`), fetch(`http://localhost:8080/api/puntos-acceso/${salida.idPuntoAcceso}`)]);
        let alumnoNombre = 'No disponible', puntoNombre = 'No disponible';
        if (alumnoRes.ok) { const a = await alumnoRes.json(); alumnoNombre = `${a.nombre} ${a.apellidos}`; }
        if (puntoRes.ok) { const p = await puntoRes.json(); puntoNombre = p.nombre; }
        const fecha = new Date(salida.fechaHora);
        const modal = `
            <div id="modal-editar-salida" class="modal-editar" style="display:block">
                <div class="modal-editar-content"><div class="modal-editar-header"><h3>✏️ Editar Salida</h3><span class="modal-editar-close" onclick="cerrarModalEditarSalida()">&times;</span></div>
                <div class="modal-editar-body">
                    <input type="hidden" id="salida-id" value="${salida.idSalida}">
                    <div class="form-row"><div class="form-group"><label>Alumno:</label><input value="${escapeHtml(alumnoNombre)}" disabled></div><div class="form-group"><label>Punto Acceso:</label><input value="${escapeHtml(puntoNombre)}" disabled></div></div>
                    <div class="form-row"><div class="form-group"><label>Fecha:</label><input type="date" id="fecha-editar-salida" value="${fecha.toISOString().split('T')[0]}" required></div><div class="form-group"><label>Hora:</label><input type="time" id="hora-editar-salida" value="${fecha.toTimeString().split(' ')[0]}" required></div></div>
                    <div class="form-row"><div class="form-group"><label>Método:</label><select id="metodo-editar-salida"><option ${salida.metodoAutenticacion==='QR'?'selected':''}>QR</option><option ${salida.metodoAutenticacion==='Facial'?'selected':''}>Facial</option></select></div><div class="form-group"><label>Resultado:</label><select id="resultado-editar-salida"><option ${salida.resultado==='Permitido'?'selected':''}>Permitido</option><option ${salida.resultado==='Denegado'?'selected':''}>Denegado</option></select></div></div>
                    <div class="form-group"><label>Motivo:</label><textarea id="motivo-cambio-editar-salida" required></textarea></div>
                    <div id="msg-modal-editar-salida" class="message-box" style="display:none"></div>
                </div>
                <div class="modal-editor-footer"><button class="btn btn-secondary" onclick="cerrarModalEditarSalida()">Cancelar</button><button class="btn btn-primary" onclick="guardarEdicionSalida()">Guardar</button></div></div></div>`;
        const existing = document.getElementById('modal-editar-salida');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modal);
    } catch (error) { showMessage('Error al cargar', 'error'); }
}

function cerrarModalEditarSalida() {
    const modal = document.getElementById('modal-editar-salida');
    if (modal) modal.remove();
}

async function guardarEdicionSalida() {
    const id = document.getElementById('salida-id').value;
    const fecha = document.getElementById('fecha-editar-salida').value;
    const hora = document.getElementById('hora-editar-salida').value;
    const metodo = document.getElementById('metodo-editar-salida').value;
    const resultado = document.getElementById('resultado-editar-salida').value;
    const motivo = document.getElementById('motivo-cambio-editar-salida').value.trim();
    if (!motivo) { mostrarMensajeModalEditarSalida('Ingrese motivo', 'error'); return; }

    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    if (!admin) { mostrarMensajeModalEditarSalida('Sesión no válida', 'error'); return; }

    const btn = document.querySelector('#modal-editar-salida .btn-primary');
    const original = btn.textContent;
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
        const res = await fetch(`http://localhost:8080/api/salidas/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idSalida: parseInt(id), fechaHora: new Date(`${fecha}T${hora}`).toISOString(), metodoAutenticacion: metodo, resultado, idAlumno: registroSalidaSeleccionado.idAlumno, idPuntoAcceso: registroSalidaSeleccionado.idPuntoAcceso })
        });
        if (res.ok) {
            await registrarBitacora('Modificación de Salida', 'Salida', id, `Motivo: ${motivo}`, admin.idAdmin);
            mostrarMensajeModalEditarSalida('✅ Modificado', 'success');
            setTimeout(() => { cerrarModalEditarSalida(); cargarHistorialSalidas(); }, 1500);
        } else { mostrarMensajeModalEditarSalida('Error', 'error'); }
    } catch (error) { mostrarMensajeModalEditarSalida('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

function mostrarMensajeModalEditarSalida(msg, tipo) {
    const div = document.getElementById('msg-modal-editar-salida');
    if (div) { div.textContent = msg; div.className = `message-box ${tipo}`; div.style.display = 'block'; setTimeout(() => div.style.display = 'none', 3000); }
}

async function abrirModalEliminarSalida(id) {
    try {
        const res = await fetch(`http://localhost:8080/api/salidas/${id}`);
        if (!res.ok) throw new Error();
        const salida = await res.json();
        registroSalidaSeleccionado = salida;
        const alumnoRes = await fetch(`http://localhost:8080/api/alumnos/${salida.idAlumno}`);
        let alumnoNombre = 'No disponible';
        if (alumnoRes.ok) { const a = await alumnoRes.json(); alumnoNombre = `${a.nombre} ${a.apellidos}`; }
        const fecha = new Date(salida.fechaHora);
        const modal = `
            <div id="modal-eliminar-salida" class="modal-editar" style="display:block">
                <div class="modal-editar-content"><div class="modal-editar-header" style="background:#dc3545"><h3>⚠️ Confirmar Eliminación</h3><span class="modal-editar-close" onclick="cerrarModalEliminarSalida()">&times;</span></div>
                <div class="modal-editar-body">
                    <p>¿Eliminar este registro?</p>
                    <div style="background:#f5f5f5;padding:15px;border-radius:5px"><p><strong>ID:</strong> ${salida.idSalida}</p><p><strong>Alumno:</strong> ${escapeHtml(alumnoNombre)}</p><p><strong>Fecha:</strong> ${fecha.toLocaleDateString('es-MX')} ${fecha.toLocaleTimeString('es-MX')}</p></div>
                    <div class="form-group"><label>Motivo:</label><textarea id="motivo-eliminar-salida" required></textarea></div>
                    <div id="msg-modal-eliminar-salida" class="message-box" style="display:none"></div>
                </div>
                <div class="modal-editor-footer"><button class="btn btn-secondary" onclick="cerrarModalEliminarSalida()">Cancelar</button><button class="btn btn-danger" onclick="confirmarEliminarSalida()">Eliminar</button></div></div></div>`;
        const existing = document.getElementById('modal-eliminar-salida');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modal);
    } catch (error) { showMessage('Error al cargar', 'error'); }
}

function cerrarModalEliminarSalida() {
    const modal = document.getElementById('modal-eliminar-salida');
    if (modal) modal.remove();
}

async function confirmarEliminarSalida() {
    const motivo = document.getElementById('motivo-eliminar-salida').value.trim();
    if (!motivo) { mostrarMensajeModalEliminarSalida('Ingrese motivo', 'error'); return; }
    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    if (!admin) { mostrarMensajeModalEliminarSalida('Sesión no válida', 'error'); return; }

    const btn = document.querySelector('#modal-eliminar-salida .btn-danger');
    const original = btn.textContent;
    btn.textContent = 'Eliminando...';
    btn.disabled = true;

    try {
        const res = await fetch(`http://localhost:8080/api/salidas/${registroSalidaSeleccionado.idSalida}`, { method: 'DELETE' });
        if (res.ok) {
            await registrarBitacora('Eliminación de Salida', 'Salida', registroSalidaSeleccionado.idSalida, `Motivo: ${motivo}`, admin.idAdmin);
            mostrarMensajeModalEliminarSalida('✅ Eliminado', 'success');
            setTimeout(() => { cerrarModalEliminarSalida(); cargarHistorialSalidas(); }, 1500);
        } else { mostrarMensajeModalEliminarSalida('Error', 'error'); }
    } catch (error) { mostrarMensajeModalEliminarSalida('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

function mostrarMensajeModalEliminarSalida(msg, tipo) {
    const div = document.getElementById('msg-modal-eliminar-salida');
    if (div) { div.textContent = msg; div.className = `message-box ${tipo}`; div.style.display = 'block'; setTimeout(() => div.style.display = 'none', 3000); }
}

// ==================== MODALES DE BITÁCORA ====================

async function abrirModalEditarBitacora(id) {
    try {
        const res = await fetch(`http://localhost:8080/api/bitacora/${id}`);
        if (!res.ok) throw new Error();
        const reg = await res.json();
        registroBitacoraSeleccionado = reg;
        const fecha = new Date(reg.fechaHora);
        const modal = `
            <div id="modal-editar-bitacora" class="modal-editar" style="display:block">
                <div class="modal-editar-content"><div class="modal-editar-header"><h3>✏️ Editar Bitácora</h3><span class="modal-editar-close" onclick="cerrarModalEditarBitacora()">&times;</span></div>
                <div class="modal-editar-body">
                    <input type="hidden" id="bitacora-id" value="${reg.idBitacora}">
                    <div class="form-row"><div class="form-group"><label>Fecha:</label><input type="date" id="fecha-bitacora" value="${fecha.toISOString().split('T')[0]}" required></div><div class="form-group"><label>Hora:</label><input type="time" id="hora-bitacora" value="${fecha.toTimeString().split(' ')[0]}" required></div></div>
                    <div class="form-group"><label>Acción:</label><input type="text" id="accion-bitacora" value="${escapeHtml(reg.accion)}" required></div>
                    <div class="form-group"><label>Entidad:</label><input type="text" id="entidad-bitacora" value="${escapeHtml(reg.entidadAfectada)}" required></div>
                    <div class="form-group"><label>ID Registro:</label><input type="number" id="id-registro-bitacora" value="${reg.idRegistroAfectado || ''}"></div>
                    <div class="form-group"><label>Descripción:</label><textarea id="descripcion-bitacora" rows="3" required>${escapeHtml(reg.descripcion)}</textarea></div>
                    <div class="form-group"><label>Motivo:</label><textarea id="motivo-bitacora" required></textarea></div>
                    <div id="msg-bitacora" class="message-box" style="display:none"></div>
                </div>
                <div class="modal-editor-footer"><button class="btn btn-secondary" onclick="cerrarModalEditarBitacora()">Cancelar</button><button class="btn btn-primary" onclick="guardarEdicionBitacora()">Guardar</button></div></div></div>`;
        const existing = document.getElementById('modal-editar-bitacora');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modal);
    } catch (error) { showMessage('Error al cargar', 'error'); }
}

function cerrarModalEditarBitacora() {
    const modal = document.getElementById('modal-editar-bitacora');
    if (modal) modal.remove();
}

async function guardarEdicionBitacora() {
    const id = document.getElementById('bitacora-id').value;
    const fecha = document.getElementById('fecha-bitacora').value;
    const hora = document.getElementById('hora-bitacora').value;
    const accion = document.getElementById('accion-bitacora').value.trim();
    const entidad = document.getElementById('entidad-bitacora').value.trim();
    const idReg = document.getElementById('id-registro-bitacora').value;
    const desc = document.getElementById('descripcion-bitacora').value.trim();
    const motivo = document.getElementById('motivo-bitacora').value.trim();
    if (!motivo) { mostrarMensajeModalBitacora('Ingrese motivo', 'error'); return; }

    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    if (!admin) { mostrarMensajeModalBitacora('Sesión no válida', 'error'); return; }

    const btn = document.querySelector('#modal-editar-bitacora .btn-primary');
    const original = btn.textContent;
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
        const res = await fetch(`http://localhost:8080/api/bitacora/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idBitacora: parseInt(id), accion, entidadAfectada: entidad, idRegistroAfectado: idReg ? parseInt(idReg) : null, descripcion: desc, fechaHora: new Date(`${fecha}T${hora}`).toISOString(), idAdmin: registroBitacoraSeleccionado.idAdmin })
        });
        if (res.ok) {
            await registrarBitacora('Modificación de Bitácora', 'Bitácora', id, `Motivo: ${motivo}`, admin.idAdmin);
            mostrarMensajeModalBitacora('✅ Modificado', 'success');
            setTimeout(() => { cerrarModalEditarBitacora(); cargarBitacora(); }, 1500);
        } else { mostrarMensajeModalBitacora('Error', 'error'); }
    } catch (error) { mostrarMensajeModalBitacora('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

function mostrarMensajeModalBitacora(msg, tipo) {
    const div = document.getElementById('msg-bitacora');
    if (div) { div.textContent = msg; div.className = `message-box ${tipo}`; div.style.display = 'block'; setTimeout(() => div.style.display = 'none', 3000); }
}

async function abrirModalEliminarBitacora(id) {
    try {
        const res = await fetch(`http://localhost:8080/api/bitacora/${id}`);
        if (!res.ok) throw new Error();
        const reg = await res.json();
        registroBitacoraSeleccionado = reg;
        const fecha = new Date(reg.fechaHora);
        const modal = `
            <div id="modal-eliminar-bitacora" class="modal-editar" style="display:block">
                <div class="modal-editar-content"><div class="modal-editar-header" style="background:#dc3545"><h3>⚠️ Confirmar Eliminación</h3><span class="modal-editar-close" onclick="cerrarModalEliminarBitacora()">&times;</span></div>
                <div class="modal-editar-body">
                    <p>¿Eliminar este registro?</p>
                    <div style="background:#f5f5f5;padding:15px;border-radius:5px"><p><strong>ID:</strong> ${reg.idBitacora}</p><p><strong>Acción:</strong> ${escapeHtml(reg.accion)}</p><p><strong>Fecha:</strong> ${fecha.toLocaleDateString('es-MX')} ${fecha.toLocaleTimeString('es-MX')}</p></div>
                    <div class="form-group"><label>Motivo:</label><textarea id="motivo-eliminar-bitacora" required></textarea></div>
                    <div id="msg-eliminar-bitacora" class="message-box" style="display:none"></div>
                </div>
                <div class="modal-editor-footer"><button class="btn btn-secondary" onclick="cerrarModalEliminarBitacora()">Cancelar</button><button class="btn btn-danger" onclick="confirmarEliminarBitacora()">Eliminar</button></div></div></div>`;
        const existing = document.getElementById('modal-eliminar-bitacora');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modal);
    } catch (error) { showMessage('Error al cargar', 'error'); }
}

function cerrarModalEliminarBitacora() {
    const modal = document.getElementById('modal-eliminar-bitacora');
    if (modal) modal.remove();
}

async function confirmarEliminarBitacora() {
    const motivo = document.getElementById('motivo-eliminar-bitacora').value.trim();
    if (!motivo) { mostrarMensajeModalEliminarBitacora('Ingrese motivo', 'error'); return; }
    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    if (!admin) { mostrarMensajeModalEliminarBitacora('Sesión no válida', 'error'); return; }

    const btn = document.querySelector('#modal-eliminar-bitacora .btn-danger');
    const original = btn.textContent;
    btn.textContent = 'Eliminando...';
    btn.disabled = true;

    try {
        const res = await fetch(`http://localhost:8080/api/bitacora/${registroBitacoraSeleccionado.idBitacora}`, { method: 'DELETE' });
        if (res.ok) {
            await registrarBitacora('Eliminación de Bitácora', 'Bitácora', registroBitacoraSeleccionado.idBitacora, `Motivo: ${motivo}`, admin.idAdmin);
            mostrarMensajeModalEliminarBitacora('✅ Eliminado', 'success');
            setTimeout(() => { cerrarModalEliminarBitacora(); cargarBitacora(); }, 1500);
        } else { mostrarMensajeModalEliminarBitacora('Error', 'error'); }
    } catch (error) { mostrarMensajeModalEliminarBitacora('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

function mostrarMensajeModalEliminarBitacora(msg, tipo) {
    const div = document.getElementById('msg-eliminar-bitacora');
    if (div) { div.textContent = msg; div.className = `message-box ${tipo}`; div.style.display = 'block'; setTimeout(() => div.style.display = 'none', 3000); }
}

// ==================== DETALLES DEL ALUMNO ====================

async function mostrarDetalleAlumno(id) {
    if (!id) { showMessage('No hay información', 'error'); return; }
    try {
        const res = await fetch(`http://localhost:8080/api/alumnos/${id}`);
        if (!res.ok) throw new Error();
        const a = await res.json();
        const container = document.getElementById('alumno-detalle-container');
        if (container) {
            container.innerHTML = `
                <div class="alumno-detalle-grid">
                    <div class="alumno-detalle-item"><label>Nombre:</label><span>${escapeHtml(a.nombre)}</span></div>
                    <div class="alumno-detalle-item"><label>Apellidos:</label><span>${escapeHtml(a.apellidos)}</span></div>
                    <div class="alumno-detalle-item"><label>Matrícula:</label><span>${escapeHtml(a.matricula)}</span></div>
                    <div class="alumno-detalle-item"><label>Correo:</label><span>${escapeHtml(a.correoInstitucional)}</span></div>
                    <div class="alumno-detalle-item"><label>Licenciatura:</label><span>${escapeHtml(a.licenciatura || 'No registrada')}</span></div>
                    <div class="alumno-detalle-item"><label>Trimestre:</label><span>${a.trimestreActual || 'No registrado'}</span></div>
                    <div class="alumno-detalle-item"><label>Estatus:</label><span>${escapeHtml(a.estatusAcademico)}</span></div>
                    <div class="alumno-detalle-item"><label>Estado Cuenta:</label><span>${escapeHtml(a.estadoCuenta)}</span></div>
                </div>`;
        }
        document.getElementById('modal-alumno').style.display = 'block';
    } catch (error) { showMessage('Error al cargar', 'error'); }
}

function cerrarModalAlumno() {
    document.getElementById('modal-alumno').style.display = 'none';
}

// ==================== ACTUALIZAR ALUMNO ====================

let alumnoActualizar = null;

async function buscarAlumnoActualizar() {
    const mat = document.getElementById('matricula-buscar').value.trim();
    if (!mat) { showMessage('Ingrese matrícula', 'error'); return; }
    clearMessage();
    const btn = document.querySelector('.btn-buscar');
    const original = btn.textContent;
    btn.textContent = 'Buscando...';
    btn.disabled = true;

    try {
        const res = await fetch(`http://localhost:8080/api/alumnos/matricula/${mat}`);
        if (!res.ok) {
            const div = document.createElement('div');
            div.className = 'alumno-not-found';
            div.innerHTML = `<p>❌ No encontrado: ${mat}</p>`;
            document.getElementById('search-section').insertAdjacentElement('afterend', div);
            document.getElementById('form-container').style.display = 'none';
            alumnoActualizar = null;
            showMessage('Alumno no encontrado', 'error');
            return;
        }
        alumnoActualizar = await res.json();
        const found = document.createElement('div');
        found.className = 'alumno-found';
        found.innerHTML = `<p>✅ Encontrado: ${alumnoActualizar.nombre} ${alumnoActualizar.apellidos}</p>`;
        document.getElementById('search-section').insertAdjacentElement('afterend', found);
        mostrarFormularioActualizacion(alumnoActualizar);
    } catch (error) { showMessage('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

function mostrarFormularioActualizacion(alumno) {
    const container = document.getElementById('form-container');
    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    container.innerHTML = `
        <div class="form-update-container">
            <h2>Actualizar Datos</h2>
            <form id="update-form">
                <div class="form-row"><div class="form-group"><label>Matrícula:</label><input id="matricula-u" value="${escapeHtml(alumno.matricula)}" required></div><div class="form-group"><label>Correo:</label><input id="correo-u" value="${escapeHtml(alumno.correoInstitucional)}" required></div></div>
                <div class="form-row"><div class="form-group"><label>Nombre:</label><input id="nombre-u" value="${escapeHtml(alumno.nombre)}" required></div><div class="form-group"><label>Apellidos:</label><input id="apellidos-u" value="${escapeHtml(alumno.apellidos)}" required></div></div>
                <div class="form-row"><div class="form-group"><label>Teléfono:</label><input id="telefono-u" value="${escapeHtml(alumno.telefono || '')}"></div><div class="form-group"><label>Fecha Nac.:</label><input type="date" id="fecha-u" value="${alumno.fechaNacimiento || ''}" required></div></div>
                <div class="form-row"><div class="form-group"><label>Licenciatura:</label><input id="lic-u" value="${escapeHtml(alumno.licenciatura || '')}" required></div><div class="form-group"><label>Trimestre:</label><input type="number" id="trim-u" value="${alumno.trimestreActual || ''}" required></div></div>
                <div class="form-row"><div class="form-group"><label>Estatus:</label><select id="estatus-u"><option ${alumno.estatusAcademico==='Activo'?'selected':''}>Activo</option><option ${alumno.estatusAcademico==='Sin_carga'?'selected':''}>Sin_carga</option><option ${alumno.estatusAcademico==='Egresado'?'selected':''}>Egresado</option></select></div><div class="form-group"><label>Estado Cuenta:</label><select id="cuenta-u"><option ${alumno.estadoCuenta==='Activa'?'selected':''}>Activa</option><option ${alumno.estadoCuenta==='Suspendida'?'selected':''}>Suspendida</option></select></div></div>
                <div class="form-row"><div class="form-group"><label>Modificado por:</label><input value="${admin.nombre} ${admin.apellidos}" disabled></div></div>
                <div class="motivo-section"><label>Motivo:</label><textarea id="motivo-u" required></textarea></div>
                <div class="form-actions"><button type="button" class="btn-actualizar" onclick="actualizarAlumnoSubmit()">Actualizar</button><button type="button" class="btn-cancelar" onclick="cancelarActualizacion()">Cancelar</button></div>
            </form>
        </div>`;
    container.style.display = 'block';
    cargarAdminRegistroOriginal(alumno.idAdminRegistro);
}

async function cargarAdminRegistroOriginal(id) {
    const input = document.getElementById('admin-registro-original');
    if (!input) return;
    if (!id) { input.value = 'No disponible'; return; }
    try {
        const res = await fetch(`http://localhost:8080/api/administradores/${id}`);
        if (res.ok) { const a = await res.json(); input.value = `${a.nombre} ${a.apellidos}`; }
        else input.value = 'No encontrado';
    } catch { input.value = 'Error'; }
}

async function actualizarAlumnoSubmit() {
    const data = {
        idAlumno: alumnoActualizar.idAlumno, matricula: document.getElementById('matricula-u').value.trim(),
        nombre: document.getElementById('nombre-u').value.trim(), apellidos: document.getElementById('apellidos-u').value.trim(),
        correoInstitucional: document.getElementById('correo-u').value.trim(), telefono: document.getElementById('telefono-u').value.trim() || null,
        fechaNacimiento: document.getElementById('fecha-u').value, licenciatura: document.getElementById('lic-u').value.trim(),
        trimestreActual: parseInt(document.getElementById('trim-u').value), estatusAcademico: document.getElementById('estatus-u').value,
        estadoCuenta: document.getElementById('cuenta-u').value, idAdminRegistro: alumnoActualizar.idAdminRegistro
    };
    const motivo = document.getElementById('motivo-u').value.trim();
    if (!motivo) { showMessage('Ingrese motivo', 'error'); return; }

    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    const btn = document.querySelector('.btn-actualizar');
    const original = btn.textContent;
    btn.textContent = 'Actualizando...';
    btn.disabled = true;

    try {
        const res = await fetch(`http://localhost:8080/api/alumnos/${alumnoActualizar.idAlumno}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        if (res.ok) {
            await registrarBitacora('Modificación de Alumno', 'Alumno', alumnoActualizar.idAlumno, `Motivo: ${motivo}`, admin.idAdmin);
            showMessage('✅ Actualizado. Redirigiendo...', 'success', false);
            setTimeout(() => window.location.href = 'dashboard.html', 3000);
        } else { showMessage('Error al actualizar', 'error'); }
    } catch (error) { showMessage('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

function cancelarActualizacion() {
    document.getElementById('matricula-buscar').value = '';
    document.getElementById('form-container').style.display = 'none';
    document.querySelectorAll('.alumno-found, .alumno-not-found').forEach(el => el.remove());
    alumnoActualizar = null;
    showMessage('Cancelado', 'info');
}

// ==================== BAJA ALUMNO ====================

let alumnoBaja = null;

async function buscarAlumnoBaja() {
    const mat = document.getElementById('matricula-buscar').value.trim();
    if (!mat) { showMessage('Ingrese matrícula', 'error'); return; }
    clearMessage();
    const btn = document.querySelector('.btn-buscar');
    const original = btn.textContent;
    btn.textContent = 'Buscando...';
    btn.disabled = true;

    try {
        const res = await fetch(`http://localhost:8080/api/alumnos/matricula/${mat}`);
        if (!res.ok) {
            const div = document.createElement('div');
            div.className = 'alumno-not-found';
            div.innerHTML = `<p>❌ No encontrado: ${mat}</p>`;
            document.getElementById('search-section').insertAdjacentElement('afterend', div);
            document.getElementById('form-container').style.display = 'none';
            alumnoBaja = null;
            showMessage('Alumno no encontrado', 'error');
            return;
        }
        alumnoBaja = await res.json();
        const found = document.createElement('div');
        found.className = 'alumno-found';
        found.innerHTML = `<p>✅ Encontrado: ${alumnoBaja.nombre} ${alumnoBaja.apellidos}</p><p style="color:#856404">⚠️ Esta acción es irreversible</p>`;
        document.getElementById('search-section').insertAdjacentElement('afterend', found);
        mostrarFormularioBaja(alumnoBaja);
    } catch (error) { showMessage('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

async function mostrarFormularioBaja(alumno) {
    const container = document.getElementById('form-container');
    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    const adminReg = await obtenerAdminNombre(alumno.idAdminRegistro);
    container.innerHTML = `
        <div class="baja-container">
            <h2>🗑️ Confirmar Baja</h2>
            <div class="warning-box"><p>⚠️ Esta acción es irreversible</p></div>
            <div class="alumno-info-baja"><h3>Información del Alumno</h3>
                <div class="info-grid-baja">
                    ${[['Nombre:', alumno.nombre], ['Apellidos:', alumno.apellidos], ['Matrícula:', alumno.matricula],
        ['Correo:', alumno.correoInstitucional], ['Teléfono:', alumno.telefono || 'No registrado'],
        ['Fecha Nac.:', alumno.fechaNacimiento ? new Date(alumno.fechaNacimiento).toLocaleDateString('es-MX') : 'No registrada'],
        ['Licenciatura:', alumno.licenciatura || 'No registrada'], ['Trimestre:', alumno.trimestreActual || 'No registrado'],
        ['Estatus:', alumno.estatusAcademico], ['Estado Cuenta:', alumno.estadoCuenta],
        ['Fecha Registro:', new Date(alumno.fechaRegistro).toLocaleDateString('es-MX')],
        ['Registrado por:', adminReg]].map(([l,v]) => `<div class="info-item-baja"><label>${l}</label><span>${escapeHtml(v)}</span></div>`).join('')}
                </div>
            </div>
            <div class="admin-info-baja"><p><strong>Administrador que elimina:</strong> ${admin.nombre} ${admin.apellidos}</p></div>
            <div class="motivo-baja-section"><label>Motivo de eliminación:</label><textarea id="motivo-baja" required></textarea></div>
            <div class="form-actions"><button class="btn-baja" onclick="confirmarBajaAlumno()">Dar de Baja</button><button class="btn-cancelar" onclick="cancelarBaja()">Cancelar</button></div>
        </div>`;
    container.style.display = 'block';
}

async function obtenerAdminNombre(id) {
    if (!id) return 'No disponible';
    try { const res = await fetch(`http://localhost:8080/api/administradores/${id}`); if (res.ok) { const a = await res.json(); return `${a.nombre} ${a.apellidos}`; } } catch { }
    return 'No disponible';
}

async function confirmarBajaAlumno() {
    const motivo = document.getElementById('motivo-baja').value.trim();
    if (!motivo) { showMessage('Ingrese motivo', 'error'); return; }
    const admin = JSON.parse(sessionStorage.getItem('adminActual'));
    if (!confirm(`⚠️ Eliminar a ${alumnoBaja.nombre} ${alumnoBaja.apellidos}?`)) return;

    const btn = document.querySelector('.btn-baja');
    const original = btn.textContent;
    btn.textContent = 'Eliminando...';
    btn.disabled = true;

    try {
        await registrarBitacora('Eliminación de Alumno', 'Alumno', alumnoBaja.idAlumno, `Motivo: ${motivo}`, admin.idAdmin);
        const res = await fetch(`http://localhost:8080/api/alumnos/${alumnoBaja.idAlumno}`, { method: 'DELETE' });
        if (res.ok) {
            showMessage('✅ Alumno eliminado. Redirigiendo...', 'success', false);
            setTimeout(() => window.location.href = 'dashboard.html', 3000);
        } else { showMessage('Error al eliminar', 'error'); }
    } catch (error) { showMessage('Error de conexión', 'error'); }
    finally { btn.textContent = original; btn.disabled = false; }
}

function cancelarBaja() {
    document.getElementById('matricula-buscar').value = '';
    document.getElementById('form-container').style.display = 'none';
    document.querySelectorAll('.alumno-found, .alumno-not-found').forEach(el => el.remove());
    alumnoBaja = null;
    showMessage('Cancelado', 'info');
}

// ==================== INICIALIZACIÓN ====================
window.onclick = function(event) {
    const modals = ['modal-atender', 'modal-punto', 'modal-eliminar', 'modal-alumno'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (event.target === modal) modal.style.display = 'none';
    });
};

verificarAutenticacion();