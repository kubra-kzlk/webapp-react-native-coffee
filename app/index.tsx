import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GlassWater, Coffee, CirclePlus, Eye } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Coffee {
  id: string;
  title: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [recentlyViewed, setRecentlyViewed] = useState<Coffee[]>([]);
  const [isLoading, setIsLoading] = useState(true); //bundling page

  // Clear AsyncStorage and reset state on reload
  useEffect(() => {
    const resetAppData = async () => { await AsyncStorage.clear(); };
    resetAppData();
  }, []);  // This will run only once when the component mounts

  useFocusEffect(//fetch recently viewed data when screen is focused 
    React.useCallback(() => {
      const saveToRecentCoffees = async () => {
        const storedCoffees = await AsyncStorage.getItem('recentlyViewed');
        if (storedCoffees) { setRecentlyViewed(JSON.parse(storedCoffees).slice(0, 3)); }
      };
      saveToRecentCoffees();
    }, [])
  );

  // Render coffee name in FlatList
  const renderCoffee = ({ item }: { item: Coffee }) => (
    <TouchableOpacity onPress={() => router.push(`/CoffeeDetail?id=${item.id}&type=hot`)}>
      <View><Text style={styles.headerSubtitle}>{item.title}</Text></View >
    </TouchableOpacity>);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (<View style={styles.container}> <Image source={require('../assets/images/tr_logo.png')} style={styles.applogo} /> </View>);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/cpus.jpeg')}
        style={styles.backgroundImage}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>COFFEE CONNECT</Text>
          <View style={styles.logoContainer}> <Image source={require('../assets/images/tr_logo.png')} style={styles.logo} /> </View>
        </View>
        <View style={styles.recentlyViewedContainer}>
          <View>
            <Text style={styles.headerSubtitle}>
              <Eye size={20} color="#402024" />
              {' '}  Recently viewed coffees:
            </Text>
          </View>
          {recentlyViewed.length === 0 ? (
            <View><Text style={styles.headerSubtitle}>No recently viewed coffees</Text></View>) : (
            <FlatList
              data={recentlyViewed}
              keyExtractor={(item) => item.id}
              renderItem={renderCoffee} />)}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'hot' } })} >
            <View >
              <Text style={styles.buttonText}>
                <Coffee size={22} color="#402024" />   Hot coffees</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'iced' } })}>
            <View>
              <Text style={styles.buttonText}>
                <GlassWater size={22} color="#402024" />   Iced coffees</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/AddCoffee')}>
            <View>
              <Text style={styles.buttonText}> <CirclePlus size={22} color="#402024" />   Add coffee</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerTitle: {
    marginBottom: 10,
    marginTop: 20,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#402024",
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  headerSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: "#402024",
    marginTop: 5,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    fontWeight: 'bold',
    elevation: 6,
  },
  recentlyViewedContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 40,
    width: 300,
    paddingHorizontal: 25,
  },
  button: {
    backgroundColor: '#FFF',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 6,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "#402024",
    textAlign: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  logoContainer: {
    position: 'absolute',
    top: 15,
    right: 1,
    zIndex: 1,
  },
  applogo: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
});
