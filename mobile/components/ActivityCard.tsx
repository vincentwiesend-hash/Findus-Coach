import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity } from '@/types';
import { useColors } from '@/hooks/useColors';
import { formatDuration } from '@/lib/intervals';

export function ActivityCard({ activity }: { activity: Activity }) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.name, { color: colors.foreground }]}>{activity.name}</Text>
      <Text style={[styles.meta, { color: colors.mutedForeground }]}>
        {activity.type} · {formatDuration(activity.moving_time)}
        {activity.tss ? ` · TSS ${activity.tss}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, marginBottom: 10, borderWidth: 1, borderRadius: 18, padding: 16 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { marginTop: 4, fontSize: 14 },
});
