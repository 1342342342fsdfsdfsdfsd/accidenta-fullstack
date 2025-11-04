import { useState, useEffect, useCallback } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import FormField from './FormField';
import { ModalButton } from './ModalButton';
import { useUser } from 'src/context/useUser';
import {
  addTrustedContact,
  editTrustedContact,
  removeTrustedContact,
} from 'src/services/userService';
import { validateEmail, validateNombre } from 'src/utils/validations';
import { ContactoType } from 'src/screens/ContactosDeConfianzaScreen';

type BaseModalProps = {
  visible: boolean;
  onClose: () => void;
};

type FormModalProps = BaseModalProps & {
  data?: ContactoType;
  onConfirm: (data: ContactoType) => void;
};

type ModalManagerProps = {
  modalType: 'create' | 'update' | 'delete' | null;
  selectedContacto: ContactoType | null;
  setContactos: React.Dispatch<React.SetStateAction<ContactoType[]>>;
  closeModal: () => void;
};

export function ModalManager({
  modalType,
  selectedContacto,
  setContactos,
  closeModal,
}: ModalManagerProps) {
  const handleConfirmCreate = useCallback(
    (data: ContactoType) => {
      setContactos((prev) => [...prev, data]);
      closeModal();
    },
    [setContactos, closeModal],
  );

  const handleConfirmUpdate = useCallback(
    (data: ContactoType) => {
      setContactos((prev) => prev.map((c) => (c.id === data.id ? data : c)));
      closeModal();
    },
    [setContactos, closeModal],
  );

  const handleConfirmDelete = useCallback(
    (data: ContactoType) => {
      setContactos((prev) => prev.filter((c) => c.id !== data.id));
      closeModal();
    },
    [setContactos, closeModal],
  );

  switch (modalType) {
    case 'create':
      return (
        <CreateTrustedUserModal visible onClose={closeModal} onConfirm={handleConfirmCreate} />
      );

    case 'update':
      if (!selectedContacto) return null;
      return (
        <UpdateTrustedUserModal
          visible
          data={selectedContacto}
          onClose={closeModal}
          onConfirm={handleConfirmUpdate}
        />
      );

    case 'delete':
      if (!selectedContacto) return null;
      return (
        <ConfirmationDeleteTrustedUserModal
          visible
          data={selectedContacto}
          onClose={closeModal}
          onConfirm={handleConfirmDelete}
        />
      );

    default:
      return null;
  }
}

// Hook reutilizable para formularios de contacto
function useContactoForm(initialData?: ContactoType) {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [mail, setMail] = useState(initialData?.mail || '');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setMail(initialData.mail);
    }
  }, [initialData]);

  const validate = () => {
    const nameErr = validateNombre(nombre);
    const emailErr = validateEmail(mail);
    setNameError(nameErr);
    setEmailError(emailErr);
    return !(nameErr || emailErr);
  };

  const clear = () => {
    setNombre('');
    setMail('');
    setServerError('');
    setNameError('');
    setEmailError('');
  };

  return {
    nombre,
    setNombre,
    mail,
    setMail,
    nameError,
    emailError,
    serverError,
    setServerError,
    validate,
    clear,
  };
}

export function CreateTrustedUserModal({ visible, onClose, onConfirm }: FormModalProps) {
  const form = useContactoForm();

  const handleConfirm = async () => {
    if (!form.validate()) return;

    try {
      const contact = await addTrustedContact({ nombre: form.nombre, mail: form.mail });
      onConfirm({ id: contact.id, nombre: form.nombre, mail: form.mail });
      form.clear();
      onClose();
    } catch (err) {
      console.error(err);
      form.setServerError('Error al agregar el contacto. Inténtalo de nuevo.');
    }
  };

  return (
    <FormModal
      {...form}
      visible={visible}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Agregar Contacto"
      confirmText="Agregar"
      confirmType="create"
    />
  );
}

export function UpdateTrustedUserModal({
  visible,
  data,
  onClose,
  onConfirm,
}: FormModalProps & { data: ContactoType }) {
  const form = useContactoForm(data);

  const handleConfirm = async () => {
    if (!form.validate()) return;

    try {
      await editTrustedContact(data.id, { nombre: form.nombre, mail: form.mail });
      onConfirm({ id: data.id, nombre: form.nombre, mail: form.mail });
      form.clear();
      onClose();
    } catch (err) {
      console.error(err);
      form.setServerError('Error al actualizar el contacto. Inténtalo de nuevo.');
    }
  };

  return (
    <FormModal
      {...form}
      visible={visible}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Actualizar Contacto de Confianza"
      confirmText="Actualizar"
      confirmType="update"
    />
  );
}

export function ConfirmationDeleteTrustedUserModal({
  visible,
  data,
  onClose,
  onConfirm,
}: FormModalProps & { data: ContactoType }) {
  const [serverError, setServerError] = useState('');

  const handleConfirm = async () => {
    try {
      await removeTrustedContact(data.id);
      onConfirm(data);
      setServerError('');
      onClose();
    } catch (err) {
      console.error(err);
      setServerError('Error al eliminar el contacto. Inténtalo de nuevo.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirmar eliminación</Text>
          <Text style={styles.modalMessage}>
            ¿Estás seguro de que deseas eliminar a{' '}
            <Text style={styles.boldText}>{data.nombre}</Text> de tus contactos de confianza?
          </Text>
          {serverError ? <Text style={{ color: 'red' }}>{serverError}</Text> : null}
          <View style={styles.buttonContainer}>
            <ModalButton text="Cancelar" onPress={onClose} type="cancel" />
            <ModalButton text="Eliminar" onPress={handleConfirm} type="delete" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Componente reutilizable para formularios Create/Update
function FormModal({
  visible,
  title,
  nombre,
  mail,
  setNombre,
  setMail,
  nameError,
  emailError,
  serverError,
  onClose,
  onConfirm,
  confirmText,
  confirmType,
}: {
  visible: boolean;
  title: string;
  nombre: string;
  mail: string;
  setNombre: (v: string) => void;
  setMail: (v: string) => void;
  nameError: string;
  emailError: string;
  serverError: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
  confirmType: 'create' | 'update';
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FormField
            label="Nombre"
            placeholder="Ingresa el nombre"
            value={nombre}
            onChangeText={setNombre}
            error={nameError}
          />
          <FormField
            label="Email"
            placeholder="Ingresa el email"
            value={mail}
            onChangeText={setMail}
            error={emailError}
          />
          {serverError ? <Text style={{ color: 'red' }}>{serverError}</Text> : null}
          <View style={styles.buttonContainer}>
            <ModalButton text="Cancelar" onPress={onClose} type="cancel" />
            <ModalButton text={confirmText} onPress={onConfirm} type={confirmType} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalMessage: { fontSize: 16, textAlign: 'center' },
  boldText: { fontWeight: 'bold' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
});
