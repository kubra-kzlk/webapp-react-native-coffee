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
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxMzI5ODFAYXAuYmUiLCJpYXQiOjE3MzM1OTUzMzJ9.d1AD-vAxkIunSHSzhLk1FfFoe72lhsIEj1Fj4Kc_XKg';

export default function CoffeeList() {
    const router = useRouter();
    const { type } = useLocalSearchParams(); //extracts the query parameter: hot / iced
    const [coffees, setCoffees] = useState([]);//Holds the list of coffee objects fetched from the API. Initially set as an empty array
    const [loading, setLoading] = useState(true);

    const fetchCoffees = async () => {
        if (!type) {
            console.error('Error: Coffee type is missing');
            return;
        }
        try { //GET request to API endpoint to fetch coffee data, incl coffee type
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

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}>
                <ChevronLeft size={30} color="#402024" />
            </TouchableOpacity>
            <View style={styles.logoContainer}><Image source={require('../assets/images/tr_logo.png')} style={styles.logo} /></View>

            <ImageBackground
                source={require('../assets/images/cpus.jpeg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.8 }}>
                <Text style={styles.title}>{type === 'hot' ? 'Hot coffees' : 'Iced coffees'}</Text>
                {loading ? (<ActivityIndicator size="large" color="#402024" />) : (
                    <FlatList
                        contentContainerStyle={styles.flatListContainer}
                        data={coffees}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }: { item: Coffee }) => (
                            <TouchableOpacity
                                style={styles.itemContainer}
                                onPress={() =>
                                    router.push({
                                        pathname: '/CoffeeDetail',
                                        params: { id: item.id.toString(), type: type },
                                    })}>
                                <Text style={styles.itemText}>{item.title}</Text>
                                <View ><ChevronRight color="#402024" /></View>
                            </TouchableOpacity>
                        )} />)}
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
    logoContainer: {
        position: 'absolute',
        top: 15,
        right: 10,
        zIndex: 1,
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        padding: 30,
    },
    title: {
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
        width: '90%',
    },
    flatListContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#402024"
    },
});
