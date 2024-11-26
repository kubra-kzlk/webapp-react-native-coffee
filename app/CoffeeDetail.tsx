import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Coffee {
    id: string;
    title: string;
    description: string;
    ingredients: string[];
    image: string;
}

export default function CoffeeDetail() {
    const router = useRouter();
    const { id, type } = useLocalSearchParams<{ id: string, type: string }>(); // 'type' from query params
    const [coffee, setCoffee] = useState<Coffee | null>(null);
    const [reminderTime, setReminderTime] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the coffee details from the API based on the type
    useEffect(() => {
        const fetchCoffeeDetails = async () => {
            if (!id || !type) {
                setError('Missing coffee ID or type.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://sampleapis.assimilate.be/coffee/${type}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched coffee data:', data);  // Debugging line
                const coffee = data.find((item: Coffee) => item.id.toString() === id); // Find the coffee by ID

                if (coffee) {
                    setCoffee(coffee);
                } else {
                    setError('Coffee not found.');
                }
            } catch (error) {
                console.error('Error fetching coffee details:', error);
                setError('Failed to load coffee details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCoffeeDetails();
    }, [id, type]);

    const markAsFavorite = async () => {
        if (!coffee) return;

        try {
            const favoritesJson = await AsyncStorage.getItem('favorites');
            const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
            const isFavorite = favorites.some((item: Coffee) => item.id === coffee.id);

            if (isFavorite) {
                alert(`${coffee.title} is already marked as favorite.`);
                return;
            }

            favorites.push(coffee);
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${coffee.title} has been added to your favorites.`);
        } catch (error) {
            console.error('Error marking favorite:', error);
        }
    };

    const setReminder = async () => {
        try {
            const timeInSeconds = parseInt(reminderTime) * 60;
            if (isNaN(timeInSeconds) || timeInSeconds <= 0) {
                alert('Please enter a valid time in minutes.');
                return;
            }

            if (!coffee) return;

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Coffee Reminder',
                    body: `Time to try your favorite coffee: ${coffee.title}!`,
                    data: { coffeeId: coffee.id },
                },
                trigger: 0,
            });

            alert('Reminder set for this coffee!');
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B4513" />
                <Text style={styles.loadingText}>Loading coffee details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!coffee) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Coffee details not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{coffee.title}</Text>
            <Image source={{ uri: coffee.image }} style={styles.image} />
            <Text style={styles.description}>{coffee.description}</Text>
            <Text style={styles.ingredients}>Ingredients: {coffee.ingredients.join(', ')}</Text>

            <TouchableOpacity style={styles.button} onPress={markAsFavorite}>
                <Text style={styles.buttonText}>Mark as Favorite</Text>
            </TouchableOpacity>

            <View style={styles.reminderContainer}>
                <Text style={styles.reminderText}>Set a Reminder (in minutes):</Text>
                <TextInput
                    style={styles.reminderInput}
                    placeholder="Minutes"
                    keyboardType="numeric"
                    value={reminderTime}
                    onChangeText={setReminderTime}
                />
                <TouchableOpacity style={styles.button} onPress={setReminder}>
                    <Text style={styles.buttonText}>Set Reminder</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5E6D3',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8B4513',
        marginBottom: 15,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#4B4B4B',
        marginBottom: 10,
    },
    ingredients: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#6B6B6B',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#8B4513',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reminderContainer: {
        marginTop: 20,
    },
    reminderText: {
        fontSize: 16,
        color: '#8B4513',
        marginBottom: 10,
    },
    reminderInput: {
        height: 40,
        borderColor: '#A0522D',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5E6D3',
    },
    loadingText: {
        fontSize: 16,
        color: '#8B4513',
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5E6D3',
    },
    errorText: {
        fontSize: 16,
        color: '#D9534F',
        textAlign: 'center',
    },
});
