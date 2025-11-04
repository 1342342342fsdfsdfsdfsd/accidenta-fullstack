import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from 'src/utils/colors';

interface ImageInputProps {
  imagesUri: string[];
  setImagesUri: (uris: string[]) => void;
}

export function ImageInput({ imagesUri, setImagesUri }: ImageInputProps) {
  const MAX_IMAGES = 3;

  const addImage = (uri: string) => {
    if (imagesUri.length >= MAX_IMAGES) {
      Alert.alert('Límite alcanzado', `Solo puedes subir hasta ${MAX_IMAGES} fotos.`);
      return;
    }
    setImagesUri([...imagesUri, uri]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // 👈 nuevo formato
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) addImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) addImage(result.assets[0].uri);
  };

  const removeImage = (uri: string) => {
    setImagesUri(imagesUri.filter((img) => img !== uri));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonColumn}>
        <TouchableOpacity
          style={[styles.button, imagesUri.length >= MAX_IMAGES && styles.buttonDisabled]}
          onPress={pickImage}
          disabled={imagesUri.length >= MAX_IMAGES}
        >
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, imagesUri.length >= MAX_IMAGES && styles.buttonDisabled]}
          onPress={takePhoto}
          disabled={imagesUri.length >= MAX_IMAGES}
        >
          <Text style={styles.buttonText}>Tomar foto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageRow}>
        {imagesUri.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity style={styles.deleteIcon} onPress={() => removeImage(uri)}>
              <MaterialIcons name="delete" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    width: '48%',
    padding: 10,
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
    gap: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  deleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 3,
  },
});
