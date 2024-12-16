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
    SafeAreaView,
    ImageBackground,
} from 'react-native';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
    const [coffee, setCoffee] = useState<Coffee | null>(null); //Stores the fetched coffee details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        console.log("ID:", id, "Type:", type); // Log the parameters
        const fetchCoffeeDetails = async () => {
            if (!id || !type) {
                setError('Missing coffee ID or type.');
                setLoading(false);
                return;
            }
            try { //API GET call: Fetch coffee details from API
                console.log('Fetching coffee details for:', type, id);
                const response = await fetch(`https://sampleapis.assimilate.be/coffee/${type}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxMzI5ODFAYXAuYmUiLCJpYXQiOjE3MzM3NDEwODR9.RU_UFL6rHgQqMDy5UeqLct7CsZwjfv5Mz-qCqUluTTQ',
                    },
                });
                console.log('Response:', response);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                //parses the JSON data and updates the coffee state.
                const coffeeData: Coffee = await response.json();
                console.log('Fetched coffee data:', coffeeData);
                setCoffee(coffeeData);

                const storedCoffees = await AsyncStorage.getItem('recentlyViewed');
                let recentlyViewed = storedCoffees ? JSON.parse(storedCoffees) : [];

                //check if the coffee is already in the list
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

    const openCoffeeWikiPage = (coffeeTitle: string) => {
        // Clean the coffee title to match Wikipedia's naming conventions (lowercase, replace spaces)
        const formattedTitle = coffeeTitle.trim().toLowerCase().replace(/\s+/g, '_');  // Wikipedia format
        const wikiUrl = `https://en.wikipedia.org/wiki/${formattedTitle}`;
        WebBrowser.openBrowserAsync(wikiUrl).catch(() => {
            // If the first attempt fails, try searching for the coffee + 'coffee' (second attempt)
            const fallbackWikiUrl = `https://en.wikipedia.org/wiki/${formattedTitle}_coffee`;
            // Open the fallback URL (with 'coffee' appended)
            WebBrowser.openBrowserAsync(fallbackWikiUrl).catch(() => {
                WebBrowser.openBrowserAsync('https://en.wikipedia.org/wiki/Coffee'); // Fallback to a general coffee page if both searches fail
            });
        });
    };
    if (!coffee) {
        return (<View style={styles.errorContainer}><Text style={styles.errorText}>Coffee details not found.</Text></View>);
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}>
                <ChevronLeft size={30} color="#402024" />
            </TouchableOpacity>
            <ImageBackground
                source={{ uri: coffee.image }} // Use the API's image URL as the background
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.7 }} >
                <View style={styles.logoContainer}><Image source={require('../assets/images/tr_logo.png')} style={styles.logo} /></View>
            </ImageBackground>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{coffee.title}</Text>
                <Text style={styles.description}>{coffee.description}</Text>
                <Text style={styles.ingredientsTitle}><ShoppingBasket size={30} color="#402024" />  Ingredients:</Text>
                <FlatList
                    data={coffee.ingredients}
                    keyExtractor={(index) => index.toString()}
                    renderItem={({ item }) => <Text style={styles.ingredientItem}>- {item}</Text>} />
                <TouchableOpacity
                    style={styles.wikiButton}
                    onPress={() => openCoffeeWikiPage(coffee.title)}>
                    <Text style={styles.wikiButtonText}>Learn more about {coffee.title}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 0.60,  // 1/4 of the screen height
        backgroundColor: 'white',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        padding: 10,
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
        color: "#402024",
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
        backgroundColor: '#402024',
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
        right: 1,
        zIndex: 1,
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
});
