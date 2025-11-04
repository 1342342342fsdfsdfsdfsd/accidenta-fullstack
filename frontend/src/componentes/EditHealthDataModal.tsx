import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { HealthDataDTO } from 'src/types/types';
import AdvancedTagSelector from './AdvancedTagSelector';
import { FormButton } from './FormButton';
import FormField from './FormField';
import SelectField from './SelectField';

type EditHealthDataModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (field: keyof HealthDataDTO, value: any) => Promise<void>;
  editingField: keyof HealthDataDTO | null;
  currentData: HealthDataDTO | null;
  defaultValues?: Partial<HealthDataDTO>;
  isSubmitting: boolean;
  validationFn: (value: any) => string;
};

// --- Constantes (sin cambios) ---
const fieldLabels: Record<string, string> = {
  grupoSanguineo: 'Grupo Sanguíneo',
  altura: 'Altura (cm)',
  peso: 'Peso (kg)',
  sexo: 'Sexo',
  patologias: 'patologías',
  medicacion: 'medicaciones',
  alergias: 'alergias',
};
const sexoOptions = [
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Femenino', value: 'FEMENINO' },
  { label: 'Otro', value: 'OTRO' },
];
const grupoSanguineoOptions = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
];
const suggestedPatologias = [
  'Diabetes',
  'Hipertensión',
  'Asma',
  'Migraña',
  'Artritis',
  'Enfermedad cardíaca',
];
const suggestedMedicacion = [
  'Aspirina',
  'Paracetamol',
  'Ibuprofeno',
  'Omeprazol',
  'Amoxicilina',
  'Insulina',
];
const suggestedAlergias = ['Polen', 'Ácaros', 'Penicilina', 'Mariscos', 'Lácteos', 'Gluten'];

export function EditHealthDataModal({
  visible,
  onClose,
  onSave,
  editingField,
  currentData,
  isSubmitting,
  validationFn,
}: EditHealthDataModalProps) {
  const [value, setValue] = useState<string | string[] | undefined>(undefined);
  const [error, setError] = useState('');
  useEffect(() => {
    if (visible && editingField && currentData) {
      const data = currentData[editingField];
      const isTagField = ['patologias', 'medicacion', 'alergias'].includes(editingField);
      let initialValue = isTagField ? (Array.isArray(data) ? data : []) : (data ?? '');

      if (editingField === 'grupoSanguineo' && !initialValue) {
        initialValue = grupoSanguineoOptions[0].value;
      }
      if (editingField === 'sexo' && !initialValue) {
        initialValue = sexoOptions[0].value;
      }
      setValue(initialValue);
      setError('');
    }
  }, [visible, editingField, currentData]);

  const handleSave = () => {
    if (!editingField || value === undefined) return;

    const errorMessage = validationFn(value);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    onSave(editingField, value);
  };
  const handleValueChange = (newValue: string | string[]) => {
    setValue(newValue);
    if (error) setError('');
  };

  if (!editingField) return null;

  const renderField = () => {
    if (!editingField) return null;

    const isTagField = ['patologias', 'medicacion', 'alergias'].includes(editingField);

    if (isTagField) {
      let suggestedTags: string[] = [];
      switch (editingField) {
        case 'patologias':
          suggestedTags = suggestedPatologias;
          break;
        case 'medicacion':
          suggestedTags = suggestedMedicacion;
          break;
        case 'alergias':
          suggestedTags = suggestedAlergias;
          break;
      }
      return (
        <AdvancedTagSelector
          label={fieldLabels[editingField]}
          selectedTags={Array.isArray(value) ? value : []}
          suggestedTags={suggestedTags}
          onTagsChange={handleValueChange}
          error={error}
        />
      );
    }

    if (editingField === 'sexo' || editingField === 'grupoSanguineo') {
      return (
        <SelectField
          label={fieldLabels[editingField]}
          options={editingField === 'sexo' ? sexoOptions : grupoSanguineoOptions}
          value={typeof value === 'string' ? value : ''}
          onChange={handleValueChange}
          mode="dialog"
          error={error}
        />
      );
    }

    return (
      <FormField
        label={fieldLabels[editingField]}
        value={typeof value === 'string' ? value : ''}
        onChangeText={handleValueChange}
        inputProps={{
          keyboardType:
            editingField === 'altura' || editingField === 'peso' ? 'numeric' : 'default',
        }}
        error={error}
      />
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <Text style={styles.title}>Editar {fieldLabels[editingField]}</Text>
          {renderField()}
          <View style={styles.buttonContainer}>
            <FormButton text="Guardar Cambios" onSubmit={handleSave} loading={isSubmitting} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2C3E50',
  },
  buttonContainer: { marginTop: 16 },
});
