import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, ActivityIndicator, Alert, TouchableHighlight } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import s from '../style';

type ConfirmDeleteModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titleToMatch: string;
  loading?: boolean;
};

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onConfirm,
  titleToMatch,
  loading
}: ConfirmDeleteModalProps) {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    if (inputValue.trim().toLowerCase() === titleToMatch.toLowerCase()) {
      onConfirm();
      setInputValue('');
    } else {
      Alert.alert("Validación", "El nombre ingresado no coincide.");
    }
  };

  const isMatch = inputValue.trim().toLowerCase() === titleToMatch.toLowerCase();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      backdropColor={'rgba(0,0,0,0)'}
    >
      <View style={s.modal}>
        <View style={s.modalView}>
          <View style={s.modalHeader}>
            <Text style={s.title1}>Confirmar eliminación</Text>
            <Pressable style={s.exitButton} onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>

          <Text style={{ marginVertical: 15 }}>
            Escribe <Text style={{ fontWeight: 'bold' }}>{titleToMatch}</Text> para confirmar:
          </Text>

          <TextInput
            style={[s.modalInput, { borderColor: isMatch ? '#4caf50' : '#ccc' }]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Nombre de la tarea..."
            autoFocus={true}
          />

          <View style={s.modalButtons}>
            <TouchableHighlight
              underlayColor={'#f0efefff'}
              style={s.modalCloseButton} onPress={onClose}>
              <Text style={{ color: 'black' }}>
                Cancelar
              </Text>
            </TouchableHighlight>

            <Pressable
              style={[s.modalAddButton, { backgroundColor: "#de0029ff",opacity: isMatch ? 1 : 0.5 }]}
              onPress={handleConfirm}
              disabled={!isMatch || loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white' }}>Eliminar</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}