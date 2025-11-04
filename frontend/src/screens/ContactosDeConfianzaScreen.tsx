import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getTrustedContacts } from 'src/services/userService';
import Contacto from '../componentes/Contacto';
import { ModalManager } from '../componentes/TrustedUserModal';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '../componentes/LoadingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoBackButton from 'src/componentes/GoBackButton';

export type ContactoType = {
  id: string;
  nombre: string;
  mail: string;
};

export default function ContactosDeConfianzaScreen() {
  const navigation = useNavigation();
  const [contactos, setContactos] = useState<ContactoType[]>([]);
  const [selectedContacto, setSelectedContacto] = useState<ContactoType | null>(null);
  const [modalType, setModalType] = useState<'create' | 'update' | 'delete' | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTrustedContacts();
      if (data) setContactos(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const openCreateModal = () => setModalType('create');
  const openUpdateModal = (contacto: ContactoType) => {
    setSelectedContacto(contacto);
    setModalType('update');
  };
  const openDeleteModal = (contacto: ContactoType) => {
    setSelectedContacto(contacto);
    setModalType('delete');
  };
  const closeModal = () => {
    setSelectedContacto(null);
    setModalType(null);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GoBackButton handleGoBack={handleGoBack} />
        <ModalManager
          modalType={modalType}
          selectedContacto={selectedContacto}
          setContactos={setContactos}
          closeModal={closeModal}
        />

        <View style={styles.header}>
          <Text style={styles.title}>Contactos de Confianza</Text>
          <Text style={styles.subtitle}>Aquí puedes gestionar tus contactos de confianza.</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={openCreateModal}
        >
          <Text style={styles.addButtonText}>Agregar Contacto</Text>
        </Pressable>

        <FlatList
          data={contactos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Contacto contacto={item} onEdit={openUpdateModal} onDelete={openDeleteModal} />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No tienes contactos aún.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { marginBottom: 16, marginTop: 30 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center' },
  addButton: {
    backgroundColor: '#34c25d',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonPressed: { opacity: 0.7 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listContainer: { paddingBottom: 16 },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 20 },
});
