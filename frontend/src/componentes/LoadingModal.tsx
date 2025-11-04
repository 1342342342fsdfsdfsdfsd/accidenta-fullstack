import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

type LoadingModalProps = {
  visible: boolean;
  message?: string;
};

export function LoadingModal({ visible, message }: LoadingModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modal__overlay}>
        <View style={styles.modal__content}>
          <ActivityIndicator size="large" color="#d13333" />
          <Text style={styles.modal__text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal__overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal__content: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modal__text: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
});
