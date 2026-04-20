import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/lib/store';

const SUGGESTIONS = [
  'Soll ich heute Intervalle laufen?',
  'Wie ist meine Erholung diese Woche?',
  'Was empfiehlst du vor einem Wettkampf?',
];

export default function CoachScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('Frag mich nach Training, Regeneration oder deinem Wochenplan.');
  const [loading, setLoading] = useState(false);

  async function askCoach(text?: string) {
    const q = text ?? prompt;
    if (!q.trim()) return;
    try {
      setLoading(true);
      const apiBase = (process.env.EXPO_PUBLIC_API_URL ?? '') + '/api/chat';
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q }),
      });
      const data = await res.json();
      setAnswer(data.content ?? data.error ?? 'Keine Antwort erhalten.');
    } catch {
      setAnswer('Coach aktuell nicht erreichbar. Prüfe API-Server und Netzwerk.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>COACH</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Dein KI-Trainingsassistent · Groq Llama 3.3</Text>
        </View>

        {/* Suggestions */}
        <View style={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => { setPrompt(s); askCoach(s); }}
              style={[styles.chip, { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}44` }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, { color: colors.primary }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Frage stellen..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            style={[styles.input, { color: colors.foreground }]}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => askCoach()}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Fragen</Text>}
          </TouchableOpacity>
        </View>

        {/* Answer */}
        <View style={[styles.answerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.answerLabel, { color: colors.mutedForeground }]}>Antwort</Text>
          <Text style={[styles.answerText, { color: colors.foreground }]}>{answer}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: 1 },
  subtitle: { marginTop: 4, fontSize: 13 },
  suggestions: { gap: 8, marginBottom: 16 },
  chip: { borderWidth: 1, borderRadius: 24, paddingVertical: 8, paddingHorizontal: 14 },
  chipText: { fontSize: 13, fontWeight: '600' },
  inputCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 16 },
  input: { minHeight: 100, fontSize: 16, textAlignVertical: 'top' },
  button: { marginTop: 14, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  answerCard: { borderWidth: 1, borderRadius: 18, padding: 16 },
  answerLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  answerText: { fontSize: 16, lineHeight: 26 },
});
