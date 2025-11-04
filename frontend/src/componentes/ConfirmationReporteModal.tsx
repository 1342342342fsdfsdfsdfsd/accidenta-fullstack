import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { FormButton } from './FormButton';

type ConfirmationModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ConfirmationReporteModal({ visible, onClose }: ConfirmationModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MaterialIcons name="check-circle" size={40} color="green" />
          <Text style={styles.title}>Reporte enviado exitosamente!</Text>
          <Text style={styles.message}>
            Su reporte ha sido enviado, ahora cualquier usuario de la aplicación podrá visualizarlo
            en la lista de reportes y ayudarle.
          </Text>
          <FormButton text="Ir a reportes" loading={false} onSubmit={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    display: 'flex',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
