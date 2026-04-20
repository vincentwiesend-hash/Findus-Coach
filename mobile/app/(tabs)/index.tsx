import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/lib/store';
import { MetricCard } from '@/components/MetricCard';
import { WorkoutCard } from '@/components/WorkoutCard';

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const analytics = state.analytics;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>FINDUS</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Daily Performance Overview</Text>
      </View>
      <View style={styles.grid}>
        <MetricCard label="VO2 Max" value={`${analytics.vo2Max.value}`} sub={analytics.vo2Max.status} />
        <MetricCard label="HRV" value={`${analytics.hrv.current.value} ms`} sub={analytics.hrv.current.status} />
        <MetricCard label="Readiness" value={`${analytics.trainingReadiness.value}%`} sub={analytics.trainingReadiness.status} />
        <MetricCard label="Sleep" value={`${analytics.sleepScore.value}%`} sub={analytics.sleepScore.status} />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Heute</Text>
      <WorkoutCard title="Recovery Run" subtitle="40 min locker · Zone 2" accent={colors.primary} />
      <WorkoutCard title="Mobility" subtitle="10 min Hüfte / Waden / Rücken" accent={colors.success} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: 1 },
  subtitle: { marginTop: 4, fontSize: 14 },
  grid: { paddingHorizontal: 20, gap: 12 },
  sectionTitle: { paddingHorizontal: 20, marginTop: 24, marginBottom: 12, fontSize: 18, fontWeight: '700' },
});
