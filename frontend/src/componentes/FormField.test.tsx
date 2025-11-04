import { render, fireEvent } from '@testing-library/react-native';
import { Ionicons } from '@expo/vector-icons';
import FormField from './FormField';

describe('FormField component', () => {
  it('renderiza el label', () => {
    const { getByText } = render(
      <FormField
        label="DNI *"
        labelIcon={<Ionicons name="id-card" size={20} color="black" testID="icon" />}
        value=""
        onChangeText={() => {}}
      />,
    );

    expect(getByText('DNI *')).toBeTruthy();
  });

  it('renderiza el valor inicial en el input', () => {
    const { getByDisplayValue } = render(
      <FormField label="Nombre" value="Juan" onChangeText={() => {}} />,
    );

    expect(getByDisplayValue('Juan')).toBeTruthy();
  });

  it('llama a onChangeText cuando se escribe en el input', () => {
    const mockFn = jest.fn();
    const { getByPlaceholderText } = render(
      <FormField label="Nombre" value="" placeholder="Escribe tu nombre" onChangeText={mockFn} />,
    );

    const input = getByPlaceholderText('Escribe tu nombre');
    fireEvent.changeText(input, 'Carlos');

    expect(mockFn).toHaveBeenCalledWith('Carlos');
  });

  it('muestra mensaje de error cuando se pasa error', () => {
    const { getByText } = render(
      <FormField label="Nombre" value="" onChangeText={() => {}} error="Campo requerido" />,
    );

    expect(getByText('Campo requerido')).toBeTruthy();
  });

  it('usa multiline cuando big=true', () => {
    const { getByPlaceholderText } = render(
      <FormField
        label="Descripcion"
        value=""
        placeholder="Escribe algo"
        big
        onChangeText={() => {}}
      />,
    );

    const input = getByPlaceholderText('Escribe algo');
    expect(input.props.multiline).toBe(true);
  });

  it('pasa correctamente inputProps al TextInput', () => {
    const { getByPlaceholderText } = render(
      <FormField
        label="Nombre"
        value=""
        placeholder="Escribe tu nombre"
        inputProps={{ keyboardType: 'numeric' }}
        onChangeText={() => {}}
      />,
    );

    const input = getByPlaceholderText('Escribe tu nombre');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('mantiene el valor al focus y blur sin errores', () => {
    const { getByPlaceholderText } = render(
      <FormField label="Nombre" value="Juan" placeholder="Nombre" onChangeText={() => {}} />,
    );

    const input = getByPlaceholderText('Nombre');
    fireEvent(input, 'focus');
    expect(input.props.value).toBe('Juan');

    fireEvent(input, 'blur');
    expect(input.props.value).toBe('Juan');
  });
});
