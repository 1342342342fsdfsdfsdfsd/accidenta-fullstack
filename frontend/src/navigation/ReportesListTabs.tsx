import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ReportesComoAccidentadoListScreen from '../screens/ReportesComoAccidentadoListScreen';
import ReportesCreadosListScreen from '../screens/ReportesCreadosListScreen';

export type ReportesTopTabParamList = {
  MisReportesCreados: undefined;
  ReportesComoAccidentado: undefined;
};

const TopTab = createMaterialTopTabNavigator<ReportesTopTabParamList>();

export default function ReportesTopTabs() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: '#34c25d',
          height: 3,
        },
      }}
    >
      <TopTab.Screen
        name="MisReportesCreados"
        component={ReportesCreadosListScreen}
        options={{
          title: 'Reportes Creados',
        }}
      />
      <TopTab.Screen
        name="ReportesComoAccidentado"
        component={ReportesComoAccidentadoListScreen}
        options={{
          title: 'Como Accidentado',
        }}
      />
    </TopTab.Navigator>
  );
}
