import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from 'src/navigation/RootStack';
import { AccidentReportDTO } from 'src/types/types';

interface ReportePreviewProps {
  reporte: AccidentReportDTO;
}

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReportDetail'>;

export default function ReportPreview({ reporte }: ReportePreviewProps) {
  const navigation = useNavigation<RootStackNavigationProp>();
  const handlePress = () => {
    navigation.navigate('ReportDetail', { reporte }); // 'ReportDetail' debe coincidir con el nombre exacto en RootStack
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <Text style={styles.tipo}>
          {reporte.tipoAccidente.charAt(0).toUpperCase() + reporte.tipoAccidente.slice(1)}
        </Text>
        <Text style={styles.text}>
          <Text style={{ fontWeight: 'bold' }}>DNI: </Text>
          {reporte.dni}
        </Text>
        <Text style={styles.text}>
          <Text style={{ fontWeight: 'bold' }}>Ubicación: </Text>
          {reporte.ubicacion}
        </Text>
        <Text style={styles.text}>
          <Text style={{ fontWeight: 'bold' }}>Descripción: </Text>
          {reporte.descripcion}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#00000033',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#34c25d',
  },
  tipo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#34c25d',
  },
  text: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
    lineHeight: 20,
  },
});
