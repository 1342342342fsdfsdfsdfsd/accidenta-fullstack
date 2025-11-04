import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';

interface FormButtonProps {
  text: string;
  loading: boolean;
  onSubmit: () => void;
  inputProps?: Omit<TouchableOpacityProps, 'onPress' | 'disabled' | 'style'>;
}

export function FormButton(props: FormButtonProps) {
  const buttonScale = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    props.onSubmit();
  };

  return (
    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={props.loading}
        style={[styles.button, props.loading && styles.buttonDisabled]}
        activeOpacity={0.8}
        {...props.inputProps}
      >
        {props.loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.text}>{props.text}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#34c25d',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34c25d',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
    shadowOpacity: 0.1,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
    letterSpacing: 0.5,
  },
});
