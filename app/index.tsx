import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassWater, Plus, Coffee, CirclePlus } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/beans.jpg')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.4 }}
      >

        <Text style={styles.headerTitle}>Find your favorite coffee taste!</Text>
        <Text style={styles.headerSubtitle}>Find and add your favorite coffee recipes</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'hot' } })}
          >
            <Coffee size={32} color="black" />
            <Text style={styles.buttonText}>Hot Coffee</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'iced' } })}
          >
            <GlassWater size={32} color="black" />
            <Text style={styles.buttonText}>Iced Coffee</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/AddCoffee')}
        >
          <CirclePlus size={37} color="black" />
          <Text style={styles.addButtonText}> Add New Coffee</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 320,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 50
  },
  button: {
    marginTop: 120,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 33,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});
