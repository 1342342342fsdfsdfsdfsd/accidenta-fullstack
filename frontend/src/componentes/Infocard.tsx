import { StyleSheet, Text, View } from 'react-native';

type InfoCardProps = {
  title: string;
  value?: string | number;
};

export default function InfoCard({ title, value }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 2,
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: 'gray',
  },
  subtitle: {
    fontSize: 14,
  },
});
