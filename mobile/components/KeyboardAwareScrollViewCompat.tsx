import React from 'react';
import { Platform, ScrollView, ScrollViewProps } from 'react-native';

export function KeyboardAwareScrollViewCompat(props: ScrollViewProps) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      {...props}
    />
  );
}
