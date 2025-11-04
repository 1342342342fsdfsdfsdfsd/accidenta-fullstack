// src/screens/DatosDeSaludScreen.tsx

import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStack';
import GoBackButton from 'src/componentes/GoBackButton';
import { getHealthData, addHealthData, updateHealthData } from 'src/services/userService';
import { HealthDataDTO } from 'src/types/types';
import { EditHealthDataModal } from 'src/componentes/EditHealthDataModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GenericModal } from 'src/componentes/GenericModal';
import {
  validateGrupoSanguineo,
  validateAltura,
  validatePeso,
  validateSexo,
  validateTags,
} from 'src/utils/validations';

const camposAMostrar: (keyof Omit<HealthDataDTO, 'id'>)[] = [
  'grupoSanguineo',
  'altura',
  'peso',
  'sexo',
  'patologias',
  'medicacion',
  'alergias',
];

const fieldLabels: Record<string, string> = {
  grupoSanguineo: 'Grupo Sanguíneo',
  altura: 'Altura (cm)',
  peso: 'Peso (kg)',
  sexo: 'Sexo',
  patologias: 'Patologías',
  medicacion: 'Medicación',
  alergias: 'Alergias',
};

const initialHealthDataObject: HealthDataDTO = {
  id: '',
  grupoSanguineo: '',
  altura: '',
  peso: '',
  sexo: '',
  patologias: [],
  medicacion: [],
  alergias: [],
};
type DatosDeSaludNavigationProp = StackNavigationProp<RootStackParamList, 'DatosDeSalud'>;

export default function DatosDeSaludScreen() {
  const navigation = useNavigation<DatosDeSaludNavigationProp>();
  const [persistedData, setPersistedData] = useState<HealthDataDTO | null>(null);
  const [displayData, setDisplayData] = useState<HealthDataDTO>(initialHealthDataObject);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para el estado de envío
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<keyof HealthDataDTO | null>(null);
  const [statusModal, setStatusModal] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ visible: false, type: 'success', title: '' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const validateFullForm = (data: HealthDataDTO): boolean => {
    return (
      !validateGrupoSanguineo(data.grupoSanguineo) &&
      !validateAltura(data.altura) &&
      !validatePeso(data.peso) &&
      !validateSexo(data.sexo)
    );
  };

  const getValidationFunction = (field: keyof HealthDataDTO) => {
    switch (field) {
      case 'grupoSanguineo':
        return validateGrupoSanguineo;
      case 'altura':
        return validateAltura;
      case 'peso':
        return validatePeso;
      case 'sexo':
        return validateSexo;
      case 'patologias':
      case 'medicacion':
      case 'alergias':
        return (v: any) => validateTags(v, field);
      default:
        return () => '';
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchHealthData = async () => {
        setLoading(true);
        setDisplayData(initialHealthDataObject);
        setPersistedData(null);
        try {
          const data = await getHealthData();
          if (data) {
            setPersistedData(data);
            setDisplayData(data);
          }
        } catch (error) {
          console.error('Error fetching health data, assuming new user:', error);
          setPersistedData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchHealthData();
    }, []),
  );

  const openModal = (field: keyof HealthDataDTO) => {
    setEditingField(field);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingField(null);
  };

  const handleFieldSave = async (field: keyof HealthDataDTO, value: any) => {
    closeModal();

    const updatedLocalData = { ...displayData, [field]: value };
    setDisplayData(updatedLocalData);

    setIsSubmitting(true);

    try {
      let response;
      response = await updateHealthData({ [field]: value });

      if (response?.data) {
        setPersistedData(response.data);
        setDisplayData(response.data);
        setStatusModal({
          visible: true,
          type: 'success',
          title: '¡Guardado correctamente!',
          message: 'Los datos de salud se actualizaron.',
        });
      }
    } catch (error: any) {
      console.error('Error al guardar campo:', error);
      // ... (el resto de tu manejo de errores está bien)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#34c25d" />
      </View>
    );
  }

  const getDisplayValue = (valor: any) => {
    if (Array.isArray(valor)) return valor.length > 0 ? valor.join(', ') : 'No especificado';
    return valor ? String(valor) : 'No especificado';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <GoBackButton handleGoBack={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Tus Datos de Salud</Text>
        <Text style={styles.subtitle}>
          Presiona un campo para añadir o modificar tu información.
        </Text>

        {camposAMostrar.map((campo) => (
          <Pressable key={campo} onPress={() => openModal(campo)} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardLabel}>{fieldLabels[campo]}</Text>
                <Text style={styles.cardValue}>{getDisplayValue(displayData[campo])}</Text>
              </View>
              <Feather name="edit-2" size={20} color="#34c25d" />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <EditHealthDataModal
        visible={isModalVisible}
        onClose={closeModal}
        onSave={handleFieldSave}
        editingField={editingField}
        currentData={displayData}
        isSubmitting={isSubmitting}
        validationFn={editingField ? getValidationFunction(editingField) : () => ''}
      />
      <GenericModal
        visible={statusModal.visible}
        onClose={() => setStatusModal({ ...statusModal, visible: false })}
        icon_name={statusModal.type === 'success' ? 'check-circle' : 'cancel'}
        title={statusModal.title}
        message={statusModal.message}
        buttonType="create"
        buttonText="Cerrar"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#2C3E50', marginTop: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 24 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#00000080',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 10,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontWeight: '600', fontSize: 14, color: '#555', marginBottom: 4 },
  cardValue: { fontSize: 16, color: '#222', flex: 1, marginRight: 8 },
});
