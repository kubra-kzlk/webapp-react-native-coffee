import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GlassWater, Plus, Coffee, CirclePlus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Coffee {
  id: string;
  title: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [recentlyViewed, setRecentlyViewed] = useState<Coffee[]>([]);

  //lijst recent bekeken koffies
  useEffect(() => {
    const saveToRecentCoffees = async () => {
      const storedCoffees = await AsyncStorage.getItem('recentlyViewed');
      if (storedCoffees) {
        setRecentlyViewed(JSON.parse(storedCoffees).slice(0, 3)); // Limit to 3 most recent      }
      }
    };
    saveToRecentCoffees();
    // Listen for changes to recently viewed
    const intervalId = setInterval(() => {
      saveToRecentCoffees();
    }, 1000); // Re-fetch every 1 second to check for changes

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);


  // Render coffee name in FlatList
  const renderCoffee = ({ item }: { item: Coffee }) => (
    <Text style={styles.headerSubtitle}>{item.title}</Text>
  );



  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/cpus.jpeg')}
        style={styles.backgroundImage}
      >
        <Text style={styles.headerTitle}>Find your favorite coffee taste!</Text>
        <Text style={styles.headerSubtitle}>Recently Viewed Coffees:</Text>
        {recentlyViewed.length === 0 ? (
          <Text style={styles.headerSubtitle}>No recently viewed coffees</Text>
        ) : (
          <FlatList
            data={recentlyViewed}
            keyExtractor={(item) => item.id}
            renderItem={renderCoffee}
          />
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'hot' } })}
          >
            <Coffee size={32} color="#654321" />
            <Text style={styles.buttonText}>Hot Coffee</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'iced' } })}
          >
            <GlassWater size={32} color="#654321" />
            <Text style={styles.buttonText}>Iced Coffee</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/AddCoffee')}
        >
          <CirclePlus size={37} color="#654321" />
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
    justifyContent: 'center',
  },
  headerTitle: {
    marginBottom: 10,
    marginTop: 20,
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#654321"
  },
  headerSubtitle: {
    fontSize: 20,

    textAlign: 'center',
    color: "#654321"
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 50
  },
  button: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonText: {
    fontSize: 33,
    fontWeight: 'bold',
    color: "#654321"
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
  },
  addButtonText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: "#654321"
  },

});
