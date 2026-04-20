import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/lib/store';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, setState } = useApp() as any;
  const [athleteId, setAthleteId] = useState(state.intervalsCredentials?.athleteId ?? '');
  const [apiKey, setApiKey] = useState(state.intervalsCredentials?.apiKey ?? '');

  function saveCredentials() {
    setState?.((prev: any) => ({
      ...prev,
      intervalsCredentials: { athleteId, apiKey },
    }));
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>EINSTELLUNGEN</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Integrationen & Präferenzen</Text>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Intervals.icu Integration</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.inputLabel, { color: colors.foreground }]}>Athlete ID</Text>
        <TextInput
          value={athleteId}
          onChangeText={setAthleteId}
          placeholder="i12345"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          style={[styles.textInput, { color: colors.foreground, borderColor: colors.border }]}
        />
        <Text style={[styles.inputLabel, { color: colors.foreground, marginTop: 12 }]}>API Key</Text>
        <TextInput
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Intervals.icu API Key"
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry
          autoCapitalize="none"
          style={[styles.textInput, { color: colors.foreground, borderColor: colors.border }]}
        />
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={saveCredentials}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Speichern</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 24 }]}>App Info</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoKey, { color: colors.mutedForeground }]}>Version</Text>
          <Text style={[styles.infoVal, { color: colors.foreground }]}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoKey, { color: colors.mutedForeground }]}>KI-Modell</Text>
          <Text style={[styles.infoVal, { color: colors.foreground }]}>Groq Llama 3.3 70B</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginBottom: 24 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: 1 },
  subtitle: { marginTop: 4, fontSize: 14 },
  sectionLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  card: { borderWidth: 1, borderRadius: 18, padding: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  textInput: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15 },
  saveBtn: { marginTop: 16, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoKey: { fontSize: 14 },
  infoVal: { fontSize: 14, fontWeight: '600' },
});
