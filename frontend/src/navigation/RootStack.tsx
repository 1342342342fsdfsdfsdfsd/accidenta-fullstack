import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportDetailScreen from 'src/screens/ReportDetailScreen';
import ReportesFormScreen from 'src/screens/ReporteFormScreen';
import { AccidentReportDTO, HealthDataDTO } from 'src/types/types';
import ContactosDeConfianzaScreen from '../screens/ContactosDeConfianzaScreen';
import TabNavigator from './TabNavigator';
import DatosDeSaludScreen from 'src/screens/DatosDeSaludScreen';

export type RootStackParamList = {
  Tabs: undefined;
  ContactosDeConfianza: undefined;
  'Formulario de reporte': undefined;
  ReportDetail: { reporte: AccidentReportDTO };
  DatosDeSalud: undefined;
  // ✅ Se vuelve a añadir la ruta para el formulario de creación
  DatosDeSaludForm: { initialData?: HealthDataDTO | null };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ContactosDeConfianza" component={ContactosDeConfianzaScreen} />
      <Stack.Screen name="Formulario de reporte" component={ReportesFormScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="DatosDeSalud" component={DatosDeSaludScreen} />
    </Stack.Navigator>
  );
}
