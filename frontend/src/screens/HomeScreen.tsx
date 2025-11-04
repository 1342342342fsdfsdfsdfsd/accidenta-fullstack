import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GenericModal } from 'src/componentes/GenericModal';
import { LoadingModal } from 'src/componentes/LoadingModal';
import ReportPreview from 'src/componentes/ReportPreview';
import { useUser } from 'src/context/useUser';
import { createUrgenciaReport } from 'src/services/reportesService';
import { obtenerUbicacion } from 'src/utils/reusableFunctions';

const COOLDOWN_SECONDS = 5 * 60; // 5 minutos
const STORAGE_KEY = 'reporteCooldownExpireAt';

const HomeScreen = () => {
  const { loggedUser } = useUser();
  const [ubicacionError, setUbicacionError] = useState('');
  const navigation = useNavigation();
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttonText: 'Aceptar',
    buttonType: 'cancel' as 'create' | 'delete' | 'cancel' | 'update',
    iconName: 'check-circle' as 'check-circle' | 'cancel',
  });
  const ultimoReporte = loggedUser?.lastReport;

  // -----------------------------
  // Se guarda el timestamp de expiración.
  // -----------------------------
  const saveCooldown = async () => {
    const expireAt = Date.now() + COOLDOWN_SECONDS * 1000;
    await AsyncStorage.setItem(STORAGE_KEY, expireAt.toString());
    setCooldown(COOLDOWN_SECONDS);
  };

  // -----------------------------
  // Se carga el cooldown desde el timestamp.
  // -----------------------------
  const loadCooldown = async (): Promise<number> => {
    const expireAtStr = await AsyncStorage.getItem(STORAGE_KEY);
    if (!expireAtStr) return 0;
    const expireAt = parseInt(expireAtStr, 10);
    const remaining = Math.ceil((expireAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  };

  // -----------------------------
  // Inicializar cooldown al montar
  // -----------------------------
  useEffect(() => {
    loadCooldown().then((remaining) => setCooldown(remaining));
  }, []);

  // -----------------------------
  // Contador dinámico que disminuye cada segundo
  // -----------------------------
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((t) => {
        if (t <= 1) clearInterval(interval);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // -----------------------------
  // Función de reporte de urgencia
  // -----------------------------
  const onUrgencia = async () => {
    if (isSending || cooldown > 0) return;

    setIsSending(true);
    try {
      const direccion = await obtenerUbicacion({ setUbicacionError });
      await createUrgenciaReport(direccion);

      setModalConfig({
        visible: true,
        title: !direccion
          ? '🚨 Urgencia reportada con éxito, pero hubo un problema con la ubicación.'
          : '🚨 Urgencia reportada con éxito.',
        message: 'Manten la clama que ya se notifico tu ubicacion para que acudan a asistirte',
        buttonText: 'Aceptar',
        buttonType: 'create',
        iconName: 'check-circle',
      });

      // Guardar cooldown persistente
      await saveCooldown();
    } catch (e) {
      setModalConfig({
        visible: true,
        title: 'Error al reportar',
        message: 'No se pudo completar la acción. Inténtalo nuevamente.',
        buttonText: 'Aceptar',
        buttonType: 'delete',
        iconName: 'cancel',
      });
    } finally {
      setIsSending(false);
    }
  };

  // -----------------------------
  // Formateo de tiempo mm:ss
  // -----------------------------
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // -----------------------------
  // Botones de acción
  // -----------------------------
  const actions = [
    {
      icon: <Ionicons name="alert-circle" size={64} color="#FFF" />,
      title: 'EMERGENCIA',
      description:
        cooldown > 0
          ? `Podrás volver a reportar en ${formatTime(cooldown)}`
          : 'Reporta instantaneamente a tus contactos de confianza.',
      backgroundColor: '#d13333',
      onPress: onUrgencia,
      disabled: isSending || cooldown > 0,
    },
    {
      icon: <Ionicons name="document-text-outline" size={64} color="#FFF" />,
      title: 'Crear Reporte',
      description: 'Reporta un accidente detalladamente.',
      backgroundColor: '#34c25d',
      onPress: () => navigation.navigate('Formulario de reporte' as never),
    },
  ];

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>¡Hola, {loggedUser?.nombre}!</Text>
          <Text style={styles.subtitle}>Reportá y notificá emergencias con Accidenta.</Text>
        </View>

        {ultimoReporte && (
          <>
            <Text style={styles.lastReportTitle}>Tu último reporte:</Text>
            <ReportPreview reporte={ultimoReporte} />
          </>
        )}

        <View style={styles.actionsContainer}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.title}
              style={[
                styles.bigButton,
                { backgroundColor: action.backgroundColor, opacity: action.disabled ? 0.6 : 1 },
              ]}
              onPress={action.onPress}
              disabled={action.disabled}
            >
              {action.icon}
              <Text style={styles.bigButtonTitle}>{action.title}</Text>
              <Text style={styles.bigButtonDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modal de carga */}
      <LoadingModal visible={isSending} message="Enviando reporte ..." />

      {/* Modal de feedback */}
      <GenericModal
        visible={modalConfig.visible}
        onClose={() => setModalConfig((prev) => ({ ...prev, visible: false }))}
        title={modalConfig.title}
        message={modalConfig.message}
        buttonText={modalConfig.buttonText}
        buttonType={modalConfig.buttonType}
        icon_name={modalConfig.iconName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 18,
    paddingTop: 22,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#7F8C8D',
  },
  actionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bigButton: {
    width: '100%',
    borderRadius: 16,
    padding: 19,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigButtonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 12,
  },
  bigButtonDescription: {
    fontSize: 14,
    color: '#E0F7FA',
    textAlign: 'center',
    marginTop: 4,
  },
  lastReportTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2C3E50',
  },
});
export default HomeScreen;
