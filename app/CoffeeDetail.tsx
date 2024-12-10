import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    ImageBackground,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ShoppingBasket } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import * as WebBrowser from 'expo-web-browser';

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
        console.log("ID:", id, "Type:", type); // Log the parameters
        const fetchCoffeeDetails = async () => {
            if (!id || !type) {
                setError('Missing coffee ID or type.');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching coffee details for:', type, id);
                const response = await fetch(`https://sampleapis.assimilate.be/coffee/${type}/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const coffeeData: Coffee = await response.json();
                setCoffee(coffeeData);

                // Save coffee to recently viewed list in AsyncStorage
                const storedCoffees = await AsyncStorage.getItem('recentlyViewed');
                let recentlyViewed = storedCoffees ? JSON.parse(storedCoffees) : [];

                // Avoid duplicates: check if the coffee is already in the list
                const isAlreadyViewed = recentlyViewed.some((item: Coffee) => item.id === coffeeData.id);
                if (!isAlreadyViewed) {
                    recentlyViewed = [coffeeData, ...recentlyViewed]; // Add to the top
                    if (recentlyViewed.length > 3) {
                        recentlyViewed.pop();  // Remove the oldest coffee (keep the list size to 3)
                    }
                }
                // Save the updated list back to AsyncStorage
                await AsyncStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
            } catch (error) {
                console.error('Error fetching coffee details:', error);
                setError('Failed to load coffee details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCoffeeDetails();
    }, [id]);

    // Function to open the Wikipedia page based on the coffee title
    const openCoffeeWikiPage = (coffeeTitle: string) => {
        // Clean the coffee title to match Wikipedia's naming conventions (lowercase, replace spaces)
        const formattedTitle = coffeeTitle.trim().toLowerCase().replace(/\s+/g, '_');  // Wikipedia format

        // Construct the URL for the first attempt (using the coffee title)
        const wikiUrl = `https://en.wikipedia.org/wiki/${formattedTitle}`;

        // Try to open the specific coffee article
        WebBrowser.openBrowserAsync(wikiUrl).catch(() => {
            // If the first attempt fails, try searching for the coffee + 'coffee' (second attempt)
            const fallbackWikiUrl = `https://en.wikipedia.org/wiki/${formattedTitle}_coffee`;

            // Open the fallback URL (with 'coffee' appended)
            WebBrowser.openBrowserAsync(fallbackWikiUrl).catch(() => {
                // Fallback to a general coffee page if both searches fail
                WebBrowser.openBrowserAsync('https://en.wikipedia.org/wiki/Coffee');
            });
        });
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
            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/tr_logo.png')} style={styles.logo} />
            </View>
            <ImageBackground
                source={{ uri: coffee.image }} // Use the API's image URL as the background
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.7 }} // Optional, for opacity effect
            >
                {/* The background will take up 3/4 of the screen */}
            </ImageBackground>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{coffee.title}</Text>
                <Text style={styles.description}>{coffee.description}</Text>

                <Text style={styles.ingredientsTitle}><ShoppingBasket size={30} color="#402024" />  Ingredients:</Text>
                <FlatList
                    data={coffee.ingredients}
                    keyExtractor={(index) => index.toString()}
                    renderItem={({ item }) => <Text style={styles.ingredientItem}>- {item}</Text>}
                />
                {/* Button to search for the coffee's Wikipedia page */}
                <TouchableOpacity
                    style={styles.wikiButton}
                    onPress={() => openCoffeeWikiPage(coffee.title)} // Open the Wikipedia page
                >
                    <Text style={styles.wikiButtonText}>Learn more about {coffee.title}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 0.60,  // 1/4 of the screen height
        backgroundColor: 'white', // Optional, for clear background below the image
        padding: 20,

    },
    backgroundImage: {
        flex: 0.75,  // 3/4 of the screen height
        resizeMode: 'cover',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: "#402024"
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
        color: "#402024",
        marginBottom: 20,
    },
    ingredientsTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#402024"
    },
    ingredientItem: {
        fontSize: 20,
        marginBottom: 5,
        color: "#402024"
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
    wikiButton: {
        backgroundColor: '#402024', // Coffee-like color
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',

    },
    wikiButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoContainer: {
        position: 'absolute',
        top: 1,
        left: 1,
        zIndex: 1, // To make sure the logo is on top of other content
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
});
