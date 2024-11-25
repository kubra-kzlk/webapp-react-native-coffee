import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function AddCoffee() {
    const router = useRouter();//is used to get the router object
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [image, setImage] = useState<string | null>(null);

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

        const newCoffee = {
            id: Date.now().toString(),
            title,
            description,
            ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item !== ''),
            image,
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
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick an Image</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TouchableOpacity style={styles.button} onPress={saveCoffee}>
                <Text style={styles.buttonText}>Save Coffee</Text>
            </TouchableOpacity>
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
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#A0522D',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#8B4513',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
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
