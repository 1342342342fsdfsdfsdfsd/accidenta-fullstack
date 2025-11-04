import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FormError } from 'src/componentes/FormError';
import FormField from 'src/componentes/FormField';
import { register } from 'src/services/authService';
import {
  validateApellido,
  validateDni,
  validateEmail,
  validateFechaNacimiento,
  validateNombre,
  validatePassword,
  validateTelefono,
} from 'src/utils/validations';
import { FormButton } from '../componentes/FormButton';

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [dni, setDNI] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imagenUri, setImagenUri] = useState('');

  const [error, setError] = useState('');
  const [dniError, setdniError] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [telefonoError, setTelefonoError] = useState('');
  const [fechaNacimientoError, setFechaNacimientoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Debes otorgar permisos para usar la cámara y la galería.',
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) setImagenUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) setImagenUri(result.assets[0].uri);
  };

  const clearForm = () => {
    setDNI('');
    setNombre('');
    setApellido('');
    setFechaNacimiento('');
    setTelefono('');
    setEmail('');
    setPassword('');
    setImagenUri('../../assets/default.jpg');
  };

  const handleRegister = async () => {
    setIsLoading(true);

    const dniErrorMsg = validateDni(dni);
    const nombreErrorMsg = validateNombre(nombre);
    const apellidoErrorMsg = validateApellido(apellido);
    const telefonoErrorMsg = validateTelefono(telefono);
    const fechaNacimientoErrorMsg = validateFechaNacimiento(fechaNacimiento);
    const emailErrorMsg = validateEmail(email);
    const passwordErrorMsg = validatePassword(password);

    setdniError(dniErrorMsg);
    setNombreError(nombreErrorMsg);
    setApellidoError(apellidoErrorMsg);
    setTelefonoError(telefonoErrorMsg);
    setFechaNacimientoError(fechaNacimientoErrorMsg);
    setEmailError(emailErrorMsg);
    setPasswordError(passwordErrorMsg);

    if (
      dniErrorMsg ||
      nombreErrorMsg ||
      apellidoErrorMsg ||
      telefonoErrorMsg ||
      fechaNacimientoErrorMsg ||
      emailErrorMsg ||
      passwordErrorMsg
    ) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('dni', dni);
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('telefono', telefono);
    formData.append('email', email);
    formData.append('password', password);

    if (imagenUri) {
      formData.append('imagen', {
        uri: imagenUri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
    }

    register(formData)
      .then(() => {
        clearForm();
        navigation.navigate('Login' as never);
      })
      .catch((err) => {
        switch (err.status) {
          case 409:
            setError(err.message);
          case 500:
            setError(err.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegisterPress = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, gap: 4 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.container2}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={{ width: 80, height: 80, resizeMode: 'contain' }}
              />
            </View>
            <Text style={styles.title}>Accidenta</Text>
            <Text style={styles.subtitle}>Registro</Text>
          </View>
          <View style={styles.formContainer}>
            <FormField
              label="DNI *"
              labelIcon={<Ionicons name="id-card" size={20} color="#34c25d" />}
              value={dni}
              onChangeText={setDNI}
              placeholder="Escriba su DNI"
              error={dniError}
              inputProps={{
                keyboardType: 'numeric',
              }}
            />
            <FormField
              label="Nombre *"
              labelIcon={<Ionicons name="person" size={20} color="#34c25d" />}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Escriba su nombre"
              error={nombreError}
            />
            <FormField
              label="Apellido *"
              labelIcon={<Ionicons name="person" size={20} color="#34c25d" />}
              value={apellido}
              onChangeText={setApellido}
              placeholder="Escriba su apellido"
              error={apellidoError}
            />
            <FormField
              label="Fecha de Nacimiento *"
              labelIcon={<Ionicons name="calendar" size={20} color="#34c25d" />}
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
              placeholder="YYYY-MM-DD"
              error={fechaNacimientoError}
            />
            <FormField
              label="Telefono *"
              labelIcon={<Ionicons name="call" size={20} color="#34c25d" />}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Escriba su contraseña"
              error={telefonoError}
              inputProps={{
                keyboardType: 'numeric',
              }}
            />
            <FormField
              label="Email *"
              labelIcon={<Ionicons name="mail" size={20} color="#34c25d" />}
              value={email}
              onChangeText={setEmail}
              placeholder="Escriba su email"
              error={emailError}
              inputProps={{
                keyboardType: 'email-address',
              }}
            />
            <FormField
              label="Password *"
              labelIcon={<Ionicons name="lock-closed" size={20} color="#34c25d" />}
              value={password}
              onChangeText={setPassword}
              placeholder="Escriba su contraseña"
              error={passwordError}
              inputProps={{ secureTextEntry: true }}
            />
          </View>
          <View style={styles.imageContainer}>
            <View style={styles.buttonColumn}>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Seleccionar Imagen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePhoto}>
                <Text style={styles.buttonText}>Tomar foto</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={imagenUri ? { uri: imagenUri } : require('../../assets/default.jpg')}
              style={styles.image}
            />
          </View>
          <FormError message={error} />
          <FormButton text="Registrar" onSubmit={handleRegister} loading={isLoading} />
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿Ya tenes una cuenta?</Text>
            <TouchableOpacity onPress={handleRegisterPress} style={styles.registerLink}>
              <Text style={styles.registerLinkText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
    backgroundColor: '#F0FDF4',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  iconContainer: { marginBottom: 16 },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#555555ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  formContainer2: {
    gap: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 15,
    color: '#34c25d',
    textAlign: 'center',
    fontWeight: '600',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 100,
    alignSelf: 'center',
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'space-evenly',
    padding: 12,
    shadowColor: '#4e4e4eff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },

  buttonColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 8,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#34c25d',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  container2: {
    gap: 16,
  },
  buttonText: {
    color: '#ffffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: { fontSize: 16, color: '#666', textAlign: 'center' },
  registerLink: { padding: 8 },
  registerLinkText: {
    color: '#34c25d',
    fontWeight: '600',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
