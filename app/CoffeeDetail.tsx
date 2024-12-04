import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    FlatList,
    ImageBackground,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ShoppingBasket } from 'lucide-react-native';

interface Coffee {
    id: string;
    title: string;
    description: string;
    ingredients: string[];
    image: string;
    type: string;
}

export default function CoffeeDetail() {
    const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
    const [coffee, setCoffee] = useState<Coffee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the coffee details from the API
    useEffect(() => {
        const fetchCoffeeDetails = async () => {
            if (!id) {
                setError('Missing coffee ID.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://sampleapis.assimilate.be/coffee/${type}/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const coffeeData: Coffee = await response.json();
                setCoffee(coffeeData);
            } catch (error) {
                console.error('Error fetching coffee details:', error);
                setError('Failed to load coffee details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCoffeeDetails();
    }, [id]);

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
            <ImageBackground
                source={require('../assets/images/beans.jpg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.3 }}
            >
                <Text style={styles.title}>{coffee.title}</Text>
                <Image source={{ uri: coffee.image }} style={styles.image} />
                <Text style={styles.description}>{coffee.description}</Text>

                <Text style={styles.ingredientsTitle}><ShoppingBasket size={30} color="#654321" />  Ingredients:</Text>
                <FlatList
                    data={coffee.ingredients}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <Text style={styles.ingredientItem}>- {item}</Text>}
                />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: "#654321"
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 125,
        marginBottom: 15,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    description: {
        fontSize: 20,
        textAlign: 'justify',
        color: "#654321",
        marginBottom: 20,
    },
    ingredientsTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#654321"
    },
    ingredientItem: {
        fontSize: 20,
        marginBottom: 5,
        color: "#654321"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
