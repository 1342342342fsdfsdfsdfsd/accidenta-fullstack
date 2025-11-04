import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  getTipoAccidenteTop,
  getTopZone,
  getTotalAccidents,
} from 'src/services/estadisticasService';
import { TipoAccidenteTopType } from 'src/types/types';
import { EstadisticasCard } from '../componentes/EstadisticaCard';

type Filtro = 'day' | 'week' | 'month';

const EstadisticasScreen = () => {
  const [filtro, setFiltro] = useState<Filtro>('day');
  const [loading, setLoading] = useState(true);

  // Estados de datos
  const [tipoAccidente, setTipoAccidente] = useState<TipoAccidenteTopType | null>(null);
  const [totalAccidentes, setTotalAccidentes] = useState<number>(0);
  const [zona, setZona] = useState<{ zone: string | null; amount: number }>({
    zone: null,
    amount: 0,
  });

  const handleFiltro = (valor: Filtro) => {
    setFiltro(valor);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tipoRes, totalRes, zonaRes] = await Promise.all([
          getTipoAccidenteTop(filtro),
          getTotalAccidents(filtro),
          getTopZone(filtro),
        ]);

        // Tipo accidente
        if (tipoRes.type) {
          const formattedTipo =
            tipoRes.type.charAt(0).toUpperCase() + tipoRes.type.slice(1).toLowerCase();
          setTipoAccidente({ type: formattedTipo, amount: tipoRes.amount });
        } else {
          setTipoAccidente(null);
        }

        // Total accidentes
        setTotalAccidentes(totalRes.amount ?? 0);

        // Zona
        setZona({ zone: zonaRes.zone ?? '—', amount: zonaRes.amount });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setTipoAccidente(null);
        setTotalAccidentes(0);
        setZona({ zone: '—', amount: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filtro]);

  return (
    <View style={styles.container1}>
      {/* Botones de filtro */}
      <View style={styles.containerBotones}>
        {(['day', 'week', 'month'] as Filtro[]).map((valor) => (
          <TouchableOpacity
            key={valor}
            style={[styles.boton, filtro === valor && styles.botonActivo]}
            onPress={() => handleFiltro(valor)}
          >
            <Text style={filtro === valor ? styles.textoActivo : styles.texto}>
              {valor === 'day' ? 'Último Día' : valor === 'week' ? 'Última Semana' : 'Último Mes'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.containerCards}>
        <EstadisticasCard
          title="Tipo de accidente más frecuente:"
          content={
            loading
              ? 'Cargando...'
              : tipoAccidente
                ? `${tipoAccidente.type} (${tipoAccidente.amount} reportes)`
                : 'Sin reportes'
          }
        />
        <EstadisticasCard
          title="Ubicación con más accidentes:"
          content={
            loading
              ? 'Cargando...'
              : zona && zona.zone && zona.amount > 0
                ? `${zona.zone} (${zona.amount} reportes)`
                : 'Sin reportes'
          }
        />
        <EstadisticasCard
          title="Total de accidentes reportados:"
          content={loading ? 'Cargando...' : `${totalAccidentes}`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    paddingHorizontal: 18,
  },
  containerBotones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  containerCards: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ddd',
    borderRadius: 10,
    height: 40,
  },
  botonActivo: {
    backgroundColor: '#34c25d',
  },
  texto: {
    color: '#333',
    fontWeight: '500',
  },
  textoActivo: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default EstadisticasScreen;
