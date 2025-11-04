import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { AccidentReportDTO } from 'src/types/types';
import ReportPreview from './ReportPreview';

interface GenericListScreenProps {
  fetchFunction: (cursor?: string) => Promise<{ items: AccidentReportDTO[]; lastCursor?: string }>;
}

export default function ReportsList({ fetchFunction }: GenericListScreenProps) {
  const [data, setData] = useState<AccidentReportDTO[]>([]);
  const [lastCursor, setLastCursor] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadData = async (cursor?: string, append = false) => {
    try {
      if (append) setLoadingMore(true);
      if (!append) setInitialLoading(true);

      const response = await fetchFunction(cursor);
      setData((prev) => (append ? [...prev, ...response.items] : response.items));
      setLastCursor(response.lastCursor);
      setLoadingMore(response.lastCursor !== undefined);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setRefreshing(false);
      setInitialLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData(undefined, false);
  };

  const loadMore = () => {
    if (lastCursor && loadingMore) {
      loadData(lastCursor, true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [fetchFunction]),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#34c25d']} />
        }
        renderItem={({ item }) => <ReportPreview reporte={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color="#34c25d" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {initialLoading ? (
              <ActivityIndicator size="large" color="#34c25d" />
            ) : (
              <Text style={styles.emptyText}>No hay elementos aún.</Text>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    textAlign: 'center',
  },
  loader: {
    paddingVertical: 16,
  },
});
