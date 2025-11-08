import { ActivityIndicator, Modal, Pressable, Text, TouchableWithoutFeedback, View, Animated } from 'react-native'
import s from '../style'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSQLiteContext } from 'expo-sqlite';
import { useState, useRef } from 'react';
import { deleteTodo } from '../database/queries';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import EditTodoModal from './editTodoModal';

type TodoOptionsProps = {
  isOpen: boolean;
  onClose: () => void;
  id: number;
  onDeleted?: () => void;
};

type TodoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Todo'>

export default function TodoOptions({ isOpen, onClose, id, onDeleted }: TodoOptionsProps) {
  const [loading, setLoading] = useState(false)
  const [pressing, setPressing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<TodoScreenNavigationProp>();
  const db = useSQLiteContext();

  async function removeTodo() {
    setLoading(true)
    try {
      await deleteTodo(db, id)
      onClose()
      onDeleted?.();
      navigation.navigate('Home');
    } catch (error) {
      console.error('No fue posible eliminar la tarea: ', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePressIn = () => {
    setPressing(true);
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000, // duración del long press
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        removeTodo();
        progress.setValue(0);
        setPressing(false);
      }
    });
  };

  const handlePressOut = () => {
    if (pressing) {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      setPressing(false);
    }
  };

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      animationType="fade"
      backdropColor={'rgba(0, 0, 0, 0)'}
      onRequestClose={onClose}
      visible={isOpen}
    >
      <View style={s.modal}>
        <View style={s.modalView}>

          <View style={s.modalHeader}>
            <Text style={s.title1}>
              ¿Qué deseas hacer?
            </Text>
            <Pressable onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>

          <Text style={s.title6}>
            *Mantén presionado para eliminar*
          </Text>

          <View style={s.todoOptions}>
            <TouchableWithoutFeedback
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={loading}
            >
              <View style={[s.deleteButton, { overflow: 'hidden', position: 'relative' }]}>
                <Animated.View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width,
                    backgroundColor: '#ff2e54aa', // color de llenado
                  }}
                />
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: 'white', fontWeight: '600' }}>
                    Eliminar
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>

            <Pressable
              style={s.editButton}
              onPress={() => setEditModalVisible(true)}
            >
              <Text style={{ color: 'white' }}>Editar</Text>
            </Pressable>

            <EditTodoModal
              visible={editModalVisible}
              onClose={() => setEditModalVisible(false)}
              todoId={id}
              onUpdated={() => {
                onDeleted?.()
                onClose()
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}
