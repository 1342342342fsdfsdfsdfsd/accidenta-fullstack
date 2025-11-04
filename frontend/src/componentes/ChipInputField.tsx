import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
type ChipInputFieldProps = {
  label: string;
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  limit?: number;
};

export default function ChipInputField({
  label,
  values,
  onValuesChange,
  placeholder,
  limit = 3,
}: ChipInputFieldProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddValue = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && values.length < limit && !values.includes(trimmedValue)) {
      onValuesChange([...values, trimmedValue]);
      setInputValue('');
    }
  };

  const handleRemoveValue = (indexToRemove: number) => {
    onValuesChange(values.filter((_, index) => index !== indexToRemove));
  };

  const isAtLimit = values.length >= limit;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{`${label} (Máx. ${limit})`}</Text>
      <View style={styles.chipsContainer}>
        {values.map((value, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{value}</Text>
            <TouchableOpacity onPress={() => handleRemoveValue(index)} style={styles.removeIcon}>
              <Feather name="x" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {!isAtLimit && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={placeholder}
            onSubmitEditing={handleAddValue} // Añade al presionar "Enter"
            blurOnSubmit={false} // Evita que el teclado se cierre
          />
          <Pressable
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            onPress={handleAddValue}
          >
            <Feather name="plus" size={20} color="#fff" />
          </Pressable>
        </View>
      )}
      {isAtLimit && (
        <Text style={styles.limitText}>Has alcanzado el límite de {limit} elementos.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 8 },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c757d', // Gris oscuro
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: { color: '#fff', marginRight: 8 },
  removeIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#34c25d',
    padding: 10,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  addButtonPressed: { backgroundColor: '#2a9d4a' },
  limitText: { color: '#666', fontStyle: 'italic', fontSize: 14 },
});
