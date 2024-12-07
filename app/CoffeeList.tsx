import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

interface Coffee {
    id: string;
    title: string;
}

export default function CoffeeList() {
    const router = useRouter();
    const { type } = useLocalSearchParams();
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch coffee data from the API
    const fetchCoffees = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://sampleapis.assimilate.be/coffee/${type}`);
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

    // Trigger fetch on navigation back
    useFocusEffect(
        useCallback(() => {
            fetchCoffees();
        }, [type])
    );

    // Refresh control handler
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCoffees();
        setRefreshing(false);
    };
    return (
        <View style={styles.container}>
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
                                <ChevronRight color="#402024" />
                            </TouchableOpacity>
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                )}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        resizeMode: 'cover',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    title: {
        marginBottom: 50,
        marginTop: -40,
        fontSize: 46,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#402024",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 6,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 8,
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


    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#402024"
    },
});
