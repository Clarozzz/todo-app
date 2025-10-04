import { ActivityIndicator, Alert, Keyboard, Modal, Pressable, ScrollView, Text, TextInput, TextStyle, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import s from '../style';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useSQLiteContext } from 'expo-sqlite';
import { Todo } from '../types/object-types';
import { addTodo, getTodos } from '../database/queries';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Feather from '@expo/vector-icons/Feather';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

const getBoxStyle: Record<string, object> = {
  'Completado': s.todoCompleted,
  'En proceso': s.todoInProgress,
}

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const schema = yup.object({
  title: yup.string()
    .required(),
  due_date: yup.string()
    .required(),
  description: yup.string()
    .notRequired()
    .max(140, 'La descripción no puede tener más de 140 caracteres'),
});


export default function Home() {
  const [newTaskModalVisible, setNewTaskModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [date, setDate] = useState(getLocalDateString());
  const [loading, setLoading] = useState(false);

  const dateRef = useRef<TextInput>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const db = useSQLiteContext();

  function getLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useDrizzleStudio(db);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const result = await getTodos(db);
    setTodos(result);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const { control, handleSubmit, formState: { errors }, reset, clearErrors } = useForm({
    resolver: yupResolver(schema)
  });

  async function onSubmit(data: { title: string; due_date: string; description?: string | null }) {
    try {
      setLoading(true);
      await addTodo(db, data.title, data.due_date, data.description ?? '')
      fetchTodos();
      closeNewTaskModal();
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
    }
  }

  function closeNewTaskModal() {
    setNewTaskModalVisible(false);
    setDate(getLocalDateString())
    reset();
    clearErrors();
  }

  function wrongDate() {
    Alert.alert('Error', 'La fecha no puede ser anterior a la actual.', [{ text: 'Aceptar'}])
  }

  if (loading) return <ActivityIndicator style={s.loading} size="large" />;

  return (
    <SafeAreaView style={s.page}>
      <Modal
        animationType="fade"
        visible={newTaskModalVisible}
        backdropColor={'rgba(0, 0, 0, 0)'}
        onRequestClose={() => {
          setNewTaskModalVisible(!newTaskModalVisible);
        }}
      >
        <View style={s.modal}>
          <View style={s.modalView}>

            <Text style={[s.title1, { marginBottom: 8 }]}>
              Nueva tarea
            </Text>

            <View style={s.inputLabel}>
              <Text style={s.inputText}>
                Título
              </Text>
              <Controller
                control={control}
                name="title"
                defaultValue=""
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={s.modalInput}
                    maxLength={30}
                    returnKeyType="next"
                    placeholder="Escribe un título..."
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.title && <Text style={s.errorText}>Este campo es obligatorio</Text>}
            </View>

            <View style={s.inputLabel}>
              <Text style={s.inputText}>
                Fecha
              </Text>
              <TouchableHighlight
                underlayColor={'rgba(226, 226, 226, 1)'}
                style={s.datePickerModalButton} onPress={() => setDateModalVisible(true)}>
                <View style={s.datePickerModalButtonContent}>
                  <Feather name="calendar" size={24} color="black" />
                  <Text style={s.datePickerModalOpenButtonText}>
                    {date}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>

            <Controller
              control={control}
              name="due_date"
              defaultValue={date}
              render={({ field }) => (
                <TextInput
                  ref={dateRef}
                  style={{ display: 'none' }}
                  value={date}
                  onChangeText={field.onChange}
                />
              )}
            />

            <View style={s.inputLabel}>
              <Text style={s.inputText}>
                Descripción
              </Text>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextInput
                    style={[s.modalInput, { height: 79, textAlignVertical: 'top' }]}
                    multiline={true}
                    numberOfLines={3}
                    maxLength={140}
                    returnKeyType='done'
                    placeholder='Describe la tarea...'
                    submitBehavior='submit'
                    onSubmitEditing={() => Keyboard.dismiss()}
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                  />
                )}
              />
              {errors.description && <Text style={s.errorText}>{errors.description.message}</Text>}
            </View>

            <View style={s.modalButtons}>

              <TouchableHighlight
                underlayColor={'#f0efefff'}
                style={s.modalCloseButton} onPress={closeNewTaskModal}>
                <Text style={{ color: 'black' }}>
                  Cancelar
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor={'rgba(42, 42, 42, 0.9)'}
                style={s.modalAddButton} onPress={handleSubmit(onSubmit)}>
                <Text style={{ color: 'white' }}>
                  Agregar
                </Text>
              </TouchableHighlight>

            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        visible={dateModalVisible}
        backdropColor={'rgba(0, 0, 0, 0)'}
        onRequestClose={() => {
          setDateModalVisible(!dateModalVisible);
        }}
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
              }}
              markedDates={{
                [date]: { selected: true, selectedColor: '#000000ff' }
              }}
            />

            <View style={s.modalButtons}>

              <TouchableHighlight
                underlayColor={'#f0efefff'}
                style={s.modalCloseButton} onPress={() => { setDateModalVisible(!dateModalVisible); setDate(getLocalDateString()) }}>
                <Text style={{ color: 'black' }}>
                  Cancelar
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor={'rgba(42, 42, 42, 0.9)'}
                style={s.modalAddButton} onPress={() => setDateModalVisible(!dateModalVisible)}>
                <Text style={{ color: 'white' }}>
                  Aceptar
                </Text>
              </TouchableHighlight>

            </View>

          </View>
        </View>
      </Modal>

      <TouchableHighlight
        underlayColor={'rgba(42, 42, 42, 0.9)'}
        style={s.modalOpenButton} onPress={() => setNewTaskModalVisible(true)}>
        <View style={s.modalOpenButtonContent}>
          <AntDesign name="plus" size={20} color="white" />
          <Text style={s.modalOpenButtonText}>
            Nueva tarea
          </Text>
        </View>
      </TouchableHighlight>

      <ScrollView style={s.container}>
        <Text style={s.title1}>
          Tus tareas
        </Text>

        <View style={s.searchAndFilters}>
          <TextInput
            style={s.input}
            placeholder='Buscar tarea...'
          />
          <Pressable style={s.filterButton} onPress={() => alert('You pressed a button.')}>
            <Ionicons name="filter-sharp" size={26} color="black" />
          </Pressable>
        </View>

        <View style={s.todoContainer}>
          {
            todos.map(todo => (

              <Pressable key={todo.id} onPress={() => navigation.navigate('Todo', todo)}>
                <View style={[s.todoBox, getBoxStyle[todo.completed] || s.todoDefault]}>

                  <View>
                    <View style={s.todoTextIcon}>
                      <Text style={s.title2}>
                        {todo.title}
                      </Text>

                      {todo.completed === 'Completado'
                        ? (<Ionicons name="checkmark-circle" size={35} color={(s.todoCompleted as TextStyle).color} />)
                        : (
                          <View>
                            <Text style={getBoxStyle[todo.completed]}>
                              {todo.completed === 'Completado' ? null : todo.completed}
                            </Text>
                          </View>
                        )}
                    </View>
                  </View>

                  <View style={s.todoDescription}>
                    <Text numberOfLines={1} style={s.todoDescriptionText}>
                      {todo.description}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}