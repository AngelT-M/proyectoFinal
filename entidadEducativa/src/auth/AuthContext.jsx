import { useEffect, useMemo, useState } from 'react';
import { authApi, delToken, guarToken, obToken } from '../services/api';
import AuthContext from './authContextValue';

function normalizarUsuario(data) {
  if (!data) return null;
  const raw = data?.usuario ?? data?.user ?? data;
  const rolId = Number(raw.rol_id ?? raw.id_rol ?? 0);
  const rolNombres = {
    1: 'ADMINISTRADOR',
    2: 'DIRECTOR',
    3: 'SECRETARIA',
    4: 'MAESTRO',
    5: 'ALUMNO'
  };

  return {
    ...raw,
    id: raw.id_usuario ?? raw.usuario_id ?? raw.id,
    id_usuario: raw.id_usuario ?? raw.usuario_id ?? raw.id,
    usuario_id: raw.id_usuario ?? raw.usuario_id ?? raw.id,
    nom_usuario: raw.nom_usuario ?? raw.usuario ?? '',
    usuario: raw.nom_usuario ?? raw.usuario ?? '',
    rol_id: rolId,
    rol_nombre: raw.rol_nombre ?? rolNombres[rolId] ?? 'USUARIO',
    perfil: raw.perfil ?? null
  };
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorAuth, setErrorAuth] = useState('');

  useEffect(() => {
    let activo = true;

    async function restaurarSesion() {
      if (!obToken()) {
        setCargando(false);
        return;
      }

      try {
        const respuesta = await authApi.me();
        if (activo) setUsuario(normalizarUsuario(respuesta));
      } catch (error) {
        if (error.status === 401 || error.status === 403) delToken();
        if (activo) {
          setUsuario(null);
          setErrorAuth(`No se pudo restaurar la sesión: ${error.message}`);
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    restaurarSesion();
    return () => {
      activo = false;
    };
  }, []);

  async function iniciarSesion(credenciales) {
    const respuesta = await authApi.login(credenciales);
    const token = respuesta?.token ?? respuesta?.access_token;

    if (!token) {
      throw new Error('La respuesta del servidor no incluye un token de acceso.');
    }

    guarToken(token);

    try {
      const meRes = await authApi.me();
      setUsuario(normalizarUsuario(meRes));
    } catch {
      setUsuario(normalizarUsuario(respuesta?.usuario ?? respuesta));
    }
    setErrorAuth('');
  }

  async function cerrarSesion() {
    try {
      await authApi.logout();
    } catch (error) {
      setErrorAuth(`La sesión se cerró en este dispositivo, pero el servidor informó: ${error.message}`);
    } finally {
      delToken();
      setUsuario(null);
    }
  }

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      errorAuth,
      iniciarSesion,
      cerrarSesion,
      limpiarErrorAuth: () => setErrorAuth(''),
    }),
    [usuario, cargando, errorAuth],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

