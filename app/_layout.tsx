import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function Layout() {
  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          console.warn('Notification permissions not granted.');
        }
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    // Listen for notifications
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification Received:', notification);
    });

    return () => subscription.remove(); // Clean up the subscription on unmount
  }, []);

  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="CoffeeList" />
      <Stack.Screen name="CoffeeDetail" />
      <Stack.Screen name="AddCoffee" />
    </Stack>
  );
}

