// Credenciales hardcodeadas
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Guardar sesión
export const login = (username, password) => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('adminAuthenticated', 'true');
    return true;
  }
  return false;
};

// Verificar si está autenticado
export const isAuthenticated = () => {
  return localStorage.getItem('adminAuthenticated') === 'true';
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('adminAuthenticated');
};