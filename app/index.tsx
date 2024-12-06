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
  const [isLoading, setIsLoading] = useState(true); //bundling page

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


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/tr_logo.png')} style={styles.applogo} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/tr_logo.png')} style={styles.logo} />
      </View>

      <ImageBackground
        source={require('../assets/images/cpus.jpeg')}
        style={styles.backgroundImage}      >

        <Text style={styles.headerTitle}>     COFFEE CONNECT</Text>
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
            <Coffee size={32} color="#402024" />
            <Text style={styles.buttonText}>Hot Coffee</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'iced' } })}
          >
            <GlassWater size={32} color="#402024" />
            <Text style={styles.buttonText}>Iced Coffee</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/AddCoffee')}
        >
          <Plus size={35} color="#402024" />
          <Text style={styles.addButtonText}> Add New Coffee</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    position: 'absolute',
    top: 1,
    left: 1,
    zIndex: 1, // To make sure the logo is on top of other content
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  headerTitle: {
    marginBottom: 10,
    marginTop: 20,
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#402024"
  },
  headerSubtitle: {
    fontSize: 20,

    textAlign: 'center',
    color: "#402024"
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
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
    color: "#402024"
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
  },
  addButtonText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: "#402024"
  },
  logo: {
    width: 70,
    height: 80,
    resizeMode: 'contain',
  },
  applogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  }
});
