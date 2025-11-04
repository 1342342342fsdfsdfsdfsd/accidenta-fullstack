import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GoBackButtonProps {
  handleGoBack: () => void;
}

export default function GoBackButton({ handleGoBack }: GoBackButtonProps) {
  return (
    <Pressable
      style={styles.backButton}
      onPress={handleGoBack}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="arrow-back" size={24} color="#34c25d" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    left: 16,
    top: 16,
    position: 'absolute',
    zIndex: 10,
  },
});
