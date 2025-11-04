import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EstadisticasScreen from 'src/screens/EstadisticasScreen';
import HomeScreen from 'src/screens/HomeScreen';
import PerfilUser from '../screens/PerfilUser';
import ReportesListTabs from './ReportesListTabs';

const Tab = createBottomTabNavigator();

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Inicio: 'home-outline',
  Reportes: 'list-outline',
  'Mi perfil': 'person-outline',
  Estadísticas: 'stats-chart-outline',
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
        tabBarActiveTintColor: '#34c25d',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Reportes" component={ReportesListTabs} />
      <Tab.Screen name="Estadísticas" component={EstadisticasScreen} />
      <Tab.Screen name="Mi perfil" component={PerfilUser} />
    </Tab.Navigator>
  );
}
