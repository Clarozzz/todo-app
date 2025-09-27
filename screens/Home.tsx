import { Keyboard, Modal, Pressable, ScrollView, Text, TextInput, TextStyle, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import s from '../style';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const todos = [
  { id: 1, title: 'Tarea 1', completed: 'Completado', description: 'Revisar y enviar el informe semanal', deadline: '2025-11-20' },
  { id: 2, title: 'Tarea 2', completed: 'En proceso', description: 'Preparar presentación para el cliente', deadline: '2025-12-15' },
  { id: 3, title: 'Tarea 3', completed: 'Pendiente', description: 'Actualizar la base de datos de usuarios', deadline: '2025-10-25' },
  { id: 4, title: 'Tarea 4', completed: 'Completado', description: 'Responder correos pendientes', deadline: '2025-12-05' },
  { id: 5, title: 'Tarea 5', completed: 'En proceso', description: 'Diseñar la interfaz de la nueva sección', deadline: '2026-01-10' },
  { id: 6, title: 'Tarea 6', completed: 'Pendiente', description: 'Revisar bugs reportados por QA', deadline: '2025-11-30' },
  { id: 7, title: 'Tarea 7', completed: 'Pendiente', description: 'Cancelar la reunión de planificación', deadline: '2025-10-20' },
  { id: 8, title: 'Tarea 8', completed: 'En proceso', description: 'Actualizar documentación del proyecto', deadline: '2025-12-01' },
  { id: 9, title: 'Tarea 9', completed: 'Pendiente', description: 'Configurar el servidor de prueba', deadline: '2026-01-25' },
  { id: 10, title: 'Tarea 10', completed: 'Completado', description: 'Enviar reporte de ventas al gerente', deadline: '2025-11-10' },
  { id: 11, title: 'Tarea 11', completed: 'En proceso', description: 'Probar nueva funcionalidad en staging', deadline: '2026-02-05' },
  { id: 12, title: 'Tarea 12', completed: 'Pendiente', description: 'Preparar agenda para la reunión de equipo', deadline: '2025-12-18' },
  { id: 13, title: 'Tarea 13', completed: 'Completado', description: 'Revisar y aprobar cambios en el repositorio', deadline: '2025-11-25' },
  { id: 14, title: 'Tarea 14', completed: 'En proceso', description: 'Redactar borrador de la propuesta del cliente', deadline: '2026-01-15' },
  { id: 15, title: 'Tarea 15', completed: 'Pendiente', description: 'Organizar archivos y documentos del proyecto', deadline: '2025-10-28' },
];

const getBoxStyle: Record<string, object> = {
  'Completado': s.todoCompleted,
  'En proceso': s.todoInProgress,
}

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const descriptionRef = useRef<TextInput>(null);
  const dateRef = useRef<TextInput>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={s.page}>
      <Modal
        animationType="fade"
        visible={modalVisible}
        backdropColor={'rgba(0, 0, 0, 0)'}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
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
              <TextInput
                style={s.modalInput}
                maxLength={30}
                returnKeyType='next'
                placeholder='Escribe un titulo...'
                onSubmitEditing={() => dateRef.current?.focus()}
                submitBehavior='submit'
              />
            </View>

            <View style={s.inputLabel}>
              <Text style={s.inputText}>
                Fecha
              </Text>
              <TextInput
                ref={dateRef}
                style={s.modalInput}
                maxLength={30}
                returnKeyType='next'
                placeholder='Escribe un titulo...'
                onSubmitEditing={() => descriptionRef.current?.focus()}
                submitBehavior='submit'
              />
            </View>

            <View style={s.inputLabel}>
              <Text style={s.inputText}>
                Descripción
              </Text>
              <TextInput
                ref={descriptionRef}
                style={[s.modalInput, { height: 75, textAlignVertical: 'top' }]}
                multiline={true}
                numberOfLines={3}
                maxLength={140}
                returnKeyType='done'
                placeholder='Describe la tarea...'
                submitBehavior='submit'
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            <View style={s.modalButtons}>

              <TouchableHighlight
                underlayColor={'#f0efefff'}
                style={s.modalCloseButton} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={{ color: 'black' }}>
                  Cancelar
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor={'rgba(42, 42, 42, 0.9)'}
                style={s.modalAddButton} onPress={() => alert('You pressed a button.')}>
                <Text style={{ color: 'white' }}>
                  Agregar
                </Text>
              </TouchableHighlight>

            </View>
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        underlayColor={'rgba(42, 42, 42, 0.9)'}
        style={s.modalOpenButton} onPress={() => setModalVisible(true)}>
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