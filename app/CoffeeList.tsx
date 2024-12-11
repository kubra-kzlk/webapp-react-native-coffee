import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    RefreshControl,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';

interface Coffee {
    id: string;
    title: string;
}
// Updated fetchCoffees function with the Authorization header
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxMzI5ODFAYXAuYmUiLCJpYXQiOjE3MzM1OTUzMzJ9.d1AD-vAxkIunSHSzhLk1FfFoe72lhsIEj1Fj4Kc_XKg';

export default function CoffeeList() {
    const router = useRouter();
    const { type } = useLocalSearchParams();
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch coffee data from the API
    const fetchCoffees = async () => {
        if (!type) {
            console.error('Error: Coffee type is missing');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`https://sampleapis.assimilate.be/coffee/${type}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Fetching data for type:', type);

            if (!response.ok) {
                throw new Error('Failed to fetch coffee data');
            }
            const data = await response.json();
            setCoffees(data);
        } catch (error) {
            console.error('Error fetching coffee data:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        console.log('Fetching data for type:', type);
        fetchCoffees();
    }, [type]);

    // Refresh control handler
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCoffees();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}> {/* Wrap everything inside SafeAreaView */}
            {/* Back Button in the top-left corner */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()} // Go back to the previous screen
            >
                <ChevronLeft size={30} color="#402024" />  {/* ChevronLeft icon from lucide-react-native */}
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/tr_logo.png')} style={styles.logo} />
            </View>
            <ImageBackground
                source={require('../assets/images/cpus.jpeg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.8 }}
            >
                <Text style={styles.title}>{type === 'hot' ? 'Hot coffees' : 'Iced coffees'}</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#402024" />
                ) : (
                    <FlatList
                        contentContainerStyle={styles.flatListContainer} // This will center the list
                        data={coffees}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }: { item: Coffee }) => (
                            <TouchableOpacity
                                style={styles.itemContainer}
                                onPress={() =>
                                    router.push({
                                        pathname: '/CoffeeDetail',
                                        params: { id: item.id.toString(), type: type },
                                    })
                                }
                            >
                                <Text style={styles.itemText}>{item.title}</Text>
                                <View >
                                    <ChevronRight color="#402024" />
                                </View>
                            </TouchableOpacity>
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                )}
            </ImageBackground>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Align elements at the top
        alignItems: 'center',
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
        marginTop: 10,
        marginLeft: 10,
        resizeMode: 'contain',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'flex-start', // Ensure content starts at the top
        alignItems: 'center',
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1, // To ensure it is on top of other content
        padding: 10,
    },
    title: {
        marginBottom: 10,
        marginTop: 20,
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#402024",
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 8,
        width: '100%',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: '80%',


    },
    flatListContainer: {
        alignItems: 'center',  // Center the FlatList horizontally
        paddingTop: 20,  // Add some padding at the top
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#402024"
    },
});
