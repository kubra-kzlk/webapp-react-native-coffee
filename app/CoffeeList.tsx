import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

    // Fetch coffee data from the API
    useEffect(() => {
        const fetchCoffees = async () => {
            try {
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

        fetchCoffees();
    }, [type]);

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
                <Text style={styles.title}>{type === 'hot' ? 'Hot Coffees' : 'Iced Coffees'}</Text>

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
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No coffee recipes available for this type.</Text>
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
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 100,
        marginTop: -40,
        color: "#402024"
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
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
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 20,
        fontSize: 18,
        color: "#402024"
    },
});
