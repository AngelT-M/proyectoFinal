CREATE DATABASE IF NOT EXISTS bd_entidad_educativa_f;
USE bd_entidad_educativa_f;


CREATE TABLE roles (
    rol_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    nom_rol VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE usuarios (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    nom_usuario VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol_id TINYINT NOT NULL
);

CREATE TABLE token_acceso (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATETIME NOT NULL,
    activo TINYINT(1) DEFAULT 1
);

CREATE TABLE personal_administrativos (
    personal_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    cargo ENUM('DIRECTOR','SUBDIRECTOR','SECRETARIA','CONTADOR','ADMIN') NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(25)
);

CREATE TABLE alumnos (
    alumno_id INT AUTO_INCREMENT PRIMARY KEY,
    carne VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    email VARCHAR(100),
    nom_encargado VARCHAR(100) NOT NULL,
    tel_personal VARCHAR(20),
    tel_encargado VARCHAR(20) NOT NULL,
    usuario_id INT UNIQUE NOT NULL
);

CREATE TABLE maestros (
    maestro_id INT AUTO_INCREMENT PRIMARY KEY,
    carne_maestro VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    email VARCHAR(100),
    tel_personal VARCHAR(20),
    tel_casa VARCHAR(20),
    usuario_id INT UNIQUE NULL
);

CREATE TABLE niveles_educativos (
    nivel_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    nom_nivel VARCHAR(50) NOT NULL
);

CREATE TABLE grados (
    grado_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    nom_grado VARCHAR(50) NOT NULL,
    nivel_id TINYINT NOT NULL
);

CREATE TABLE secciones (
    seccion_id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    nom_seccion VARCHAR(10) NOT NULL
);

CREATE TABLE grados_secciones (
    grado_seccion_id INT AUTO_INCREMENT PRIMARY KEY,
    grado_id TINYINT NOT NULL,
    seccion_id SMALLINT NOT NULL,
    cantidad_estudiantes TINYINT UNSIGNED DEFAULT 0,
    ciclo YEAR NOT NULL,
    CONSTRAINT uq_grados_secciones_ciclo_grado_seccion UNIQUE (grado_id, seccion_id, ciclo)
);

CREATE TABLE asignacion_grados (
    asignacion_grado_id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    grado_seccion_id INT NOT NULL
);

CREATE TABLE cursos (
    curso_id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    nom_curso VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE asignacion_curso_maestro (
    asignacion_curso_maestro_id INT AUTO_INCREMENT PRIMARY KEY,
    maestro_id INT NOT NULL,
    grado_seccion_id INT NOT NULL,
    curso_id SMALLINT NOT NULL
);

CREATE TABLE bimestres (
    bimestre_id INT AUTO_INCREMENT PRIMARY KEY,
    ciclo YEAR NOT NULL,
    nombre VARCHAR(30) NOT NULL,
    orden TINYINT UNSIGNED NOT NULL,
    fecha_inicio DATE NULL,
    fecha_fin DATE NULL,
    UNIQUE KEY uq_bimestres_ciclo_nombre (ciclo, nombre)
);

INSERT INTO bimestres (ciclo, nombre, orden) VALUES
(2026, '1er Bimestre', 1),
(2026, '2do Bimestre', 2),
(2026, '3er Bimestre', 3),
(2026, '4to Bimestre', 4),
(2026, 'Recuperacion', 5);

CREATE TABLE asistencia (
    asistencia_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    asignacion_grado_id INT NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('PRESENTE','TARDE','AUSENTE') NOT NULL
);

CREATE TABLE actividades_curso (
    actividad_curso_id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_curso_maestro_id INT NOT NULL,
    bimestre_id INT UNSIGNED NOT NULL,
    nom_actividad VARCHAR(100) NOT NULL,
    punteo_maximo DECIMAL(5,2) NOT NULL,
    descripcion TEXT
);

CREATE TABLE calificaciones (
    calificacion_id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_grado_id INT NOT NULL,
    actividad_curso_id INT NOT NULL,
    punteo_obtenido DECIMAL(5,2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE examen_enviados (
    examen_id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_curso_maestro_id INT NOT NULL,
    bimestre_id INT UNSIGNED NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT,
    archivo_url VARCHAR(255) NOT NULL,
    estado ENUM('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'PENDIENTE',
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_autorizacion DATETIME NULL,
    personal_id TINYINT NULL
);

CREATE TABLE pagos (
    pago_id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(150),
    cantidad_pagos INT NOT NULL,
    monto_base DECIMAL(10,2) NOT NULL,
    grado_id TINYINT NOT NULL
);

CREATE TABLE cargos_alumnos (
    cargo_id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_grado_id INT NOT NULL,
    pago_id INT NOT NULL,
    monto_cobrar DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('PENDIENTE','PAGO_PARCIAL','PAGO_TOTAL') DEFAULT 'PENDIENTE'
);

CREATE TABLE pagos_realizados (
    pago_realizado_id INT AUTO_INCREMENT PRIMARY KEY,
    personal_id TINYINT NOT NULL,
    cargo_id INT NOT NULL,
    monto_pagado DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calendario_actividades (
    actividad_id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME NOT NULL,
    fecha_final DATETIME NOT NULL,
    tipo_evento ENUM('INSTITUCIONAL','ACADEMICO','EXAMEN','DEPORTIVO','CULTURAL') NOT NULL,
    usuario_id INT NOT NULL,
    nivel_id TINYINT NULL
);


-- ==========================================================
-- 2. RESTRICCIONES DE LLAVES FORÁNEAS (INTEGRIDAD REFERENCIAL)
-- ==========================================================

ALTER TABLE usuarios 
    ADD CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) 
    REFERENCES roles(rol_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE token_acceso 
    ADD CONSTRAINT fk_token_usuario FOREIGN KEY (usuario_id) 
    REFERENCES usuarios(usuario_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE personal_administrativos 
    ADD CONSTRAINT fk_personal_usuario FOREIGN KEY (usuario_id) 
    REFERENCES usuarios(usuario_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE alumnos 
    ADD CONSTRAINT fk_alumno_usuario FOREIGN KEY (usuario_id) 
    REFERENCES usuarios(usuario_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE maestros 
    ADD CONSTRAINT fk_maestro_usuario FOREIGN KEY (usuario_id) 
    REFERENCES usuarios(usuario_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE grados 
    ADD CONSTRAINT fk_grado_nivel_educativo FOREIGN KEY (nivel_id) 
    REFERENCES niveles_educativos(nivel_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE grados_secciones 
    ADD CONSTRAINT fk_gs_grado FOREIGN KEY (grado_id) 
    REFERENCES grados(grado_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_gs_seccion FOREIGN KEY (seccion_id) 
    REFERENCES secciones(seccion_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE asignacion_grados 
    ADD CONSTRAINT fk_asig_alumno FOREIGN KEY (alumno_id) 
    REFERENCES alumnos(alumno_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_asig_gs FOREIGN KEY (grado_seccion_id) 
    REFERENCES grados_secciones(grado_seccion_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE asignacion_curso_maestro 
    ADD CONSTRAINT fk_acm_maestro FOREIGN KEY (maestro_id) 
    REFERENCES maestros(maestro_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_acm_gs FOREIGN KEY (grado_seccion_id) 
    REFERENCES grados_secciones(grado_seccion_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_acm_curso FOREIGN KEY (curso_id) 
    REFERENCES cursos(curso_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE asistencia 
    ADD CONSTRAINT fk_asist_usuario FOREIGN KEY (usuario_id) 
    REFERENCES usuarios(usuario_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_asist_ag FOREIGN KEY (asignacion_grado_id) 
    REFERENCES asignacion_grados(asignacion_grado_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE actividades_curso 
    ADD CONSTRAINT fk_actcurso_acm FOREIGN KEY (asignacion_curso_maestro_id) 
    REFERENCES asignacion_curso_maestro(asignacion_curso_maestro_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_actividades_bimestre FOREIGN KEY (bimestre_id)
    REFERENCES bimestres(bimestre_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE calificaciones 
    ADD CONSTRAINT fk_calif_ag FOREIGN KEY (asignacion_grado_id) 
    REFERENCES asignacion_grados(asignacion_grado_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_calif_act FOREIGN KEY (actividad_curso_id) 
    REFERENCES actividades_curso(actividad_curso_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE examen_enviados 
    ADD CONSTRAINT fk_examen_acm FOREIGN KEY (asignacion_curso_maestro_id) 
    REFERENCES asignacion_curso_maestro(asignacion_curso_maestro_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_examen_personal FOREIGN KEY (personal_id) 
    REFERENCES personal_administrativos(personal_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_examenes_bimestre FOREIGN KEY (bimestre_id)
    REFERENCES bimestres(bimestre_id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE pagos 
    ADD CONSTRAINT fk_pagos_grado FOREIGN KEY (grado_id) 
    REFERENCES grados(grado_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE cargos_alumnos 
    ADD CONSTRAINT fk_cargos_ag FOREIGN KEY (asignacion_grado_id) 
    REFERENCES asignacion_grados(asignacion_grado_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_cargos_pago FOREIGN KEY (pago_id) 
    REFERENCES pagos(pago_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE pagos_realizados 
    ADD CONSTRAINT fk_pagosreal_personal FOREIGN KEY (personal_id) 
    REFERENCES personal_administrativos(personal_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_pagosreal_cargo FOREIGN KEY (cargo_id) 
    REFERENCES cargos_alumnos(cargo_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE calendario_actividades 
    ADD CONSTRAINT fk_calendario_usuario FOREIGN KEY (usuario_id) 
    REFERENCES usuarios(usuario_id) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    ADD CONSTRAINT fk_calendario_nivel FOREIGN KEY (nivel_id) 
    REFERENCES niveles_educativos(nivel_id) 
    ON UPDATE CASCADE ON DELETE CASCADE;
    
    
ALTER TABLE usuarios ADD estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO';