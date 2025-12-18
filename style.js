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
  title5: {
    fontSize: 18,
    fontWeight: '450',
    color: 'rgba(85, 85, 85, 1)'
  },
  title6: {
    color: 'rgba(105, 105, 105, 1)'
  },
  todoContainer: {
    marginTop: 16,
    gap: 12,
    marginBottom: 40
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
    color: '#606060',
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
    color: 'black',
  },
  filterButton: {
    marginLeft: 4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    paddingEnd: 0
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
  todoInfoButtons: {
    flexDirection: 'row',
    padding: 10,
    height: 70,
    gap: 12,
  },
  modalInput: {
    backgroundColor: '#f0efefff',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: 'black',
  },
  inputLabel: {
    marginTop: 12,
  },
  inputText: {
    fontSize: 16,
    marginBottom: 4,
  },
  todoDeadline: {
    color: '#808080ff',
    fontSize: 15,
  },
  datePickerModalButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0efefff',
  },
  datePickerModalButtonContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  datePickerModalOpenButtonText: {
    color: 'black',
    fontSize: 15,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 500
  },
  title4: {
    fontSize: 30,
    fontWeight: 600
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  todoState: {
    padding: 8,
    borderRadius: 10
  },
  infoBox: {
    borderRadius: 15,
    padding: 15,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gapper: {
    marginBottom: 25
  },
  dateBoxIcon: {
    backgroundColor: '#eeeeeeff',
    padding: 15,
    borderRadius: 10,
    marginRight: 20
  },
  dateBoxText: {
    gap: 3
  },
  separetion: {
    flex: 1,
    alignItems: ''
  },
  todoOptions: {
    gap: 15,
    marginTop: 20
  },
  deleteButton: {
    width: '100%',
    backgroundColor: '#de0029ff',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center'
  },
  editButton: {
    width: '100%',
    backgroundColor: 'black',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center'

  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  filterOptionButton: {
    padding: 10,
    borderRadius: 8,
  },
  textRed: {
    color: "#d50329ff"
  },
  exitButton: {
    padding: 8
  },
  noTodos: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noTodosText: {
    color: "#a5a5a5",
    fontSize: 18,
    marginTop: 15
  },
  dropdown: {
    height: 40,
    width: 140,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});