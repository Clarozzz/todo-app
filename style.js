import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingTop: 20,
    paddingHorizontal: 24,
    flex: 1,
  },
  title1: {
    fontSize: 24,
    fontWeight: '600',
  },
  title2: {
    fontSize: 16,
    fontWeight: '500',
  },
  title3: {
    fontSize: 20,
    fontWeight: '500',
  },
  todoContainer: {
    marginTop: 16,
    gap: 12,
    marginBottom: 40,
  },
  todoBox: {
    padding: 16,
    borderRadius: 8,
    height: 100,
    justifyContent: 'space-between',
  },
  todoCompleted: {
    backgroundColor: '#ddffddff',
    color: '#31df2cff',
  },
  todoInProgress: {
    backgroundColor: '#ede0ffff',
    color: '#453bffff',
  },
  todoDefault: {
    backgroundColor: '#f3f3f3ff',
    color: '#000000ff',
  },
  todoTextIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoDescription: {
    marginTop: 8
  },
  todoDescriptionText: {
    color: '#606060ff',
  },
  searchAndFilters: {
    marginTop: 10,
    flexDirection: 'row',
  },
  input: {
    backgroundColor: '#f0efefff',
    borderRadius: 20,
    paddingHorizontal: 16,
    flex: 8,
  },
  filterButton: {
    marginLeft: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOpenButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'black',
    zIndex: 10,
    padding: 16,
    borderRadius: 50,
    elevation: 4,
  },
  modalOpenButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalOpenButtonText: {
    color: 'white',
    fontSize: 15,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  datePickerModal: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  datePickerModalView: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 10
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    flex: 1,
    marginHorizontal: 24,
  },
  modalCloseButton: {
    borderRadius: 8,
    padding: 10,
    width: '100',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalAddButton: {
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'black',
    width: '100',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 25,
    height: 45,
  },
  modalInput: {
    backgroundColor: '#f0efefff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  inputLabel: {
    marginTop: 12,
  },
  inputText: {
    fontSize: 16,
  },
  todoDeadline: {
    color: '#808080ff',
    fontSize: 11,
  },
  datePickerModalButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0efefff',
  },
  datePickerModalButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerModalOpenButtonText: {
    color: 'black',
    fontSize: 15,
  }
});