import { Picker, type PickerProps } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';

type SelectFieldProps = {
  labelIcon?: React.ReactNode;
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  // ✅ Se añade la propiedad 'mode'
  mode?: 'dialog' | 'dropdown';
  inputProps?: Omit<PickerProps, 'selectedValue' | 'onValueChange'>;
};

export default function SelectField({
  label,
  labelIcon,
  options,
  value,
  onChange,
  error,
  mode = 'dropdown', // Valor por defecto
  inputProps,
}: SelectFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {labelIcon && labelIcon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.pickerWrapper, error && styles.inputError]}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          // ✅ Se aplica el modo aquí
          mode={mode}
          style={styles.input}
          {...inputProps}
        >
          <Picker.Item label={`Seleccione ${label.toLowerCase()}...`} value="" enabled={false} />
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : <View style={{ minHeight: 18 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  label: { fontWeight: '500', fontSize: 16, color: '#2C3E50' },
  pickerWrapper: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    backgroundColor: '#FAFBFC',
    overflow: 'hidden',
  },
  input: { backgroundColor: 'transparent', borderWidth: 0 },
  inputError: { borderColor: '#E74C3C' },
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
    minHeight: 18,
  },
});
