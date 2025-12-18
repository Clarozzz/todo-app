import { View, Text } from 'react-native'
import s from '../style';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function () {
  return (
    <View style={s.noTodos}>
      <MaterialCommunityIcons name="clipboard-clock-outline" size={60} color="#a5a5a5" />
      <Text style={s.noTodosText}>
        No hay tareas pendientes
      </Text>
    </View>
  )
}
