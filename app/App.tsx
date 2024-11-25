// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import * as Notifications from 'expo-notifications';

// import HomeScreen from './screens/HomeScreen';
// import CoffeeListScreen from './screens/CoffeeListScreen';
// import CoffeeDetailScreen from './screens/CoffeeDetailScreen';
// import AddCoffeeScreen from './screens/AddCoffeeScreen';

// const Stack = createStackNavigator();

// export default function App() {
//     useEffect(() => {
//         // Request notification permissions
//         const requestPermissions = async () => {
//             const { status } = await Notifications.getPermissionsAsync();
//             if (status !== 'granted') {
//                 const { status: newStatus } = await Notifications.requestPermissionsAsync();
//                 if (newStatus !== 'granted') {
//                     console.warn('Notification permissions not granted.');
//                 }
//             }
//         };

//         requestPermissions();
//     }, []);

//     useEffect(() => {
//         // Listen for notifications
//         const subscription = Notifications.addNotificationReceivedListener((notification) => {
//             console.log('Notification Received:', notification);
//         });

//         return () => subscription.remove(); // Clean up the subscription on unmount
//     }, []);

//     return (
//         <NavigationContainer>
//             <Stack.Navigator initialRouteName="Home">
//                 <Stack.Screen name="Home" component={HomeScreen} />
//                 <Stack.Screen name="CoffeeList" component={CoffeeListScreen} />
//                 <Stack.Screen name="CoffeeDetail" component={CoffeeDetailScreen} />
//                 <Stack.Screen name="AddCoffee" component={AddCoffeeScreen} />
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }
