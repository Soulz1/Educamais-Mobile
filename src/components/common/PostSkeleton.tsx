import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function PostSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.titleSkeleton} />
      <View style={styles.authorSkeleton} />
      <View style={styles.contentSkeleton} />
      <View style={[styles.contentSkeleton, { width: '80%' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  titleSkeleton: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  authorSkeleton: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
    width: '40%',
  },
  contentSkeleton: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 6,
  },
});
