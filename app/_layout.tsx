import React, { useEffect } from 'react';
import { Stack } from 'expo-router';

export default function Layout() {

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false, // Disable headers globally
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="CoffeeList" />
      <Stack.Screen name="CoffeeDetail" />
      <Stack.Screen name="AddCoffee" />
    </Stack>
  );
}

