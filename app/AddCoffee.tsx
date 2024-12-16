import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Image, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Images, Coffee, GlassWater, Save } from 'lucide-react-native';
import { ChevronLeft } from 'lucide-react-native';

export default function AddCoffee() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [image, setImage] = useState<string>('');
    const [type, setType] = useState<'hot' | 'iced' | null>(null);

    const pickImage = async () => {//Opens the media library to allow the user to select an image
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'You need to grant permission to access the media library.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"], // Use array with MediaType
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) { setImage(result.assets[0].uri); }// Save the image URI to state 
    };
    console.log('Image URI:', image);

    const uploadToImgur = async (uri: string) => {
        const formData = new FormData();
        try {
            // Use expo-file-system to read the file as a base64-encoded string
            const fileInfo = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });//This function reads the file as a Base64-encoded string, which is necessary for converting the image into a Blob that can be uploaded via FormData.
            // Append the base64 string directly to the form data
            formData.append('image', fileInfo);  // Send the base64 string directly in the 'image' field
            const response = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: { 'Authorization': `Client-ID fd7e1825c87d431`, },
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                return data.data.link; // Return the URL of the uploadd image
            } else { throw new Error('Failed to upload image to Imgur'); }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image. Please try again.');
            return null;
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
        const imageUrl = image ? await uploadToImgur(image) : null; // Upload the image to Imgur
        if (!imageUrl) {
            Alert.alert('Error', 'Failed to upload image.');
            return;
        }
        const newCoffee = {
            title,
            description,
            ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item !== ''),
            image: imageUrl
        };
        const apiUrl = type === 'hot'    // Determine the correct API endpoint based on the coffee type
            ? 'https://sampleapis.assimilate.be/coffee/hot'
            : 'https://sampleapis.assimilate.be/coffee/iced';
        try { // POST request to the API to add the new coffee
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxMzI5ODFAYXAuYmUiLCJpYXQiOjE3MzM3NDEwODR9.RU_UFL6rHgQqMDy5UeqLct7CsZwjfv5Mz-qCqUluTTQ'
                },
                body: JSON.stringify(newCoffee), // Send the coffee data in the request body
            });
            if (response.ok) {
                Alert.alert('Success', 'New coffee added successfully!', [
                    { text: 'OK', onPress: () => router.push('/') }
                ]);
            } else { Alert.alert('Error', 'Failed to add coffee. Please try again.'); }
        } catch (error) {
            console.error('Error saving coffee:', error);
            Alert.alert('Error', 'Failed to save coffee. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}>
                <ChevronLeft size={30} color="#402024" />
            </TouchableOpacity>
            <ImageBackground
                source={require('../assets/images/cpus.jpeg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.4 }}>
                <View style={styles.logoContainer}><Image source={require('../assets/images/tr_logo.png')} style={styles.logo} /></View>
                <Text style={styles.headerTitle}> Add New Coffee</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle} />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription} />
                <TextInput
                    style={styles.input}
                    placeholder="Ingredients (comma separated)"
                    value={ingredients}
                    onChangeText={setIngredients} />
                <Text style={styles.typeTitle}>Select Coffee Type:</Text>
                <View style={styles.radioContainer}>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setType('hot')} >
                        <View style={[styles.radioCircle, type === 'hot' && styles.radioCircleSelected]} />
                        <View><Text style={styles.radioLabel}>
                            <Coffee size={20} color="#402024" />  Hot Coffee </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setType('iced')}>
                        <View style={[styles.radioCircle, type === 'iced' && styles.radioCircleSelected]} />
                        <View>
                            <Text style={styles.radioLabel}>
                                <GlassWater size={20} color="#402024" /> Iced Coffee</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <View>
                        <Text style={styles.buttonText}>Pick an image <Images size={15} color="white" /></Text>
                    </View>
                </TouchableOpacity>

                <Image source={{ uri: image }} resizeMode='contain' style={styles.image} />
                <TouchableOpacity style={styles.button} onPress={saveCoffee}>
                    <View>
                        <Text style={styles.buttonText}>Save Coffee <Save size={20} color="white" /></Text>
                    </View>
                </TouchableOpacity>

            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoContainer: {
        position: 'absolute',
        top: 15,
        right: 10,
        zIndex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        padding: 30,
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
    headerTitle: {
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
    input: {
        width: '80%',
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 20,
        borderColor: '#402024',
        borderWidth: 1.5,
        marginBottom: 10,
        marginTop: 20,
    },
    typeTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "#402024",
        marginBottom: 10,
        marginTop: 20,

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
        borderColor: '#402024',

    },
    radioCircleSelected: {
        backgroundColor: '#402024',
    },
    radioLabel: {
        fontSize: 20,
        color: "#402024",
        fontWeight: 'bold',

    },
    button: {
        backgroundColor: '#402024',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',

    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 35,
        marginHorizontal: 20,
    },

}); 