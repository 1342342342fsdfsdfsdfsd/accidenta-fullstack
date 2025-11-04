import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

const BUTTON_COLORS: Record<'create' | 'update' | 'delete' | 'cancel', string> = {
  create: '#34c25d', // Green
  update: '#3B82F6', // Blue
  delete: '#D13333', // Red
  cancel: '#9CA3AF', // Gray
};

type ModalButtonProps = {
  text: string;
  onPress: () => void;
  type: 'create' | 'update' | 'delete' | 'cancel';
};

export function ModalButton({ text, onPress, type }: ModalButtonProps) {
  const buttonStyle: ViewStyle = { ...styles.button, backgroundColor: BUTTON_COLORS[type] };

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
