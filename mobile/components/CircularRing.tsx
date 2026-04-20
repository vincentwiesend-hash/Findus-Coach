import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function CircularRing({ label, value, color }: { label: string; value: string; color?: string }) {
  const colors = useColors();
  const accent = color ?? colors.primary;
  return (
    <View style={[styles.wrap, { borderColor: accent, backgroundColor: colors.card }]}>
      <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 120, height: 120, borderRadius: 999, borderWidth: 8, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 22, fontWeight: '800' },
  label: { fontSize: 11, marginTop: 4 },
});
