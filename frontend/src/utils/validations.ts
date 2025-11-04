export function validateTipoAccidente(value: string) {
  if (!value) return 'Por favor seleccione un tipo de accidente.';
  return '';
}

export function validateDni(value: string) {
  if (!value) return 'El DNI es obligatorio.';
  if (!/^\d{8}$/.test(value)) return 'El DNI debe tener 8 dígitos numéricos.';
  return '';
}

export function validateDescripcion(value: string) {
  if (!value) return 'La descripción es obligatoria.';
  if (value.length < 10) return 'La descripción debe tener al menos 10 caracteres.';
  return '';
}

export function validateNombre(value: string) {
  if (!value) return 'El nombre es obligatorio.';
  return '';
}

export function validateApellido(value: string) {
  if (!value) return 'El apellido es obligatorio.';
  return '';
}

export function validateTelefono(value: string) {
  if (!value) return 'El teléfono es obligatorio.';

  // Solo números, empieza con 11 y tiene 10 dígitos en total
  const regex = /^11\d{8}$/;
  if (!regex.test(value))
    return 'El teléfono debe tener 10 dígitos y empezar con 11, solo números.';

  return '';
}

export function validateEmail(value: string) {
  if (!value) return 'El email es obligatorio.';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return 'El email no es válido. Debe contener un @ y un punto.';
  }

  return '';
}

export function validatePassword(value: string) {
  if (!value) return 'La contraseña es obligatoria.';

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!passwordRegex.test(value)) {
    return 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.';
  }

  return '';
}

export function validateFechaNacimiento(value: string) {
  if (!value) return 'La fecha es obligatoria.';

  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(value)) {
    return 'La fecha debe tener el formato YYYY-MM-DD y solo contener números';
  }

  return '';
}

export const registerBody = {
  dni: '',
  nombre: '',
  apellido: '',
  fechaDeNacimiento: '',
  telefono: '',
  email: '',
  password: '',
};

export function validateGrupoSanguineo(value: string) {
  if (!value) return 'El grupo sanguíneo es obligatorio.';
  const tipos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!tipos.includes(value)) return 'Grupo sanguíneo inválido.';
  return '';
}

export function validateAltura(value: string) {
  if (!value) return 'La altura es obligatoria.';

  if (!/^\d+(\.\d+)?$/.test(value)) {
    return 'Formato inválido. Ej: 170 o 170.5';
  }

  const numericValue = parseFloat(value);

  if (numericValue < 50 || numericValue > 250) {
    return 'La altura debe estar entre 50 y 250 cm.';
  }

  return '';
}

export function validatePeso(value: string) {
  if (!value) return 'El peso es obligatorio.';

  if (!/^\d+(\.\d+)?$/.test(value)) {
    return 'Formato inválido. Ej: 70 o 70.5';
  }

  const numericValue = parseFloat(value);

  if (numericValue < 1 || numericValue > 500) {
    return 'El peso debe estar entre 1 y 500 kg.';
  }

  return '';
}

export function validateSexo(value: string) {
  if (!value) return 'El sexo es obligatorio.';
  const opciones = ['MASCULINO', 'FEMENINO', 'OTRO'];
  if (!opciones.includes(value)) return 'Sexo inválido.';
  return '';
}

export function validateTags(values: string[], fieldName: string) {
  if (values.some((tag) => tag.trim() === '')) return 'Las etiquetas no pueden estar vacías.';
  if (values.length > 3) return `Máximo 3 ${fieldName} permitidas.`;
  return '';
}
