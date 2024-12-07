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
        <Text style={styles.headerSubtitle}>Recently viewed coffees:</Text>
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
            <Text style={styles.buttonText}><Coffee size={22} color="#402024" />  Hot coffees</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'iced' } })}
          >
            <Text style={styles.buttonText}><GlassWater size={22} color="#402024" /> Iced coffees</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/AddCoffee')}
        >
          <Text style={styles.buttonText}> Add new coffee</Text>
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
    fontSize: 46,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#402024",
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
  },
  headerSubtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: "#402024",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 6,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "#402024"
  },
  logo: {
    width: 70,
    height: 70,
    marginTop: 19,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  applogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  }
});
