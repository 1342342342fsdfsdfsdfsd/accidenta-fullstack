import React from 'react';
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { Card, CardContent } from './Card';

interface EstadisticasCardProps {
  title: string;
  content: string | number | React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: TextStyle;
}

export const EstadisticasCard: React.FC<EstadisticasCardProps> = ({
  title,
  content,
  style,
  titleStyle,
  contentStyle,
}) => {
  return (
    <Card style={[styles.card, style]}>
      <CardContent>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.content, contentStyle]}>{content}</Text>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#34c25d',
  },
  content: {
    fontSize: 16,
    color: '#555',
  },
});
