// src/componentes/FormError.tsx
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from 'src/utils/colors';

type FormErrorProps = {
  message: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={styles.error}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FDEDEC',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  error: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '500',
  },
});
