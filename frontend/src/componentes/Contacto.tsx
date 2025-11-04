import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContactoType } from 'src/screens/ContactosDeConfianzaScreen';

export default function Contacto({
  contacto,
  onEdit,
  onDelete,
}: {
  contacto: ContactoType;
  onEdit: (c: ContactoType) => void;
  onDelete: (c: ContactoType) => void;
}) {
  return (
    <View style={styles.contactoContainer}>
      <View>
        <Text style={styles.contactoNombre}>{contacto.nombre}</Text>
        <Text style={styles.contactoEmail}>{contacto.mail}</Text>
      </View>
      <View style={styles.contactoActions}>
        <Pressable onPress={() => onEdit(contacto)} style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={20} color="#34c25d" />
        </Pressable>
        <Pressable onPress={() => onDelete(contacto)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contactoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactoEmail: {
    fontSize: 14,
    color: '#666',
  },
  contactoActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
  },
});
