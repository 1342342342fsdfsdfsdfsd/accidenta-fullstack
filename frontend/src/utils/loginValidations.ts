export function validateLoginPassword(value: string) {
  if (!value) return 'La contraseña es obligatoria.';
  return ''; // no hacemos validaciones de fuerza en el login
}
