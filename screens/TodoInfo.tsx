import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import s from '../style'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type TodoRouteProp = RouteProp<RootStackParamList, 'Todo'>;

export default function TodoInfo() {
  const { params } = useRoute<TodoRouteProp>();

  return (
    <SafeAreaView style={s.page}>
      <View style={s.container}>
        <Text>{params.title}</Text>
      </View>
    </SafeAreaView>
  )
}