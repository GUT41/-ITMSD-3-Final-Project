import { View, Text, StyleSheet } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <Text style={styles.placeholder}>Coming in Session 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 14,
    color: '#888',
  },
});