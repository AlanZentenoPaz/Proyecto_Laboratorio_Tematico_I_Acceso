-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_acceso_uam;
USE sistema_acceso_uam;

-- =====================================================
-- TABLA: administrador
-- =====================================================
CREATE TABLE administrador (
                               id_admin INT PRIMARY KEY AUTO_INCREMENT,
                               nombre VARCHAR(100) NOT NULL,
                               apellidos VARCHAR(100) NOT NULL,
                               correo_institucional VARCHAR(150) NOT NULL UNIQUE,
                               telefono VARCHAR(20),
                               rol ENUM('Seguridad', 'Sistemas', 'General') NOT NULL,
                               usuario VARCHAR(50) NOT NULL UNIQUE,
                               contrasena_hash VARCHAR(255) NOT NULL,
                               estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo'
);

-- =====================================================
-- TABLA: alumno
-- =====================================================
CREATE TABLE alumno (
                        id_alumno INT PRIMARY KEY AUTO_INCREMENT,
                        matricula VARCHAR(20) NOT NULL UNIQUE,
                        nombre VARCHAR(100) NOT NULL,
                        apellidos VARCHAR(100) NOT NULL,
                        correo_institucional VARCHAR(150) NOT NULL UNIQUE,
                        telefono VARCHAR(20),
                        fecha_nacimiento DATE,
                        licenciatura VARCHAR(100),
                        trimestre_actual INT,
                        estatus_academico ENUM('Activo', 'Sin_carga', 'Egresado') NOT NULL,
                        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
                        estado_cuenta ENUM('Activa', 'Suspendida') NOT NULL DEFAULT 'Activa',
                        id_admin_registro INT,
                        FOREIGN KEY (id_admin_registro) REFERENCES administrador(id_admin) ON DELETE SET NULL
);

-- =====================================================
-- TABLA: punto_acceso
-- =====================================================
CREATE TABLE punto_acceso (
                              id_punto_acceso INT PRIMARY KEY AUTO_INCREMENT,
                              nombre VARCHAR(100) NOT NULL UNIQUE,
                              ubicacion VARCHAR(150),
                              tipo ENUM('Principal', 'Secundario') NOT NULL,
                              estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo'
);

-- =====================================================
-- TABLA: credencial
-- =====================================================
CREATE TABLE credencial (
                            id_credencial INT PRIMARY KEY AUTO_INCREMENT,
                            codigo_qr VARCHAR(255) NOT NULL UNIQUE,
                            fecha_emision DATE NOT NULL,
                            fecha_expiracion DATE NOT NULL,
                            estatus ENUM('Activa', 'Extraviada', 'En_tramite', 'Cancelada') NOT NULL,
                            id_alumno INT UNIQUE,
                            id_admin_autorizo INT,
                            FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno) ON DELETE CASCADE,
                            FOREIGN KEY (id_admin_autorizo) REFERENCES administrador(id_admin) ON DELETE SET NULL
);

-- =====================================================
-- TABLA: registro_facial
-- =====================================================
CREATE TABLE registro_facial (
                                 id_registro_facial INT PRIMARY KEY AUTO_INCREMENT,
                                 plantilla_facial TEXT NOT NULL,
                                 fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
                                 fecha_actualizacion DATETIME,
                                 estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
                                 id_alumno INT UNIQUE,
                                 id_admin_autorizo INT,
                                 FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno) ON DELETE CASCADE,
                                 FOREIGN KEY (id_admin_autorizo) REFERENCES administrador(id_admin) ON DELETE SET NULL
);

-- =====================================================
-- TABLA: acceso
-- =====================================================
CREATE TABLE acceso (
                        id_acceso INT PRIMARY KEY AUTO_INCREMENT,
                        fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
                        metodo_autenticacion ENUM('QR', 'Facial') NOT NULL,
                        resultado ENUM('Permitido', 'Denegado') NOT NULL,
                        id_alumno INT,
                        id_punto_acceso INT,
                        FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno) ON DELETE SET NULL,
                        FOREIGN KEY (id_punto_acceso) REFERENCES punto_acceso(id_punto_acceso) ON DELETE SET NULL,
                        INDEX idx_fecha_hora (fecha_hora),
                        INDEX idx_alumno (id_alumno),
                        INDEX idx_punto_acceso (id_punto_acceso)
);

-- =====================================================
-- TABLA: salida (NUEVA)
-- =====================================================
CREATE TABLE salida (
                        id_salida INT PRIMARY KEY AUTO_INCREMENT,
                        fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
                        metodo_autenticacion ENUM('QR', 'Facial') NOT NULL,
                        resultado ENUM('Permitido', 'Denegado') NOT NULL,
                        id_alumno INT,
                        id_punto_acceso INT,
                        FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno) ON DELETE SET NULL,
                        FOREIGN KEY (id_punto_acceso) REFERENCES punto_acceso(id_punto_acceso) ON DELETE SET NULL,
                        INDEX idx_fecha_hora (fecha_hora),
                        INDEX idx_alumno (id_alumno),
                        INDEX idx_punto_acceso (id_punto_acceso)
);

-- =====================================================
-- TABLA: bitacora_administrador
-- =====================================================
CREATE TABLE bitacora_administrador (
                                        id_bitacora INT PRIMARY KEY AUTO_INCREMENT,
                                        accion VARCHAR(150) NOT NULL,
                                        entidad_afectada VARCHAR(100) NOT NULL,
                                        id_registro_afectado INT,
                                        descripcion TEXT,
                                        fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        id_admin INT,
                                        FOREIGN KEY (id_admin) REFERENCES administrador(id_admin) ON DELETE SET NULL,
                                        INDEX idx_fecha_hora (fecha_hora),
                                        INDEX idx_entidad_afectada (entidad_afectada),
                                        INDEX idx_admin (id_admin)
);


-- =====================================================
-- TABLA: reporte_tecnico
-- =====================================================
CREATE TABLE IF NOT EXISTS reporte_tecnico (
                                               id_reporte INT AUTO_INCREMENT PRIMARY KEY,
                                               fecha DATE NOT NULL,
                                               hora TIME NOT NULL,
                                               numero_torniquete INT NOT NULL CHECK (numero_torniquete BETWEEN 1 AND 4),
    reporta VARCHAR(50) NOT NULL CHECK (reporta IN ('Alumno', 'Profesor', 'Otro')),
    descripcion TEXT NOT NULL,

    id_admin_atendio INT, -- 👈 NUEVO CAMPO

    FOREIGN KEY (id_admin_atendio)
    REFERENCES administrador(id_admin)
    ON DELETE SET NULL,

    INDEX idx_fecha (fecha),
    INDEX idx_numero_torniquete (numero_torniquete),
    INDEX idx_reporta (reporta),
    INDEX idx_fecha_torniquete (fecha, numero_torniquete)
    );

