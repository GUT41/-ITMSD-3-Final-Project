import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0F6E56',
        tabBarInactiveTintColor: '#888780',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bookmark" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}