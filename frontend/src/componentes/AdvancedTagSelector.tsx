import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FormError } from './FormError';

type AdvancedTagSelectorProps = {
  label: string;
  selectedTags: string[];
  suggestedTags: string[]; // Sugerencias
  onTagsChange: (tags: string[]) => void;
  limit?: number;
  error: string;
};

export default function AdvancedTagSelector({
  label,
  selectedTags,
  suggestedTags,
  onTagsChange,
  limit = 3,
  error,
}: AdvancedTagSelectorProps) {
  const [inputValue, setInputValue] = useState('');

  const handleToggleTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    if (selectedTags.includes(trimmedTag)) {
      // Si ya está seleccionado, lo quitamos
      onTagsChange(selectedTags.filter((t) => t !== trimmedTag));
    } else {
      // Si no está seleccionado y no hemos alcanzado el límite, lo añadimos
      if (selectedTags.length < limit) {
        onTagsChange([...selectedTags, trimmedTag]);
      }
    }
  };

  const handleAddFromInput = () => {
    // Llama a la misma función de toggle para añadir el texto del input
    handleToggleTag(inputValue);
    setInputValue(''); // Limpia el input después de añadir
  };

  const isAtLimit = selectedTags.length >= limit;

  // Filtramos las sugerencias para no mostrar las que ya están seleccionadas
  const availableSuggestions = suggestedTags.filter((tag) => !selectedTags.includes(tag));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{`${label} (Máx. ${limit})`}</Text>

      {/* Input para añadir nuevos tags */}
      {!isAtLimit && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Escribe y añade o elige de abajo..."
            onSubmitEditing={handleAddFromInput}
            blurOnSubmit={false}
          />
          <Pressable
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            onPress={handleAddFromInput}
          >
            <Feather name="plus" size={20} color="#fff" />
          </Pressable>
        </View>
      )}

      {/* Chips seleccionados */}
      <View style={styles.selectedChipsContainer}>
        {selectedTags.length === 0 && (
          <Text style={styles.placeholderText}>Ningún elemento añadido</Text>
        )}
        {selectedTags.map((tag, index) => (
          <View key={tag + index} style={styles.selectedChip}>
            <Text style={styles.selectedChipText}>{tag}</Text>
            <TouchableOpacity onPress={() => handleToggleTag(tag)} style={styles.removeIcon}>
              <Feather name="x" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Sugerencias disponibles */}
      {availableSuggestions.length > 0 && (
        <View style={styles.availableTagsContainer}>
          {availableSuggestions.map((tag, index) => {
            const isDisabled = isAtLimit;
            return (
              <TouchableOpacity
                key={tag + index}
                style={[styles.availableTag, isDisabled && styles.availableTagDisabled]}
                onPress={() => handleToggleTag(tag)}
                disabled={isDisabled}
              >
                <Text
                  style={[styles.availableTagText, isDisabled && styles.availableTagTextDisabled]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {isAtLimit && (
        <Text style={styles.limitText}>{`Solo se pueden ingresar hasta ${limit} ${label}`}</Text>
      )}
      {error && <FormError message={error} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  addButton: {
    backgroundColor: '#34c25d',
    padding: 10,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  addButtonPressed: { backgroundColor: '#2a9d4a' },
  selectedChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    minHeight: 50,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  placeholderText: { color: '#aaa', fontStyle: 'italic' },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c757d',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  selectedChipText: { color: '#fff', marginRight: 6 },
  removeIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 2,
  },
  availableTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  availableTag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  availableTagText: { color: '#333', fontWeight: '500' },
  availableTagDisabled: { backgroundColor: '#e9ecef', opacity: 0.6 },
  availableTagTextDisabled: { color: '#6c757d' },
  limitText: { color: '#dc3545', fontSize: 13, marginTop: 8 },
});
