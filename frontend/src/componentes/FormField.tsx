import { Ionicons } from '@expo/vector-icons';
import type { TextInputProps } from 'react-native';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../utils/colors';

type FormFieldProps = {
  label: string;
  labelIcon?: React.ReactNode;
  value: string;
  big?: boolean;
  error?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  inputProps?: Omit<
    TextInputProps,
    'value' | 'onChangeText' | 'onFocus' | 'onBlur' | 'style' | 'multiline'
  >;
};

export default function FormField({
  label,
  labelIcon,
  value,
  big,
  error,
  onChangeText,
  placeholder,
  inputProps,
}: FormFieldProps) {
  const focusAnim = new Animated.Value(0);

  const handleFocus = () => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {labelIcon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor: error
              ? colors.error
              : focusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#e1e5e9', '#34c25d'],
                }),
            shadowOpacity: focusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={[styles.input, big && styles.bigInput]}
          multiline={big}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          {...inputProps}
        />
      </Animated.View>
      {Boolean(error) && (
        <View style={styles.containerError}>
          <Ionicons name="warning-outline" size={18} color="red" />
          <Text style={styles.text}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2C3E50',
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 16,
    backgroundColor: '#FAFBFC',
    shadowColor: '#34c25d',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    width: 260,
    padding: 18,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
    outlineStyle: 'solid',
  },
  bigInput: {
    height: 100,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
    minHeight: 18,
  },
  containerError: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  text: {
    color: 'red',
    marginLeft: 6,
  },
});
