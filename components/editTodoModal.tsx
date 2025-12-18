import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Keyboard,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSQLiteContext } from 'expo-sqlite';
import s from '../style';
import { getLocalDateString } from '../utils/utils';
import { Calendar } from 'react-native-calendars';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Todo } from '../types/object-types';
import { getTodoById, updateTodoById } from '../database/queries';

const schema = yup.object({
  title: yup.string().required('El título es obligatorio'),
  description: yup.string().max(140, 'Máximo 140 caracteres'),
});

interface EditTodoModalProps {
  visible: boolean;
  onClose: () => void;
  todoId: number | null;
  onUpdated: () => void;
}

export default function EditTodoModal({ visible, onClose, todoId, onUpdated }: EditTodoModalProps) {
  const db = useSQLiteContext();
  const [loading, setLoading] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState(false);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [date, setDate] = useState(getLocalDateString());

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchTodo = async () => {
      if (!todoId) {
        setTodo(null);
        reset();
        setDate(getLocalDateString());
        return;
      }
      setLoadingTodo(true);
      try {
        const result = (await getTodoById(db, todoId)) as Todo | null;
        if (result) {
          setTodo(result);
          setDate(result.due_date ?? getLocalDateString());
          reset({
            title: result.title ?? '',
            description: result.description ?? '',
          });
          setValue('title', result.title ?? '');
          setValue('description', result.description ?? '');
        } else {
          setTodo(null);
        }
      } catch (error) {
        console.error('Error al obtener tarea:', error);
        Alert.alert('Error', 'No se pudo cargar la tarea');
      } finally {
        setLoadingTodo(false);
      }
    };

    fetchTodo();
  }, [todoId, db, reset, setValue]);

  const onSubmit = async (data: { title: string; description?: string | null }) => {
    if (!todoId) return;
    setLoading(true);
    try {
      // actualizar con la fecha seleccionada
      await updateTodoById(db, todoId, data.title, data.description ?? '', date);
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;
  if (loadingTodo) {
    return (
      <Modal animationType="fade" visible={visible} onRequestClose={onClose} transparent>
        <View style={s.modal}>
          <View style={s.modalView}>
            <ActivityIndicator />
          </View>
        </View>
      </Modal>
    );
  }

  if (!todo) {
    return null;
  }

  function wrongDate() {
    Alert.alert('Error', 'La fecha no puede ser anterior a la actual.', [{ text: 'Aceptar' }]);
  }

  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      backdropColor={'rgba(0,0,0,0)'}
    >
      <View style={s.modal}>
        <View style={s.modalView}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[s.title1, { marginBottom: 8 }]}>Editar tarea</Text>
            <Pressable style={s.exitButton} onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>

          <View style={s.inputLabel}>
            <Text style={s.inputText}>Título</Text>
            <Controller
              control={control}
              name="title"
              defaultValue={todo.title ?? ''}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={s.modalInput}
                  maxLength={30}
                  returnKeyType="next"
                  placeholder="Escribe un título..."
                  placeholderTextColor="#767676ff"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>

          <View style={s.inputLabel}>
            <Text style={s.inputText}>Fecha</Text>
            <TouchableHighlight
              underlayColor={'rgba(226, 226, 226, 1)'}
              style={s.datePickerModalButton}
              onPress={() => setDateModalVisible(true)}
            >
              <View style={s.datePickerModalButtonContent}>
                <Feather name="calendar" size={24} color="black" />
                <Text style={s.datePickerModalOpenButtonText}>{date}</Text>
              </View>
            </TouchableHighlight>
          </View>

          <View style={s.inputLabel}>
            <Text style={s.inputText}>Descripción</Text>
            <Controller
              control={control}
              name="description"
              defaultValue={todo.description ?? ''}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[s.modalInput, { height: 79, textAlignVertical: 'top' }]}
                  multiline={true}
                  numberOfLines={3}
                  maxLength={140}
                  returnKeyType="done"
                  placeholder="Describe la tarea..."
                  placeholderTextColor="#767676ff"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>

          <View style={s.modalButtons}>
            <TouchableHighlight underlayColor={'#f0efefff'} style={s.modalCloseButton} onPress={onClose}>
              <Text style={{ color: 'black' }}>Cancelar</Text>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={'rgba(42, 42, 42, 0.9)'}
              style={s.modalAddButton}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white' }}>Guardar</Text>}
            </TouchableHighlight>
          </View>
        </View>
      </View>

      {/* Date picker modal */}
      <Modal
        animationType="fade"
        visible={dateModalVisible}
        backdropColor={'rgba(0, 0, 0, 0)'}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={s.datePickerModal}>
          <View style={s.datePickerModalView}>
            <Calendar
              theme={{
                todayTextColor: 'white',
                arrowColor: '#000000ff',
                todayBackgroundColor: '#a8a8a8ff',
              }}
              onDayPress={day => {
                if (day.dateString < getLocalDateString()) {
                  wrongDate();
                  return;
                }
                setDate(day.dateString);
                setDateModalVisible(false);
              }}
              markedDates={{
                [date]: { selected: true, selectedColor: '#000000ff' },
              }}
            />

            <View style={s.modalButtons}>
              <TouchableHighlight
                underlayColor={'#f0efefff'}
                style={s.modalCloseButton}
                onPress={() => {
                  setDateModalVisible(false);
                }}
              >
                <Text style={{ color: 'black' }}>Cancelar</Text>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor={'rgba(42, 42, 42, 0.9)'}
                style={s.modalAddButton}
                onPress={() => setDateModalVisible(false)}
              >
                <Text style={{ color: 'white' }}>Aceptar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
