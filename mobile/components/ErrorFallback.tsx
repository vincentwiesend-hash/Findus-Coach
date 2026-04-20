import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ErrorFallback({ message = 'Etwas ist schiefgelaufen.' }: { message?: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fehler</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  message: { fontSize: 15, textAlign: 'center', color: '#797876' },
});
