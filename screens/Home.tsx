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
import { getBoxStyle, getLocalDateString } from '../functions/functions';
import TodoOptions from '../components/TodoOptions';

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
  const [optionsModal, setOptionsModal] = useState(false);
  const [todoId, setTodoId] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'En proceso' | 'Pendiente' | 'Completado'>('Todos');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<'prioritario' | 'no_prioritario'>('prioritario');



  const dateRef = useRef<TextInput>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const db = useSQLiteContext();

  useDrizzleStudio(db);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTodos(db);
      setTodos(result);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      Alert.alert("Error", "No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    let tempTodos = [...todos];

    // Filtrado por estado
    if (filterStatus !== 'Todos') {
      tempTodos = tempTodos.filter(todo => todo.completed === filterStatus);
    }

    // Búsqueda por título
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      tempTodos = tempTodos.filter(todo => todo.title.toLowerCase().includes(q));
    }

    // Orden por fecha
    tempTodos.sort((a, b) => {
      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      return sortOrder === 'prioritario' ? dateA - dateB : dateB - dateA;
    });

    setFilteredTodos(tempTodos);
  }, [todos, searchQuery, filterStatus, sortOrder]);



  const { control, handleSubmit, formState: { errors }, reset, clearErrors } = useForm({
    resolver: yupResolver(schema)
  });

  async function onSubmit(data: { title: string; description?: string | null }) {
    setLoading(true);
    try {
      await addTodo(db, data.title, date, data.description ?? '', getLocalDateString())
      fetchTodos();
      closeNewTaskModal();
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
    } finally {
      setLoading(false)
    }
  }

  function closeNewTaskModal() {
    setNewTaskModalVisible(false);
    setDate(getLocalDateString())
    reset();
    clearErrors();
  }

  function wrongDate() {
    Alert.alert('Error', 'La fecha no puede ser anterior a la actual.', [{ text: 'Aceptar' }])
  }

  if (loading) return <ActivityIndicator style={s.loading} size="large" />

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
                    placeholderTextColor="#767676ff"
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
                    placeholderTextColor="#767676ff"
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

      <Modal
        animationType="fade"
        visible={filterModalVisible}
        backdropColor={'rgba(0, 0, 0, 0)'}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={s.modal}>
          <View style={s.modalView}>
            <View style={s.modalHeader}>
              <Text style={s.title1}>Filtrar tareas</Text>
              <Pressable onPress={() => setFilterModalVisible(false)}>
                <AntDesign name="close" size={24} color="black" />
              </Pressable>
            </View>

            <Text style={[s.title6, { marginVertical: 10 }]}>Estado</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              {['Todos', 'En proceso', 'Pendiente', 'Completado'].map(status => (
                <TouchableHighlight
                  key={status}
                  style={[
                    s.filterOptionButton,
                    filterStatus === status && { backgroundColor: '#484848ff' }
                  ]}
                  underlayColor="#ddd"
                  onPress={() => setFilterStatus(status as typeof filterStatus)}
                >
                  <Text style={{ color: filterStatus === status ? 'white' : 'black' }}>
                    {status}
                  </Text>
                </TouchableHighlight>
              ))}
            </View>

            <Text style={[s.title6, { marginVertical: 10 }]}>Ordenar por fecha</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: 'Prioritario', value: 'prioritario' },
                { label: 'Menos prioritario', value: 'no_prioritario' }
              ].map(order => (
                <TouchableHighlight
                  key={order.value}
                  style={[
                    s.filterOptionButton,
                    sortOrder === order.value && { backgroundColor: '#484848ff' }
                  ]}
                  underlayColor="#ddd"
                  onPress={() => setSortOrder(order.value as 'prioritario' | 'no_prioritario')}
                >
                  <Text style={{ color: sortOrder === order.value ? 'white' : 'black' }}>
                    {order.label}
                  </Text>
                </TouchableHighlight>
              ))}
            </View>

            <View style={s.modalButtons}>
              <TouchableHighlight
                underlayColor={'#f0efefff'}
                style={s.modalCloseButton}
                onPress={() => {
                  setFilterModalVisible(false);
                  setFilterStatus('Todos');
                  setSortOrder('prioritario');
                }}
              >
                <Text style={{ color: 'black' }}>Limpiar</Text>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor={'rgba(42, 42, 42, 0.9)'}
                style={s.modalAddButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={{ color: 'white' }}>Aplicar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <TodoOptions
        isOpen={optionsModal}
        onClose={() => setOptionsModal(false)}
        id={todoId}
        onDeleted={fetchTodos}
      />

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
            placeholderTextColor="#767676ff"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable style={s.filterButton} onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="filter-sharp" size={26} color="black" />
          </Pressable>
        </View>

        <View style={s.todoContainer}>
          {filteredTodos.map(todo => (
            <Pressable
              key={todo.id}
              onPress={() => navigation.navigate('Todo', todo)}
              onLongPress={() => { setOptionsModal(true); setTodoId(todo.id) }}
            >
              <View style={[s.todoBox, getBoxStyle[todo.completed] || s.todoDefault]}>
                <View style={s.todoTextIcon}>
                  <Text style={s.title2}>{todo.title}</Text>
                  {todo.completed === 'Completado' ? (
                    <Ionicons name="checkmark-circle" size={35} color={(s.todoCompleted as TextStyle).color} />
                  ) : (
                    <Text style={getBoxStyle[todo.completed]}>{todo.completed}</Text>
                  )}
                </View>
                <View style={s.todoDescription}>
                  <Text numberOfLines={1} style={s.todoDescriptionText}>
                    {todo.description}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}