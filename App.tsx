import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import TodoInfo from './screens/TodoInfo';
import { RootStackParamList } from './types/navigation';
import { SQLiteProvider } from 'expo-sqlite';
import { initDB } from './database/init';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  return (
    <SQLiteProvider databaseName="todos.db" onInit={initDB}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Todo" component={TodoInfo} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}