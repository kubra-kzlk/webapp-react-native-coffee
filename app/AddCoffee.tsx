import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Images, Coffee, GlassWater } from 'lucide-react-native';

export default function AddCoffee() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [type, setType] = useState<'hot' | 'iced' | null>(null); // Coffee type state

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'You need to grant permission to access the media library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Save the image URI
        }
    };

    const saveCoffee = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title for the coffee.');
            return;
        }

        if (!type) {
            Alert.alert('Error', 'Please select the coffee type (Hot or Iced).');
            return;
        }

        const newCoffee = {
            id: Date.now().toString(),
            title,
            description,
            ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item !== ''),
            image,
            type,
        };

        try {
            // Get existing coffees
            const existingCoffeesJson = await AsyncStorage.getItem('coffees');
            const existingCoffees = existingCoffeesJson ? JSON.parse(existingCoffeesJson) : [];

            // Add new coffee to the list
            const updatedCoffees = [...existingCoffees, newCoffee];

            // Save updated coffees list
            await AsyncStorage.setItem('coffees', JSON.stringify(updatedCoffees));

            Alert.alert('Success', 'New coffee added successfully!', [
                { text: 'OK', onPress: () => router.push('/') }
            ]);
        } catch (error) {
            console.error('Error saving coffee:', error);
            Alert.alert('Error', 'Failed to save coffee. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/beans.jpg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.4 }}
            >
                <Text style={styles.title}>Add New Coffee</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ingredients (comma separated)"
                    value={ingredients}
                    onChangeText={setIngredients}
                />

                <Text style={styles.typeTitle}>Select Coffee Type:</Text>
                <View style={styles.radioContainer}>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setType('hot')}
                    >
                        <View style={[styles.radioCircle, type === 'hot' && styles.radioCircleSelected]} />
                        <Text style={styles.radioLabel}><Coffee size={20} color="black" />  Hot Coffee </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setType('iced')}
                    >
                        <View style={[styles.radioCircle, type === 'iced' && styles.radioCircleSelected]} />
                        <Text style={styles.radioLabel}><GlassWater size={20} color="black" /> Iced Coffee</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={pickImage}>

                    <Text style={styles.buttonText}>Pick an Image <Images size={20} color="black" /></Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <TouchableOpacity style={styles.button} onPress={saveCoffee}>
                    <Text style={styles.buttonText}>Save Coffee <Coffee size={30} color="black" /></Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 150,
    },
    input: {
        height: 40,
        width: '80%',
        alignSelf: 'center',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontWeight: 'bold',
        fontSize: 20,

    },
    typeTitle: {
        alignSelf: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10
    },
    radioContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        marginBottom: 1,

    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 10,
    },
    radioCircleSelected: {
        backgroundColor: 'black',
    },
    radioLabel: {
        fontSize: 20,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 100,
    },
    buttonText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
});
