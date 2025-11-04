import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfirmationReporteModal from 'src/componentes/ConfirmationReporteModal';
import { FormButton } from 'src/componentes/FormButton';
import FormField from 'src/componentes/FormField';
import SelectField from 'src/componentes/SelectField';
import { createAccidentReport } from 'src/services/reportesService';
import { CreateAccidentReportDTO } from 'src/types/types';
import { obtenerUbicacion } from 'src/utils/reusableFunctions';
import GoBackButton from '../componentes/GoBackButton';
import { validateDescripcion, validateDni, validateTipoAccidente } from '../utils/validations';
import { ImageInput } from 'src/componentes/ImageInput';

const ACCIDENTE_OPTIONS = [
  { label: 'Accidente de transito', value: 'transito' },
  { label: 'Accidente doméstico', value: 'domestico' },
  { label: 'Accidente laboral', value: 'laboral' },
  { label: 'Accidente natural', value: 'naturales' },
  { label: 'Accidente deportivo', value: 'deportivos' },
  { label: 'Accidente por agresión o violencia', value: 'violencia' },
  { label: 'Accidente de transporte no vehicular', value: 'transporte' },
  { label: 'Accidente por fallas técnicas o de equipo', value: 'fallas_tecnicas' },
];

export default function ReportesFormScreen() {
  const navigation = useNavigation();

  const [tipoAccidente, setTipoAccidente] = useState(ACCIDENTE_OPTIONS[0].value);
  const [dni, setDni] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoAccidenteError, setTipoAccidenteError] = useState('');
  const [dniError, setDniError] = useState('');
  const [ubicacionError, setUbicacionError] = useState('');
  const [descripcionError, setDescripcionError] = useState('');
  const [serverError, setServerError] = useState('');
  const [imagesUri, setImagesUri] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit() {
    setLoading(true);

    // Validaciones básicas
    const tipoAccidenteErrorMsg = validateTipoAccidente(tipoAccidente);
    const dniErrorMsg = validateDni(dni);
    const descripcionErrorMsg = validateDescripcion(descripcion);

    setTipoAccidenteError(tipoAccidenteErrorMsg);
    setDniError(dniErrorMsg);
    setDescripcionError(descripcionErrorMsg);

    if (tipoAccidenteErrorMsg || dniErrorMsg || descripcionErrorMsg || imagesUri.length > 3) {
      setLoading(false);
      return;
    }

    // ✅ Intentar obtener ubicación al enviar
    let direccionUbicacion = null;
    try {
      direccionUbicacion = await obtenerUbicacion({ setUbicacionError });
      if (!direccionUbicacion) {
        throw new Error(ubicacionError);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Permiso de ubicación no otorgado') {
          Alert.alert(
            'Permiso necesario',
            'Necesitamos tu ubicación para enviar el reporte. Podés activarlo desde la configuración.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Abrir configuración', onPress: () => Linking.openSettings() },
            ],
          );
        }
        if (error.message === 'No se habilito el acceso a la ubicacion') {
          Alert.alert('Error', 'No se pudo obtener la ubicación.', [
            { text: 'Aceptar', style: 'default' },
          ]);
        }
      }
      setLoading(false);
      return;
    }
    const formData = new FormData();

    formData.append('tipoAccidente', tipoAccidente);
    formData.append('dni', dni);
    formData.append('descripcion', descripcion);
    formData.append('ubicacion', direccionUbicacion);
    imagesUri.forEach((uri) => {
      const id = Math.random().toString(36).substring(2, 15); // Generar un ID único simple
      // Detectar la extensión del archivo para el tipo MIME
      const match = /\.(\w+)$/.exec(uri);
      const ext = match ? match[1] : 'jpg';
      const type = `image/${ext}`;

      formData.append('imagenes', {
        uri,
        name: `${id}.${ext}`,
        type,
      } as any);
    });
    createAccidentReport(formData)
      .then(() => {
        setSubmitted(true);
        setTipoAccidente(ACCIDENTE_OPTIONS[0].value);
        setDni('');
        setDescripcion('');
        setServerError('');
        setUbicacionError('');
        setImagesUri([]);
      })
      .catch((err) => {
        setServerError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onCloseModal() {
    (navigation as any).navigate('Tabs', {
      screen: 'Reportes', // El nombre del bottom tab
      params: {
        screen: 'MisReportesCreados', // El nombre de la top tab
      },
    });
    setSubmitted(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ConfirmationReporteModal visible={submitted} onClose={onCloseModal} />
        <View style={styles.container}>
          <GoBackButton handleGoBack={() => navigation.goBack()} />
          <View style={styles.header}>
            <Text style={styles.title}>Reporte de Accidentes</Text>
            <Text style={styles.subtitle}>Complete el formulario para reportar un accidente.</Text>
          </View>

          <View style={styles.formContainer}>
            <SelectField
              label="Tipo de Accidente *"
              labelIcon={<MaterialIcons name="warning" size={20} color="#34c25d" />}
              options={ACCIDENTE_OPTIONS}
              value={tipoAccidente}
              onChange={setTipoAccidente}
              error={tipoAccidenteError}
            />

            <FormField
              label="DNI *"
              labelIcon={<Ionicons name="id-card" size={20} color="#34c25d" />}
              value={dni}
              onChangeText={setDni}
              error={dniError}
              placeholder="Ej: 12345678"
              inputProps={{
                keyboardType: 'numeric',
                autoCapitalize: 'none',
              }}
            />

            <FormField
              label="Descripción *"
              labelIcon={<Ionicons name="document-text" size={20} color="#34c25d" />}
              value={descripcion}
              big
              onChangeText={setDescripcion}
              error={descripcionError}
              placeholder="Un breve resumen del accidente"
            />
            <ImageInput imagesUri={imagesUri} setImagesUri={setImagesUri} />
            {ubicacionError ? (
              <Text style={{ marginTop: 8, color: 'red' }}>{ubicacionError}</Text>
            ) : null}

            {serverError ? <Text style={{ color: 'red', marginTop: 8 }}>{serverError}</Text> : null}
          </View>
          <View style={styles.buttonContainer}>
            <FormButton text="Enviar Reporte" onSubmit={onSubmit} loading={loading} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingTop: 10,
    gap: 10,
  },
  header: {
    alignItems: 'center',
    padding: 4,
    paddingTop: 30,
    borderRadius: 24,
    gap: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    borderRadius: 24,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
  },
  buttonContainer: {
    borderRadius: 15,
    paddingHorizontal: 8,
  },
});
