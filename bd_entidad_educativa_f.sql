-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2026 a las 15:28:09
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_entidad_educativa_f`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades_curso`
--

CREATE TABLE `bimestres` (
  `bimestre_id` int(10) unsigned NOT NULL,
  `ciclo` year(4) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `orden` tinyint(3) unsigned NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `bimestres` (`bimestre_id`, `ciclo`, `nombre`, `orden`) VALUES
(1, 2026, '1er Bimestre', 1),
(2, 2026, '2do Bimestre', 2),
(3, 2026, '3er Bimestre', 3),
(4, 2026, '4to Bimestre', 4),
(5, 2026, 'Recuperacion', 5);

CREATE TABLE `actividades_curso` (
  `actividad_curso_id` int(11) NOT NULL,
  `asignacion_curso_maestro_id` int(11) NOT NULL,
  `bimestre_id` int(10) unsigned NOT NULL,
  `nom_actividad` varchar(100) NOT NULL,
  `punteo_maximo` decimal(5,2) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `actividades_curso`
--

INSERT INTO `actividades_curso` (`actividad_curso_id`, `asignacion_curso_maestro_id`, `bimestre_id`, `nom_actividad`, `punteo_maximo`, `descripcion`) VALUES
(1, 1, 1, 'Hoja de Trabajo 1', 15.00, 'Ejercicios de álgebra lineal'),
(2, 1, 1, 'Examen Parcial 1', 35.00, 'Evaluación escrita primer parcial'),
(3, 3, 1, 'Laboratorio de Lectura', 20.00, 'Análisis de texto narrativo'),
(4, 3, 2, 'Ensayo Literario', 25.00, 'Redacción de ensayo académico'),
(5, 5, 1, 'Proyecto Algoritmos', 40.00, 'Desarrollo de aplicación web');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `alumno_id` int(11) NOT NULL,
  `carne` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nom_encargado` varchar(100) NOT NULL,
  `tel_personal` varchar(20) DEFAULT NULL,
  `tel_encargado` varchar(20) NOT NULL,
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`alumno_id`, `carne`, `nombre`, `apellido`, `fecha_nacimiento`, `email`, `nom_encargado`, `tel_personal`, `tel_encargado`, `usuario_id`) VALUES
(1, '2026001', 'Ana', 'López', '2010-03-15', 'ana.lopez@estudiante.edu.gt', 'Carlos López', '4111-0001', '5111-0001', 7),
(2, '2026002', 'Luis', 'Martínez', '2010-07-22', 'luis.martinez@estudiante.edu.gt', 'Marta Martínez', '4111-0002', '5111-0002', 8),
(3, '2026003', 'Pedro', 'Gómez', '2011-01-10', 'pedro.gomez@estudiante.edu.gt', 'José Gómez', '4111-0003', '5111-0003', 9),
(4, '2026004', 'Sofía', 'Hernández', '2011-05-18', 'sofia.hernandez@estudiante.edu.gt', 'Claudia Hernández', '4111-0004', '5111-0004', 10),
(5, '2026005', 'Diego', 'Castillo', '2009-11-30', 'diego.castillo@estudiante.edu.gt', 'Roberto Castillo', '4111-0005', '5111-0005', 11),
(6, '2026006', 'Carla', 'Vásquez', '2009-08-14', 'carla.vasquez@estudiante.edu.gt', 'Sonia Vásquez', '4111-0006', '5111-0006', 12),
(7, '2026007', 'Mario', 'Pérez', '2010-04-05', 'mario.perez@estudiante.edu.gt', 'Fernando Pérez', '4111-0007', '5111-0007', 13),
(8, '2026008', 'Elena', 'Ríos', '2011-09-12', 'elena.rios@estudiante.edu.gt', 'Olga Ríos', '4111-0008', '5111-0008', 14),
(9, '2026009', 'Jorge', 'Navarro', '2009-02-28', 'jorge.navarro@estudiante.edu.gt', 'Héctor Navarro', '4111-0009', '5111-0009', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignacion_curso_maestro`
--

CREATE TABLE `asignacion_curso_maestro` (
  `asignacion_curso_maestro_id` int(11) NOT NULL,
  `maestro_id` int(11) NOT NULL,
  `grado_seccion_id` int(11) NOT NULL,
  `curso_id` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asignacion_curso_maestro`
--

INSERT INTO `asignacion_curso_maestro` (`asignacion_curso_maestro_id`, `maestro_id`, `grado_seccion_id`, `curso_id`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 1),
(3, 2, 1, 2),
(4, 2, 3, 3),
(5, 3, 4, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignacion_grados`
--

CREATE TABLE `asignacion_grados` (
  `asignacion_grado_id` int(11) NOT NULL,
  `alumno_id` int(11) NOT NULL,
  `grado_seccion_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asignacion_grados`
--

INSERT INTO `asignacion_grados` (`asignacion_grado_id`, `alumno_id`, `grado_seccion_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 2),
(5, 5, 2),
(6, 6, 3),
(7, 7, 3),
(8, 8, 4),
(9, 9, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `asistencia_id` bigint(20) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `asignacion_grado_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('PRESENTE','TARDE','AUSENTE') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`asistencia_id`, `usuario_id`, `asignacion_grado_id`, `fecha`, `estado`) VALUES
(1, 7, 1, '2026-10-01', 'PRESENTE'),
(2, 8, 2, '2026-10-01', 'PRESENTE'),
(3, 9, 3, '2026-10-01', 'TARDE'),
(4, 10, 4, '2026-10-01', 'PRESENTE'),
(5, 11, 5, '2026-10-01', 'AUSENTE'),
(6, 12, 6, '2026-10-01', 'PRESENTE'),
(7, 13, 7, '2026-10-01', 'PRESENTE'),
(8, 14, 8, '2026-10-01', 'PRESENTE'),
(9, 15, 9, '2026-10-01', 'TARDE'),
(10, 7, 1, '2026-10-02', 'PRESENTE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendario_actividades`
--

CREATE TABLE `calendario_actividades` (
  `actividad_id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_final` datetime NOT NULL,
  `tipo_evento` enum('INSTITUCIONAL','ACADEMICO','EXAMEN','DEPORTIVO','CULTURAL') NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nivel_id` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `calendario_actividades`
--

INSERT INTO `calendario_actividades` (`actividad_id`, `titulo`, `descripcion`, `fecha_inicio`, `fecha_final`, `tipo_evento`, `usuario_id`, `nivel_id`) VALUES
(1, 'Inauguración del Ciclo Escolar 2026', 'Acto cívico y bienvenida a todos los estudiantes', '2026-01-12 08:00:00', '2026-01-12 12:00:00', 'INSTITUCIONAL', 1, 1),
(2, 'Evaluaciones Primer Bimestre', 'Período de evaluaciones escritas y prácticas', '2026-03-16 07:30:00', '2026-03-20 13:00:00', 'ACADEMICO', 2, 1),
(3, 'Feria de Ciencias y Tecnología', 'Exposición de proyectos de física y programación', '2026-07-20 09:00:00', '2026-07-21 15:00:00', 'ACADEMICO', 4, 2),
(4, 'Torneo Deportivo Interescolar', 'Competencias de fútbol, básquetbol y atletismo', '2026-09-10 08:00:00', '2026-09-11 16:00:00', 'DEPORTIVO', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificaciones`
--

CREATE TABLE `calificaciones` (
  `calificacion_id` int(11) NOT NULL,
  `asignacion_grado_id` int(11) NOT NULL,
  `actividad_curso_id` int(11) NOT NULL,
  `punteo_obtenido` decimal(5,2) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `calificaciones`
--

INSERT INTO `calificaciones` (`calificacion_id`, `asignacion_grado_id`, `actividad_curso_id`, `punteo_obtenido`, `fecha_registro`) VALUES
(1, 1, 1, 14.50, '2026-03-10 16:00:00'),
(2, 2, 1, 12.00, '2026-03-10 16:05:00'),
(3, 3, 1, 15.00, '2026-03-10 16:10:00'),
(4, 1, 2, 32.00, '2026-03-25 17:00:00'),
(5, 2, 2, 28.50, '2026-03-25 17:05:00'),
(6, 6, 3, 18.00, '2026-03-12 15:30:00'),
(7, 7, 3, 19.50, '2026-03-12 15:35:00'),
(8, 8, 5, 38.00, '2026-03-28 20:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos_alumnos`
--

CREATE TABLE `cargos_alumnos` (
  `cargo_id` int(11) NOT NULL,
  `asignacion_grado_id` int(11) NOT NULL,
  `pago_id` int(11) NOT NULL,
  `monto_cobrar` decimal(10,2) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado` enum('PENDIENTE','PAGO_PARCIAL','PAGO_TOTAL') DEFAULT 'PENDIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargos_alumnos`
--

INSERT INTO `cargos_alumnos` (`cargo_id`, `asignacion_grado_id`, `pago_id`, `monto_cobrar`, `fecha_vencimiento`, `estado`) VALUES
(1, 1, 1, 850.00, '2026-01-15', 'PAGO_TOTAL'),
(2, 1, 2, 450.00, '2026-02-05', 'PAGO_TOTAL'),
(3, 4, 1, 850.00, '2026-01-15', 'PAGO_TOTAL'),
(4, 4, 2, 450.00, '2026-02-05', 'PENDIENTE'),
(5, 8, 1, 850.00, '2026-01-15', 'PAGO_TOTAL'),
(6, 8, 4, 550.00, '2026-02-05', 'PAGO_PARCIAL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `curso_id` smallint(6) NOT NULL,
  `nom_curso` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`curso_id`, `nom_curso`, `descripcion`) VALUES
(1, 'Matemáticas', 'Curso de matemáticas generales y álgebra'),
(2, 'Idioma Español', 'Gramática, ortografía y literatura'),
(3, 'Ciencias Naturales', 'Biología, física y química básica'),
(4, 'Física Fundamental', 'Física mecánica y movimiento'),
(5, 'Programación I', 'Lógica de programación y desarrollo web');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `examen_enviados`
--

CREATE TABLE `examen_enviados` (
  `examen_id` int(11) NOT NULL,
  `asignacion_curso_maestro_id` int(11) NOT NULL,
  `bimestre_id` int(10) unsigned DEFAULT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensaje` text DEFAULT NULL,
  `archivo_url` varchar(255) NOT NULL,
  `estado` enum('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'PENDIENTE',
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_autorizacion` datetime DEFAULT NULL,
  `personal_id` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `examen_enviados`
--

INSERT INTO `examen_enviados` (`examen_id`, `asignacion_curso_maestro_id`, `bimestre_id`, `titulo`, `mensaje`, `archivo_url`, `estado`, `fecha_envio`, `fecha_autorizacion`, `personal_id`) VALUES
(1, 1, 1, 'Examen Parcial I - Matemáticas', 'Envío examen para revisión y aprobación.', '/uploads/examenes/mat_p1_2026.pdf', 'APROBADO', '2026-03-01 15:00:00', '2026-03-01 14:00:00', 1),
(2, 3, 1, 'Examen Parcial I - Español', 'Examen correspondiente al primer bimestre.', '/uploads/examenes/esp_p1_2026.pdf', 'APROBADO', '2026-03-02 17:30:00', '2026-03-03 08:45:00', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grados`
--

CREATE TABLE `grados` (
  `grado_id` tinyint(4) NOT NULL,
  `nom_grado` varchar(50) NOT NULL,
  `nivel_id` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grados`
--

INSERT INTO `grados` (`grado_id`, `nom_grado`, `nivel_id`) VALUES
(1, 'Sexto Primaria', 1),
(2, 'Primero Básico', 2),
(3, 'Segundo Básico', 2),
(4, 'Tercero Básico', 2),
(5, 'Cuarto Diversificado', 3),
(6, 'Primero Primaria', 1),
(7, 'Segundo Primaria', 1),
(8, 'Tercero Primaria', 1),
(9, 'Cuarto Primaria', 1),
(10, 'Quinto Primaria', 1),
(11, 'Quinto Diversificado', 3),
(12, 'Sexto Diversificado', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grados_secciones`
--

CREATE TABLE `grados_secciones` (
  `grado_seccion_id` int(11) NOT NULL,
  `grado_id` tinyint(4) NOT NULL,
  `seccion_id` smallint(6) NOT NULL,
  `cantidad_estudiantes` tinyint(3) UNSIGNED DEFAULT 0,
  `ciclo` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grados_secciones`
--

INSERT INTO `grados_secciones` (`grado_seccion_id`, `grado_id`, `seccion_id`, `cantidad_estudiantes`, `ciclo`) VALUES
(1, 2, 1, 25, '2026'),
(2, 2, 2, 22, '2026'),
(3, 3, 1, 28, '2026'),
(4, 5, 1, 20, '2026');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `maestros`
--

CREATE TABLE `maestros` (
  `maestro_id` int(11) NOT NULL,
  `carne_maestro` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tel_personal` varchar(20) DEFAULT NULL,
  `tel_casa` varchar(20) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `maestros`
--

INSERT INTO `maestros` (`maestro_id`, `carne_maestro`, `nombre`, `apellido`, `fecha_nacimiento`, `email`, `tel_personal`, `tel_casa`, `usuario_id`) VALUES
(1, 'M202601', 'Carlos', 'Ramírez', '1985-05-12', 'c.ramirez@colegio.edu.gt', '4222-0001', '2222-0001', 4),
(2, 'M202602', 'María', 'Fernández', '1990-09-25', 'm.fernandez@colegio.edu.gt', '4222-0002', '2222-0002', 5),
(3, 'M202603', 'Juan', 'Orellana', '1988-12-03', 'j.orellana@colegio.edu.gt', '4222-0003', '2222-0003', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles_educativos`
--

CREATE TABLE `niveles_educativos` (
  `nivel_id` tinyint(4) NOT NULL,
  `nom_nivel` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `niveles_educativos`
--

INSERT INTO `niveles_educativos` (`nivel_id`, `nom_nivel`) VALUES
(1, 'Primaria'),
(2, 'Básico'),
(3, 'Diversificado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `pago_id` int(11) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `cantidad_pagos` int(11) NOT NULL,
  `monto_base` decimal(10,2) NOT NULL,
  `grado_id` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`pago_id`, `descripcion`, `cantidad_pagos`, `monto_base`, `grado_id`) VALUES
(1, 'Inscripción Anual 2026', 1, 850.00, 2),
(2, 'Colegiatura Mensual Primero Básico', 10, 450.00, 2),
(3, 'Colegiatura Mensual Segundo Básico', 10, 480.00, 3),
(4, 'Colegiatura Mensual Bachillerato', 10, 550.00, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos_realizados`
--

CREATE TABLE `pagos_realizados` (
  `pago_realizado_id` int(11) NOT NULL,
  `personal_id` tinyint(4) NOT NULL,
  `cargo_id` int(11) NOT NULL,
  `monto_pagado` decimal(10,2) NOT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos_realizados`
--

INSERT INTO `pagos_realizados` (`pago_realizado_id`, `personal_id`, `cargo_id`, `monto_pagado`, `fecha_pago`) VALUES
(1, 3, 1, 850.00, '2026-01-10 15:15:00'),
(2, 3, 2, 450.00, '2026-02-03 17:20:00'),
(3, 3, 3, 850.00, '2026-01-12 20:30:00'),
(4, 3, 6, 300.00, '2026-02-04 16:10:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_administrativos`
--

CREATE TABLE `personal_administrativos` (
  `personal_id` tinyint(4) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `cargo` enum('DIRECTOR','SUBDIRECTOR','SECRETARIA','CONTADOR','ADMIN') NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personal_administrativos`
--

INSERT INTO `personal_administrativos` (`personal_id`, `usuario_id`, `nombre`, `apellido`, `cargo`, `email`, `telefono`) VALUES
(1, 1, 'Ramiro', 'González', 'ADMIN', 'r.gonzalez@colegio.edu.gt', '5555-1111'),
(2, 2, 'Esteban', 'Mendoza', 'DIRECTOR', 'e.mendoza@colegio.edu.gt', '5555-2222'),
(3, 3, 'Lucía', 'Morales', 'SECRETARIA', 'l.morales@colegio.edu.gt', '5555-3333');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `rol_id` tinyint(4) NOT NULL,
  `nom_rol` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`rol_id`, `nom_rol`, `descripcion`) VALUES
(1, 'ADMIN', 'Administrador del sistema'),
(2, 'DIRECTOR', 'Director institucional'),
(3, 'SECRETARIA', 'Secretaria academica'),
(4, 'MAESTRO', 'Docente de asignatura'),
(5, 'ALUMNO', 'Estudiante matriculado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE `secciones` (
  `seccion_id` smallint(6) NOT NULL,
  `nom_seccion` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `secciones`
--

INSERT INTO `secciones` (`seccion_id`, `nom_seccion`) VALUES
(1, 'A'),
(2, 'B'),
(3, 'C');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `token_acceso`
--

CREATE TABLE `token_acceso` (
  `token_id` bigint(20) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_expiracion` datetime NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `token_acceso`
--

INSERT INTO `token_acceso` (`token_id`, `usuario_id`, `token`, `fecha_creacion`, `fecha_expiracion`, `activo`) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6ImFkbWluLmdlbmVyYWwiLCJpYXQiOjE3OTM0ODE2MDB9.sample_hash_1', '2026-10-01 14:00:00', '2026-10-02 08:00:00', 1),
(2, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwibmFtZSI6InByb2YuY2FybG9zIiwiaWF0IjoxNzkzNDgxNjAwfQ.sample_hash_2', '2026-10-01 14:15:00', '2026-10-02 08:15:00', 1),
(3, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwibmFtZSI6InByb2YubWFyaWEiLCJpYXQiOjE3OTM0ODE2MDB9.sample_hash_3', '2026-10-01 14:30:00', '2026-10-02 08:30:00', 0),
(4, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3IiwibmFtZSI6ImVzdC5hbmEiLCJpYXQiOjE3OTM0ODE2MDB9.sample_hash_4', '2026-10-01 15:00:00', '2026-10-02 09:00:00', 1),
(5, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwibmFtZSI6ImVzdC5sdWlzIiwiaWF0IjoxNzkzNDgxNjAwfQ.sample_hash_5', '2026-10-01 15:10:00', '2026-10-02 09:10:00', 1),
(6, 1, 'a5cae6e03ed66224dd8c75f94abbc8c4c7a523f9b9ded5da47416cd665febe94', '2026-11-04 21:23:37', '2026-11-11 15:23:37', 0),
(7, 1, '86ce6081ee1c55cd2377505e0ed216d9e9b3a554ad12d76770482cca215fac27', '2026-11-04 21:23:50', '2026-11-11 15:23:50', 0),
(8, 1, 'a97ab209a572ce9b66d2b0dbbd626e3a6292db4e559dde7814b98cc267bf81ca', '2026-11-04 21:25:55', '2026-11-11 15:25:55', 0),
(9, 1, '94b54af46a16c2fd4fa5f84c5c7222a5f2ba12179a8f2a91beb7c3905d8b0e97', '2026-11-04 21:44:29', '2026-11-11 15:44:29', 0),
(10, 1, 'd1e0e572f939cf3d976cfa90f6463101c81e5b5b6c95018a8695f37ec97289d9', '2026-11-04 21:45:18', '2026-11-11 15:45:18', 1),
(11, 1, '25ad35d65cfa35665b9e7eb432943015630a2455ae4d347ba2c2576898ea71e2', '2026-11-04 21:45:51', '2026-11-11 15:45:51', 0),
(12, 1, '05887b879b934f82edc0bfe068da82c5e4cf731de9181c2472fd0f3c1ceefb9c', '2026-11-04 21:47:47', '2026-11-11 15:47:47', 0),
(13, 1, 'd29d207203df5b7705b1c43c86c8d67912795c8a76bd4ab471ad78da2d5a368e', '2026-11-04 21:47:56', '2026-11-11 15:47:56', 0),
(14, 1, 'b3d4e829fd5cb3b10e3f2c2902e88bf2299ba55cffffbae9e13268bf7f4fbe5c', '2026-11-04 21:51:06', '2026-11-11 15:51:06', 0),
(15, 1, '5c23d2877165d4743f9d475ff5ab8e1cc172141876676d12a97919b2d59869a2', '2026-11-04 21:52:22', '2026-11-11 15:52:22', 1),
(16, 1, 'c7d80219ea2ba1a613bcb95de724a06b4360121a81286c1f3993d6a3d0a5d641', '2026-11-04 21:52:46', '2026-11-11 15:52:46', 1),
(17, 1, 'b946687d4ae0b16aca2fd499e6756c20c2796919a1908b0a4818de4b347a5aaf', '2026-11-04 21:52:55', '2026-11-11 15:52:55', 1),
(18, 1, '096740d13b563db2a981d005b9a1ead979fd70d5baa7f60576f5dc8bf2d272d4', '2026-11-04 21:53:33', '2026-11-11 15:53:33', 0),
(19, 1, '603d6b9ea23ac6a877590e1414dab833225b2e27b3d4f8290f6deba6e1ee8864', '2026-11-04 22:58:15', '2026-11-11 16:58:15', 0),
(20, 1, '720c7a425089f2539720841f30c047ede39c9052f7d0870410a1c6c6cc2fc587', '2026-11-04 22:59:00', '2026-11-11 16:59:00', 1),
(21, 1, '346fca505214660551a6be7dfaa1ed7fa3d8aaa5db3fb218a1831ff835c7455b', '2026-11-04 23:02:40', '2026-11-11 17:02:40', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario_id` int(11) NOT NULL,
  `nom_usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` tinyint(4) NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `nom_usuario`, `password`, `rol_id`, `estado`) VALUES
(1, 'admin.general', '$2y$10$DUiff1F9b43Wvt8ebeL6euta3YM8PkQiz/PdG2pbyZyi3TS/3os1.', 1, 'ACTIVO'),
(2, 'director.mendoza', '$2y$10$a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5', 2, 'ACTIVO'),
(3, 'sec.lucia', '$2y$10$z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5', 3, 'ACTIVO'),
(4, 'prof.carlos', '$2y$10$p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5', 4, 'ACTIVO'),
(5, 'prof.maria', '$2y$10$m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5', 4, 'ACTIVO'),
(6, 'prof.juan', '$2y$10$k5j4i3h2g1f0e9d8c7b6a5z4y3x2w1v0u9t8s7r6q5p4o3n2m1', 4, 'ACTIVO'),
(7, 'est.ana', '$2y$10$1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y', 5, 'ACTIVO'),
(8, 'est.luis', '$2y$10$5y4x3w2v1u0t9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a', 5, 'ACTIVO'),
(9, 'est.pedro', '$2y$10$q0w9e8r7t6y5u4i3o2p1a0s9d8f7g6h5j4k3l2z1x2c3v4b5n6', 5, 'ACTIVO'),
(10, 'est.sofia', '$2y$10$m9n8b7v6c5x4z3l2k1j0h9g8f7d6s5a4p3o2i1u0y9t8r7e6w5', 5, 'ACTIVO'),
(11, 'est.diego', '$2y$10$x1z2c3v4b5n6m7a8s9d0f1g2h3j4k5l6p7o8i9u0y1t2r3e4w5', 5, 'ACTIVO'),
(12, 'est.carla', '$2y$10$p9o8i7u6y5t4r3e2w1q0a1s2d3f4g5h6j7k8l9z0x1c2v3b4n5', 5, 'ACTIVO'),
(13, 'est.mario', '$2y$10$1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0z1x2c3v4b5n', 5, 'ACTIVO'),
(14, 'est.elena', '$2y$10$l9k8j7h6g5f4d3s2a1p0o9i8u7y6t5r4e3w2q1m2n3b4v5c6x7', 5, 'ACTIVO'),
(15, 'est.jorge', '$2y$10$z1x2c3v4b5n6m7l8k9j0h1g2f3d4s5a6p7o8i9u0y1t2r3e4w5', 5, 'ACTIVO');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bimestres`
--
ALTER TABLE `bimestres`
  ADD PRIMARY KEY (`bimestre_id`),
  ADD UNIQUE KEY `uq_bimestres_ciclo_nombre` (`ciclo`, `nombre`);

--
-- Indices de la tabla `actividades_curso`
--
ALTER TABLE `actividades_curso`
  ADD PRIMARY KEY (`actividad_curso_id`),
  ADD KEY `fk_actcurso_acm` (`asignacion_curso_maestro_id`),
  ADD KEY `fk_actividades_bimestre` (`bimestre_id`);

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`alumno_id`),
  ADD UNIQUE KEY `carne` (`carne`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `asignacion_curso_maestro`
--
ALTER TABLE `asignacion_curso_maestro`
  ADD PRIMARY KEY (`asignacion_curso_maestro_id`),
  ADD KEY `fk_acm_maestro` (`maestro_id`),
  ADD KEY `fk_acm_gs` (`grado_seccion_id`),
  ADD KEY `fk_acm_curso` (`curso_id`);

--
-- Indices de la tabla `asignacion_grados`
--
ALTER TABLE `asignacion_grados`
  ADD PRIMARY KEY (`asignacion_grado_id`),
  ADD KEY `fk_asig_alumno` (`alumno_id`),
  ADD KEY `fk_asig_gs` (`grado_seccion_id`);

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`asistencia_id`),
  ADD KEY `fk_asist_usuario` (`usuario_id`),
  ADD KEY `fk_asist_ag` (`asignacion_grado_id`);

--
-- Indices de la tabla `calendario_actividades`
--
ALTER TABLE `calendario_actividades`
  ADD PRIMARY KEY (`actividad_id`),
  ADD KEY `fk_calendario_usuario` (`usuario_id`),
  ADD KEY `fk_calendario_nivel` (`nivel_id`);

--
-- Indices de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD PRIMARY KEY (`calificacion_id`),
  ADD KEY `fk_calif_ag` (`asignacion_grado_id`),
  ADD KEY `fk_calif_act` (`actividad_curso_id`);

--
-- Indices de la tabla `cargos_alumnos`
--
ALTER TABLE `cargos_alumnos`
  ADD PRIMARY KEY (`cargo_id`),
  ADD KEY `fk_cargos_ag` (`asignacion_grado_id`),
  ADD KEY `fk_cargos_pago` (`pago_id`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`curso_id`);

--
-- Indices de la tabla `examen_enviados`
--
ALTER TABLE `examen_enviados`
  ADD PRIMARY KEY (`examen_id`),
  ADD KEY `fk_examen_acm` (`asignacion_curso_maestro_id`),
  ADD KEY `fk_examen_personal` (`personal_id`),
  ADD KEY `fk_examenes_bimestre` (`bimestre_id`);

--
-- Indices de la tabla `grados`
--
ALTER TABLE `grados`
  ADD PRIMARY KEY (`grado_id`),
  ADD KEY `fk_grado_nivel_educativo` (`nivel_id`);

--
-- Indices de la tabla `grados_secciones`
--
ALTER TABLE `grados_secciones`
  ADD PRIMARY KEY (`grado_seccion_id`),
  ADD UNIQUE KEY `uq_grados_secciones_ciclo_grado_seccion` (`grado_id`,`seccion_id`,`ciclo`),
  ADD KEY `fk_gs_grado` (`grado_id`),
  ADD KEY `fk_gs_seccion` (`seccion_id`);

--
-- Indices de la tabla `maestros`
--
ALTER TABLE `maestros`
  ADD PRIMARY KEY (`maestro_id`),
  ADD UNIQUE KEY `carne_maestro` (`carne_maestro`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `niveles_educativos`
--
ALTER TABLE `niveles_educativos`
  ADD PRIMARY KEY (`nivel_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`pago_id`),
  ADD KEY `fk_pagos_grado` (`grado_id`);

--
-- Indices de la tabla `pagos_realizados`
--
ALTER TABLE `pagos_realizados`
  ADD PRIMARY KEY (`pago_realizado_id`),
  ADD KEY `fk_pagosreal_personal` (`personal_id`),
  ADD KEY `fk_pagosreal_cargo` (`cargo_id`);

--
-- Indices de la tabla `personal_administrativos`
--
ALTER TABLE `personal_administrativos`
  ADD PRIMARY KEY (`personal_id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`rol_id`);

--
-- Indices de la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD PRIMARY KEY (`seccion_id`);

--
-- Indices de la tabla `token_acceso`
--
ALTER TABLE `token_acceso`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `fk_token_usuario` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario_id`),
  ADD KEY `fk_usuario_rol` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bimestres`
--
ALTER TABLE `bimestres`
  MODIFY `bimestre_id` int(10) unsigned NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `actividades_curso`
--
ALTER TABLE `actividades_curso`
  MODIFY `actividad_curso_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `alumno_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `asignacion_curso_maestro`
--
ALTER TABLE `asignacion_curso_maestro`
  MODIFY `asignacion_curso_maestro_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `asignacion_grados`
--
ALTER TABLE `asignacion_grados`
  MODIFY `asignacion_grado_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `asistencia_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `calendario_actividades`
--
ALTER TABLE `calendario_actividades`
  MODIFY `actividad_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `calificacion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `cargos_alumnos`
--
ALTER TABLE `cargos_alumnos`
  MODIFY `cargo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `curso_id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `examen_enviados`
--
ALTER TABLE `examen_enviados`
  MODIFY `examen_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `grados`
--
ALTER TABLE `grados`
  MODIFY `grado_id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `grados_secciones`
--
ALTER TABLE `grados_secciones`
  MODIFY `grado_seccion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `maestros`
--
ALTER TABLE `maestros`
  MODIFY `maestro_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `niveles_educativos`
--
ALTER TABLE `niveles_educativos`
  MODIFY `nivel_id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `pago_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pagos_realizados`
--
ALTER TABLE `pagos_realizados`
  MODIFY `pago_realizado_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `personal_administrativos`
--
ALTER TABLE `personal_administrativos`
  MODIFY `personal_id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `rol_id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `seccion_id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `token_acceso`
--
ALTER TABLE `token_acceso`
  MODIFY `token_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades_curso`
--
ALTER TABLE `actividades_curso`
  ADD CONSTRAINT `fk_actcurso_acm` FOREIGN KEY (`asignacion_curso_maestro_id`) REFERENCES `asignacion_curso_maestro` (`asignacion_curso_maestro_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_actividades_bimestre` FOREIGN KEY (`bimestre_id`) REFERENCES `bimestres` (`bimestre_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `fk_alumno_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `asignacion_curso_maestro`
--
ALTER TABLE `asignacion_curso_maestro`
  ADD CONSTRAINT `fk_acm_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`curso_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_acm_gs` FOREIGN KEY (`grado_seccion_id`) REFERENCES `grados_secciones` (`grado_seccion_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_acm_maestro` FOREIGN KEY (`maestro_id`) REFERENCES `maestros` (`maestro_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `asignacion_grados`
--
ALTER TABLE `asignacion_grados`
  ADD CONSTRAINT `fk_asig_alumno` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`alumno_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_asig_gs` FOREIGN KEY (`grado_seccion_id`) REFERENCES `grados_secciones` (`grado_seccion_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `fk_asist_ag` FOREIGN KEY (`asignacion_grado_id`) REFERENCES `asignacion_grados` (`asignacion_grado_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_asist_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `calendario_actividades`
--
ALTER TABLE `calendario_actividades`
  ADD CONSTRAINT `fk_calendario_nivel` FOREIGN KEY (`nivel_id`) REFERENCES `niveles_educativos` (`nivel_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calendario_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD CONSTRAINT `fk_calif_act` FOREIGN KEY (`actividad_curso_id`) REFERENCES `actividades_curso` (`actividad_curso_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calif_ag` FOREIGN KEY (`asignacion_grado_id`) REFERENCES `asignacion_grados` (`asignacion_grado_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `cargos_alumnos`
--
ALTER TABLE `cargos_alumnos`
  ADD CONSTRAINT `fk_cargos_ag` FOREIGN KEY (`asignacion_grado_id`) REFERENCES `asignacion_grados` (`asignacion_grado_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cargos_pago` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`pago_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `examen_enviados`
--
ALTER TABLE `examen_enviados`
  ADD CONSTRAINT `fk_examen_acm` FOREIGN KEY (`asignacion_curso_maestro_id`) REFERENCES `asignacion_curso_maestro` (`asignacion_curso_maestro_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_examen_personal` FOREIGN KEY (`personal_id`) REFERENCES `personal_administrativos` (`personal_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_examenes_bimestre` FOREIGN KEY (`bimestre_id`) REFERENCES `bimestres` (`bimestre_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `grados`
--
ALTER TABLE `grados`
  ADD CONSTRAINT `fk_grado_nivel_educativo` FOREIGN KEY (`nivel_id`) REFERENCES `niveles_educativos` (`nivel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `grados_secciones`
--
ALTER TABLE `grados_secciones`
  ADD CONSTRAINT `fk_gs_grado` FOREIGN KEY (`grado_id`) REFERENCES `grados` (`grado_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_gs_seccion` FOREIGN KEY (`seccion_id`) REFERENCES `secciones` (`seccion_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `maestros`
--
ALTER TABLE `maestros`
  ADD CONSTRAINT `fk_maestro_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pagos_grado` FOREIGN KEY (`grado_id`) REFERENCES `grados` (`grado_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pagos_realizados`
--
ALTER TABLE `pagos_realizados`
  ADD CONSTRAINT `fk_pagosreal_cargo` FOREIGN KEY (`cargo_id`) REFERENCES `cargos_alumnos` (`cargo_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pagosreal_personal` FOREIGN KEY (`personal_id`) REFERENCES `personal_administrativos` (`personal_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `personal_administrativos`
--
ALTER TABLE `personal_administrativos`
  ADD CONSTRAINT `fk_personal_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `token_acceso`
--
ALTER TABLE `token_acceso`
  ADD CONSTRAINT `fk_token_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
