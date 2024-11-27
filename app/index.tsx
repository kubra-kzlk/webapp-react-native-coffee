import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Coffee, IceCream, Plus, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Coffee {
  id: string;
  title: string;
  type: string;
}

export default function HomeScreen() {
  const [favorites, setFavorites] = useState<Coffee[]>([]);
  const router = useRouter();

  const getFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem('favorites');
      const parsedFavorites = favoritesData ? JSON.parse(favoritesData) : [];
      setFavorites(parsedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  const renderFavoriteItem = ({ item }: { item: Coffee }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => router.push({
        pathname: '/CoffeeDetail',
        params: { id: item.id, type: item.type },
      })}
    >
      <Heart size={18} color="#8B4513" />
      <Text style={styles.favoriteItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find the best coffee for you</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'hot' } })}
        >
          <Coffee size={24} color="#FFF" />
          <Text style={styles.buttonText}>Hot Coffee</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push({ pathname: '/CoffeeList', params: { type: 'iced' } })}
        >
          <IceCream size={24} color="#FFF" />
          <Text style={styles.buttonText}>Iced Coffee</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/AddCoffee')}
      >
        <Plus size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Add New Coffee</Text>
      </TouchableOpacity>
      <View style={styles.favoritesContainer}>
        <Text style={styles.favoritesTitle}>Your Favorites</Text>
        {favorites.length === 0 ? (
          <Text style={styles.noFavorites}>No favorites yet!</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavoriteItem}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#A0522D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#A0522D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  favoritesContainer: {
    margin: 20,
  },
  favoritesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  favoriteItemText: {
    fontSize: 16,
    color: '#8B4513',
    marginLeft: 10,
  },
  noFavorites: {
    fontStyle: 'italic',
    color: '#8B4513',
    textAlign: 'center',
  },
});
