import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { ModalButton } from './ModalButton';

type GenericModalProps = {
  icon_name: 'check-circle' | 'cancel';
  title: string;
  message?: string;
  visible: boolean;
  onClose: () => void;
  buttonText?: string;
  buttonType: 'create' | 'delete' | 'cancel' | 'update';
};

export function GenericModal({
  visible,
  onClose,
  title,
  message,
  icon_name,
  buttonText = 'Cerrar',
  buttonType,
}: GenericModalProps) {
  const getIconColor = (icon_name?: string) => {
    switch (icon_name) {
      case 'check-circle':
        return '#34c25d'; // verde
      case 'cancel':
        return '#d13333'; // rojo
      default:
        return '#000'; // por defecto
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.modal__overlay}>
        <View style={styles.modal__container}>
          <View style={styles.modal__content}>
            {icon_name && (
              <MaterialIcons
                style={styles.modal__icon}
                name={icon_name}
                size={40}
                color={getIconColor(icon_name)}
              />
            )}
            <Text style={styles.modal__title}>{title}</Text>
            {message && <Text style={styles.modal__message}>{message}</Text>}
            <ModalButton text={buttonText} onPress={onClose} type={buttonType} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal__overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal__container: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 40,
    width: '80%',
    alignItems: 'center',
  },
  modal__content: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  modal__icon: {
    fontSize: 50,
  },
  modal__title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '90%',
  },
  modal__message: {
    fontSize: 14,
    textAlign: 'center',
    width: '90%',
  },
});
