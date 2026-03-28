// static/js/alumno-script.js

// Variables globales
let mediaStream = null;
let redirectTimer = null;

// Función para actualizar fecha y hora en tiempo real
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

// Iniciar actualización del reloj
if (document.getElementById('current-date')) {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Función para iniciar la cámara
async function startCamera() {
    const video = document.getElementById('video');
    if (!video) return;

    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = mediaStream;
        await video.play();
    } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        showMessage('No se pudo acceder a la cámara. Por favor, verifica los permisos.', 'error');
    }
}

// Función para detener la cámara
function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
}

// Función para mostrar mensajes
function showMessage(message, type, autoHide = true) {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';

    if (autoHide) {
        setTimeout(() => {
            if (messageBox) {
                messageBox.style.display = 'none';
            }
        }, 5000);
    }
}

// Función para limpiar mensajes
function clearMessage() {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.style.display = 'none';
        messageBox.textContent = '';
    }
}

// Función para limpiar el temporizador de redirección
function clearRedirectTimer() {
    if (redirectTimer) {
        clearTimeout(redirectTimer);
        redirectTimer = null;
    }
}

// Función para redirigir después de un tiempo
function redirectAfterDelay(url, delay = 3000) {
    clearRedirectTimer();
    redirectTimer = setTimeout(() => {
        window.location.href = url;
    }, delay);
}

// ==================== FUNCIONES PARA INGRESO (Tabla acceso) ====================

// Función para verificar ingreso por QR
async function verificarIngresoQR() {
    const codigoInput = document.getElementById('codigo-manual');
    const codigo = codigoInput ? codigoInput.value.trim() : '';

    if (!codigo) {
        showMessage('Por favor, ingresa el código QR', 'error');
        return;
    }

    clearMessage();

    try {
        const credencialResponse = await fetch(`http://localhost:8080/api/credenciales/qr/${codigo}`);

        if (!credencialResponse.ok) {
            showMessage('❌ Usuario no encontrado, favor de volverlo a intentarlo o intenta mediante el escaneo facial', 'error');
            return;
        }

        const credencial = await credencialResponse.json();

        if (credencial.estatus !== 'Activa') {
            showMessage('❌ La credencial no está activa. Contacta al administrador.', 'error');
            return;
        }

        const alumnoResponse = await fetch(`http://localhost:8080/api/alumnos/${credencial.idAlumno}`);

        if (!alumnoResponse.ok) {
            showMessage('❌ Alumno no encontrado en el sistema', 'error');
            return;
        }

        const alumno = await alumnoResponse.json();
        const nombreCompleto = `${alumno.nombre} ${alumno.apellidos}`;

        // Registrar ingreso en la tabla acceso
        const accesoData = {
            fechaHora: new Date().toISOString(),
            metodoAutenticacion: 'QR',
            resultado: 'Permitido',
            idAlumno: alumno.idAlumno,
            idPuntoAcceso: 1
        };

        await fetch('http://localhost:8080/api/accesos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accesoData)
        });

        const mensaje = `✅ Alumno: ${nombreCompleto} autorizado exitosamente, bienvenido a la UAM Cuajimalpa`;
        showMessage(mensaje, 'success', false);
        redirectAfterDelay('/html/bienvenida.html', 3000);

    } catch (error) {
        console.error('Error:', error);
        showMessage('❌ Error al procesar la solicitud. Por favor, intenta de nuevo.', 'error');
    }
}

// Función para verificar ingreso por reconocimiento facial
async function verificarIngresoFacial() {
    const plantillaInput = document.getElementById('plantilla-manual');
    const plantilla = plantillaInput ? plantillaInput.value.trim() : '';

    if (!plantilla) {
        showMessage('Por favor, ingresa la plantilla facial', 'error');
        return;
    }

    clearMessage();

    try {
        const registrosResponse = await fetch('http://localhost:8080/api/registros-faciales');

        if (!registrosResponse.ok) {
            showMessage('Error al verificar registro facial', 'error');
            return;
        }

        const registros = await registrosResponse.json();
        const registroEncontrado = registros.find(r => r.plantillaFacial === plantilla);

        if (!registroEncontrado) {
            showMessage('❌ Usuario no encontrado, favor de volverlo a intentarlo o intenta mediante el código QR de tu credencial', 'error');
            return;
        }

        if (registroEncontrado.estado !== 'Activo') {
            showMessage('❌ El registro facial no está activo. Contacta al administrador.', 'error');
            return;
        }

        const alumnoResponse = await fetch(`http://localhost:8080/api/alumnos/${registroEncontrado.idAlumno}`);

        if (!alumnoResponse.ok) {
            showMessage('❌ Alumno no encontrado en el sistema', 'error');
            return;
        }

        const alumno = await alumnoResponse.json();
        const nombreCompleto = `${alumno.nombre} ${alumno.apellidos}`;

        // Registrar ingreso en la tabla acceso
        const accesoData = {
            fechaHora: new Date().toISOString(),
            metodoAutenticacion: 'Facial',
            resultado: 'Permitido',
            idAlumno: alumno.idAlumno,
            idPuntoAcceso: 1
        };

        await fetch('http://localhost:8080/api/accesos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accesoData)
        });

        const mensaje = `✅ Alumno: ${nombreCompleto} autorizado exitosamente, bienvenido a la UAM Cuajimalpa`;
        showMessage(mensaje, 'success', false);
        redirectAfterDelay('/html/bienvenida.html', 3000);

    } catch (error) {
        console.error('Error:', error);
        showMessage('❌ Error al procesar la solicitud. Por favor, intenta de nuevo.', 'error');
    }
}

// ==================== FUNCIONES PARA SALIDA (Tabla salida) ====================

// Función para verificar salida por QR
async function verificarSalidaQR() {
    const codigoInput = document.getElementById('codigo-manual');
    const codigo = codigoInput ? codigoInput.value.trim() : '';

    if (!codigo) {
        showMessage('Por favor, ingresa el código QR', 'error');
        return;
    }

    clearMessage();

    try {
        const credencialResponse = await fetch(`http://localhost:8080/api/credenciales/qr/${codigo}`);

        if (!credencialResponse.ok) {
            showMessage('❌ Usuario no encontrado, favor de volverlo a intentarlo o intenta mediante el escaneo facial', 'error');
            return;
        }

        const credencial = await credencialResponse.json();

        if (credencial.estatus !== 'Activa') {
            showMessage('❌ La credencial no está activa. Contacta al administrador.', 'error');
            return;
        }

        const alumnoResponse = await fetch(`http://localhost:8080/api/alumnos/${credencial.idAlumno}`);

        if (!alumnoResponse.ok) {
            showMessage('❌ Alumno no encontrado en el sistema', 'error');
            return;
        }

        const alumno = await alumnoResponse.json();
        const nombreCompleto = `${alumno.nombre} ${alumno.apellidos}`;
        const fechaHora = new Date().toLocaleString('es-MX');

        // Registrar salida en la tabla salida
        const salidaData = {
            fechaHora: new Date().toISOString(),
            metodoAutenticacion: 'QR',
            resultado: 'Permitido',
            idAlumno: alumno.idAlumno,
            idPuntoAcceso: 1
        };

        await fetch('http://localhost:8080/api/salidas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(salidaData)
        });

        const mensaje = `✅ Alumno: ${nombreCompleto} registra salida: ${fechaHora} usando el código QR de su credencial de manera exitosa, esperamos que hayas tenido un buen día`;
        showMessage(mensaje, 'success', false);
        redirectAfterDelay('/html/bienvenida.html', 3000);

    } catch (error) {
        console.error('Error:', error);
        showMessage('❌ Error al procesar la solicitud. Por favor, intenta de nuevo.', 'error');
    }
}

// Función para verificar salida por reconocimiento facial
async function verificarSalidaFacial() {
    const plantillaInput = document.getElementById('plantilla-manual');
    const plantilla = plantillaInput ? plantillaInput.value.trim() : '';

    if (!plantilla) {
        showMessage('Por favor, ingresa la plantilla facial', 'error');
        return;
    }

    clearMessage();

    try {
        const registrosResponse = await fetch('http://localhost:8080/api/registros-faciales');

        if (!registrosResponse.ok) {
            showMessage('Error al verificar registro facial', 'error');
            return;
        }

        const registros = await registrosResponse.json();
        const registroEncontrado = registros.find(r => r.plantillaFacial === plantilla);

        if (!registroEncontrado) {
            showMessage('❌ Usuario no encontrado, favor de volverlo a intentarlo o intenta mediante el código QR de tu credencial', 'error');
            return;
        }

        if (registroEncontrado.estado !== 'Activo') {
            showMessage('❌ El registro facial no está activo. Contacta al administrador.', 'error');
            return;
        }

        const alumnoResponse = await fetch(`http://localhost:8080/api/alumnos/${registroEncontrado.idAlumno}`);

        if (!alumnoResponse.ok) {
            showMessage('❌ Alumno no encontrado en el sistema', 'error');
            return;
        }

        const alumno = await alumnoResponse.json();
        const nombreCompleto = `${alumno.nombre} ${alumno.apellidos}`;
        const fechaHora = new Date().toLocaleString('es-MX');

        // Registrar salida en la tabla salida
        const salidaData = {
            fechaHora: new Date().toISOString(),
            metodoAutenticacion: 'Facial',
            resultado: 'Permitido',
            idAlumno: alumno.idAlumno,
            idPuntoAcceso: 1
        };

        await fetch('http://localhost:8080/api/salidas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(salidaData)
        });

        const mensaje = `✅ Alumno: ${nombreCompleto} registra salida: ${fechaHora} usando el registro facial de manera exitosa, esperamos que hayas tenido un buen día`;
        showMessage(mensaje, 'success', false);
        redirectAfterDelay('/html/bienvenida.html', 3000);

    } catch (error) {
        console.error('Error:', error);
        showMessage('❌ Error al procesar la solicitud. Por favor, intenta de nuevo.', 'error');
    }
}

// Función para enviar reporte técnico
async function enviarReporte() {
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const numeroTorniquete = document.getElementById('numero-torniquete').value;
    const reporta = document.getElementById('reporta').value;
    const descripcion = document.getElementById('descripcion').value;

    if (!numeroTorniquete || !reporta || !descripcion) {
        showMessage('Por favor, completa todos los campos requeridos', 'error');
        return;
    }

    const reporteData = {
        fecha: fecha,
        hora: hora,
        numeroTorniquete: parseInt(numeroTorniquete),
        reporta: reporta,
        descripcion: descripcion
    };

    try {
        const response = await fetch('http://localhost:8080/api/reportes-tecnicos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reporteData)
        });

        if (response.ok) {
            showMessage('✅ Reporte enviado exitosamente. Gracias por tu reporte.', 'success', false);
            setTimeout(() => {
                window.location.href = '/html/bienvenida.html';
            }, 3000);
        } else {
            const error = await response.text();
            showMessage(`❌ Error al enviar reporte: ${error}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('❌ Error al enviar el reporte. Por favor, intenta de nuevo.', 'error');
    }
}

// Inicializar campos de fecha y hora en reporte
function initReporteForm() {
    const now = new Date();
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');

    if (fechaInput) {
        fechaInput.value = now.toISOString().split('T')[0];
    }

    if (horaInput) {
        horaInput.value = now.toTimeString().split(' ')[0];
    }
}

// Detener cámara al salir de la página
window.addEventListener('beforeunload', () => {
    stopCamera();
    clearRedirectTimer();
});