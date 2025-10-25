import { ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import s from '../style'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { getBoxStyle, getLocalDateString } from '../functions/functions';
import { Feather } from '@expo/vector-icons';
import { Shadow } from 'react-native-shadow-2';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TodoOptions from '../components/TodoOptions';
import { useState } from 'react';

type TodoRouteProp = RouteProp<RootStackParamList, 'Todo'>;
type TodoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Todo'>

const iconSize = 30;
const shadowDistance = 2;

export default function TodoInfo() {
  const [optionsModal, setOptionsModal] = useState(false);
  const { params } = useRoute<TodoRouteProp>();
  const navigation = useNavigation<TodoScreenNavigationProp>();

  return (
    <SafeAreaView style={[s.page, { flex: 1 }]}>

      <TodoOptions
        isOpen={optionsModal}
        onClose={() => setOptionsModal(false)}
        id={params.id}
      />

      <ScrollView style={s.container}>
        <View style={[s.todoHeader, s.gapper]}>
          <View style={{ flexShrink: 1 }}>
            <Text style={s.title4}>{params.title}</Text>
            <Text style={s.todoDeadline}>ID: {params.id}</Text>
          </View>
          <Text style={[s.todoState, s.todoDefault, getBoxStyle[params.completed]]}>
            {params.completed}
          </Text>
        </View>

        <Shadow style={s.gapper} distance={shadowDistance} stretch>
          <View style={s.infoBox}>
            <Text style={s.title5}>Descripción</Text>
            <Text style={s.title3}>{params.description}</Text>
          </View>
        </Shadow>

        <Shadow style={s.gapper} stretch distance={shadowDistance}>
          <View style={[s.infoBox, s.dateBox]}>
            <View style={s.dateBoxIcon}>
              <Feather name="calendar" size={iconSize} color="black" />
            </View>
            <View style={s.dateBoxText}>
              <Text style={s.title5}>Fecha límite:</Text>
              <Text
                style={[
                  s.title3,
                  getLocalDateString() >= params.due_date ? { color: 'red' } : null,
                ]}
              >
                {params.due_date}
              </Text>
            </View>
          </View>
        </Shadow>

        <Shadow style={s.gapper} stretch distance={shadowDistance}>
          <View style={[s.infoBox, s.dateBox]}>
            <View style={s.dateBoxIcon}>
              <Feather name="clock" size={iconSize} color="black" />
            </View>
            <View style={s.dateBoxText}>
              <Text style={s.title5}>Creada el:</Text>
              <Text style={s.title3}>{params.created_at}</Text>
            </View>
          </View>
        </Shadow>

      </ScrollView>

      <View style={s.todoInfoButtons}>
        <TouchableHighlight
          underlayColor={'#f0efefff'}
          style={s.modalCloseButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={{ color: 'black' }}>Regresar</Text>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor={'rgba(42, 42, 42, 0.9)'}
          style={s.modalAddButton}
          onPress={() => setOptionsModal(true)}
        >
          <Text style={{ color: 'white' }}>Opciones</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}