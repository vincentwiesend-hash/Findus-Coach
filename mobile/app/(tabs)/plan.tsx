import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const WEEK = [
  { day: 'Montag', workout: 'Recovery + Mobility', type: 'easy' },
  { day: 'Dienstag', workout: 'Intervalllauf 6×3 min', type: 'hard' },
  { day: 'Mittwoch', workout: 'Locker Rad', type: 'easy' },
  { day: 'Donnerstag', workout: 'Tempo Run 30 min', type: 'medium' },
  { day: 'Freitag', workout: 'Ruhetag', type: 'rest' },
  { day: 'Samstag', workout: 'Long Run 90 min', type: 'hard' },
  { day: 'Sonntag', workout: 'Kraft + Core', type: 'medium' },
];

const typeColors: Record<string, string> = {
  easy: '#6daa45',
  medium: '#4f98a3',
  hard: '#EF4444',
  rest: '#797876',
};

export default function PlanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>PLAN</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Deine Trainingswoche</Text>
      </View>
      <View style={{ gap: 10, paddingHorizontal: 20 }}>
        {WEEK.map(({ day, workout, type }, i) => (
          <View
            key={day}
            style={[
              styles.row,
              {
                backgroundColor: i === dayIndex ? `${typeColors[type]}18` : colors.card,
                borderColor: i === dayIndex ? typeColors[type] : colors.border,
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: typeColors[type] }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.day, { color: colors.foreground }]}>{day}</Text>
              <Text style={[styles.workout, { color: colors.mutedForeground }]}>{workout}</Text>
            </View>
            {i === dayIndex && (
              <Text style={[styles.badge, { color: typeColors[type] }]}>Heute</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: 1 },
  subtitle: { marginTop: 4, fontSize: 14 },
  row: { borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 999 },
  day: { fontSize: 16, fontWeight: '700' },
  workout: { marginTop: 4, fontSize: 14 },
  badge: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
});
