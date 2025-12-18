import { Modal, Pressable, Text, View } from 'react-native'
import s from '../style'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { deleteTodo } from '../database/queries';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import EditTodoModal from './editTodoModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

type TodoOptionsProps = {
  isOpen: boolean;
  onClose: () => void;
  id: number;
  todoTitle: string;
  onDeleted?: () => void;
};

type TodoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Todo'>

export default function TodoOptions({ isOpen, onClose, id, todoTitle, onDeleted }: TodoOptionsProps) {
  const [loading, setLoading] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const navigation = useNavigation<TodoScreenNavigationProp>();
  const db = useSQLiteContext();

  async function removeTodo() {
    setLoading(true);
    try {
      await deleteTodo(db, id);
      setConfirmDeleteVisible(false);
      onClose(); // Cierra el modal de opciones
      onDeleted?.();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      backdropColor={'rgba(0,0,0,0)'}
    >
      <View style={s.modal}>
        <View style={s.modalView}>
          <View style={s.modalHeader}>
            <Text style={s.title1}>¿Qué deseas hacer?</Text>
            <Pressable style={s.exitButton} onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>

          <View style={s.todoOptions}>
            <Pressable
              style={s.deleteButton}
              onPress={() => setConfirmDeleteVisible(true)}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Eliminar</Text>
            </Pressable>

            <Pressable style={s.editButton} onPress={() => setEditModalVisible(true)}>
              <Text style={{ color: 'white' }}>Editar</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ConfirmDeleteModal
        visible={confirmDeleteVisible}
        titleToMatch={todoTitle}
        onClose={() => setConfirmDeleteVisible(false)}
        onConfirm={removeTodo}
        loading={loading}
      />

      <EditTodoModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        todoId={id}
        onUpdated={() => {
          onDeleted?.();
          onClose();
        }}
      />
    </Modal>
  );
}