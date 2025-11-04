import { API_BASE_URL } from '@env';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import InfoCard from 'src/componentes/Infocard';
import { useUser } from 'src/context/useUser';

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const { setLoggedUser, loggedUser } = useUser();

  const imagenUri = `${API_BASE_URL}uploads/${loggedUser?.imagen}`;

  const handleLogout = async () => {
    setLoggedUser(null);
    await AsyncStorage.removeItem('token');
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: imagenUri }} style={styles.profileImage} />
        </View>
        <View style={styles.contentInformation}>
          <Text style={styles.userName}>
            {loggedUser?.nombre} {loggedUser?.apellido}
          </Text>
          <Text style={styles.userEmail}>{loggedUser?.email}</Text>
        </View>
      </View>

      {/* Information Section */}
      <Text style={styles.sectionTitle}>Mis datos personales</Text>
      <View style={styles.infoSection}>
        <View style={styles.sectionContainer}>
          <InfoCard title="DNI" value={loggedUser?.dni} />
          <InfoCard
            title="Nombre completo"
            value={loggedUser?.nombre + ' ' + loggedUser?.apellido}
          />
          <InfoCard title="Fecha de nacimiento" value={loggedUser?.fechaNacimiento} />
          <InfoCard title="Teléfono" value={loggedUser?.telefono} />
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Gestionar contactos de confianza</Text>
        <View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate('ContactosDeConfianza' as never)}
          >
            <Feather name="users" size={20} color="#ffffffff" />
            <Text style={styles.logoutButtonText}>Contactos de Confianza</Text>
          </TouchableOpacity>
          <Text style={styles.text}>Notificalos rapidamente ante emergencias.</Text>
        </View>
      </View>
      <View>
        <View>
          <Text style={styles.sectionTitle}>Gestionar datos de salud</Text>
          <View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => navigation.navigate('DatosDeSalud' as never)}
            >
              <Feather name="heart" size={20} color="#ffffffff" />
              <Text style={styles.logoutButtonText}>Datos de Salud</Text>
            </TouchableOpacity>
            <Text style={styles.text}>
              Registra y visualiza información relevante sobre tu salud.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#fbfbfbff" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    padding: 5,
    marginLeft: 3,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    gap: 8,
  },
  header: {
    alignItems: 'center',
    padding: 7,
    backgroundColor: '#fff',
    borderRadius: 24,
    gap: 2,
  },
  profileImageContainer: { paddingTop: 15 },
  profileImage: { width: 150, height: 150, borderRadius: 100 },
  contentInformation: { gap: 4, padding: 4, paddingBottom: 20 },
  userName: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  userEmail: { fontSize: 16, textAlign: 'center' },
  infoSection: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    backgroundColor: '#ffffffff',
    borderRadius: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    marginTop: 15,
  },
  sectionContainer: { width: '100%', paddingHorizontal: 10, paddingVertical: 6 },
  footer: {
    alignItems: 'center',
    borderRadius: 24,
    padding: 10,
    marginTop: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: '#34c25d',
  },
  logoutButtonText: { marginLeft: 4, fontSize: 16, fontWeight: '500', color: '#ffffffff' },
});
