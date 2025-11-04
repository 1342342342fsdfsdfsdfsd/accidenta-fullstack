import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import {
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
import { useUser } from 'src/context/useUser';
import { login } from 'src/services/authService';
import { colors } from 'src/utils/colors';
import { validateLoginPassword } from 'src/utils/loginValidations';
import { validateEmail } from 'src/utils/validations';
import { FormButton } from '../componentes/FormButton';
import FormField from '../componentes/FormField';
import type { RootTabParamList } from '../types/types';

type NavigationProp = NativeStackNavigationProp<RootTabParamList>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const { setToken } = useUser();
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation<NavigationProp>();

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleLogin = async () => {
    setLoading(true);
    setEmailError('');
    setPasswordError('');
    setError('');

    const emailValidation = validateEmail(email);
    const passwordValidation = validateLoginPassword(password);
    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      setLoading(false);
      return;
    }

    const bodyLogin = JSON.stringify({ email, password });

    login(bodyLogin)
      .then((token) => {
        setToken(token);
        clearForm();
      })
      .catch((err) => {
        switch (err.status) {
          case 400:
            setError('Email o contraseña incorrectos.');
            break;
          case 404:
            setError(err.message);
            break;
          default:
            console.log(err);
            setError('Error del servidor, intente nuevamente mas tarde');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRegisterPress = () => navigation.navigate('Registro' as never);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.login__scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        <View>
          <View style={styles.login__header}>
            <View style={styles.login__iconContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={{ width: 80, height: 80, resizeMode: 'contain' }}
              />
            </View>
            <Text style={styles.login__title}>Accidenta</Text>
            <Text style={styles.login__subtitle}>Login</Text>
          </View>
          <View style={styles.login__formContainer}>
            <View>
              <FormField
                label="Email"
                labelIcon={<Ionicons name="mail-outline" size={20} color={colors.brandGreen} />}
                value={email}
                onChangeText={setEmail}
                error={emailError}
                inputProps={{
                  keyboardType: 'email-address',
                  placeholder: 'Correo electrónico',
                  autoCapitalize: 'none',
                  autoCorrect: false,
                  autoComplete: 'email',
                  textContentType: 'emailAddress',
                }}
              />
              <FormField
                label="Contraseña"
                labelIcon={
                  <Ionicons name="lock-closed-outline" size={20} color={colors.brandGreen} />
                }
                value={password}
                onChangeText={setPassword}
                error={passwordError}
                inputProps={{
                  placeholder: 'Contraseña',
                  secureTextEntry: true,
                  autoCapitalize: 'none',
                  autoCorrect: false,
                  autoComplete: 'password',
                  textContentType: 'password',
                }}
              />
            </View>
            <FormError message={error} />
            <FormButton text="Acceder" loading={loading} onSubmit={handleLogin} />
            <View style={styles.login__registerContainer}>
              <Text style={styles.login__registerText}>¿Todavia no tienes una cuenta? </Text>
              <TouchableOpacity onPress={handleRegisterPress} style={styles.login__registerLink}>
                <Text style={styles.login__registerLinkText}>Registrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
  },
  login__scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  login__header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  login__iconContainer: {
    marginBottom: 16,
  },
  login__title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.black,
    marginBottom: 5,
    textAlign: 'center',
  },
  login__subtitle: {
    fontSize: 22,
    color: colors.brandGreen,
    textAlign: 'center',
    fontWeight: '600',
  },
  login__formContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000000a2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.borderField,
    gap: 8,
  },
  login__registerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login__registerText: {
    fontSize: 15,
    paddingTop: 20,
    paddingBottom: 10,
    color: colors.black,
    textAlign: 'center',
  },
  login__registerLink: {
    padding: 3,
  },
  login__registerLinkText: {
    color: colors.brandGreen,
    fontWeight: '600',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
