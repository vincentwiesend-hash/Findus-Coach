import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function WorkoutCard({ title, subtitle, accent }: { title: string; subtitle: string; accent: string }) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, marginBottom: 10, borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 999 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { marginTop: 4, fontSize: 14 },
});
