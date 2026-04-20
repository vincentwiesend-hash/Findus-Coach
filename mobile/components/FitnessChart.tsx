import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WellnessEntry } from '@/types';
import { useColors } from '@/hooks/useColors';

export function FitnessChart({ wellness, showDays = 42 }: { wellness: WellnessEntry[]; showDays?: number }) {
  const colors = useColors();
  const data = wellness.slice(-showDays);
  if (data.length === 0) return null;
  const maxVal = Math.max(...data.map((w) => Math.max(w.ctl, w.atl)), 1);

  return (
    <View style={styles.wrap}>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>CTL</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FBBF24' }]} />
          <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>ATL</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>TSB</Text>
        </View>
      </View>
      <View style={styles.chartRow}>
        {data.map((w, i) => (
          <View key={i} style={styles.col}>
            <View style={[styles.bar, { flex: w.ctl / maxVal, backgroundColor: colors.success, opacity: 0.8 }]} />
            <View style={[styles.bar, { flex: w.atl / maxVal, backgroundColor: '#FBBF24', opacity: 0.8 }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  legendRow: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12 },
  chartRow: { height: 140, flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  col: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 1, height: '100%' },
  bar: { width: '48%', borderTopLeftRadius: 3, borderTopRightRadius: 3 },
});
