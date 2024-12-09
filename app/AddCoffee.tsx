import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Image, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Images, Coffee, GlassWater, Save } from 'lucide-react-native';

const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxMzI5ODFAYXAuYmUiLCJpYXQiOjE3MzM1OTUzMzJ9.d1AD-vAxkIunSHSzhLk1FfFoe72lhsIEj1Fj4Kc_XKg';
export default function AddCoffee() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [image, setImage] = useState<string>('');
    const [type, setType] = useState<'hot' | 'iced' | null>(null);
    const [coffees, setCoffees] = useState<any[]>([]); // State to hold the list of coffees

    const pickImage = async () => {
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

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Save the image URI
        }
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
                headers: {
                    'Authorization': `Client-ID fd7e1825c87d431`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                return data.data.link; // Return the URL of the uploaded image
            } else {
                throw new Error('Failed to upload image to Imgur');
            }
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

        // Upload the image to Imgur
        const imageUrl = image ? await uploadToImgur(image) : null;

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
        // Determine the correct API endpoint based on the coffee type
        const apiUrl = type === 'hot'
            ? 'https://sampleapis.assimilate.be/coffee/hot'
            : 'https://sampleapis.assimilate.be/coffee/iced';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxMzI5ODFAYXAuYmUiLCJpYXQiOjE3MzM3NDEwODR9.RU_UFL6rHgQqMDy5UeqLct7CsZwjfv5Mz-qCqUluTTQ'
                },
                body: JSON.stringify(newCoffee), // Send the coffee data in the request body
            });

            // Log status and success status of the response
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                // If the response is OK, read the response body as text
                const responseBody = await response.text();
                console.log('Raw response:', responseBody); // Log the raw response body

                try {
                    const jsonResponse = JSON.parse(responseBody);
                    console.log('Parsed response:', jsonResponse); // Log the parsed JSON response

                    if (jsonResponse.id) {
                        const newCoffeeItem = {
                            id: jsonResponse.id, // Ensure ID exists
                            title: jsonResponse.title,
                            description: jsonResponse.description,
                            image: jsonResponse.image,
                            ingredients: jsonResponse.ingredients || [], // Ensure ingredients is an array
                        };

                        setCoffees((prevCoffees) => [...prevCoffees, newCoffeeItem]);

                        Alert.alert('Success', 'New coffee added successfully!', [
                            {
                                text: 'OK', onPress: () => {
                                    setCoffees((prevCoffees) => [...prevCoffees, jsonResponse]); // Update list                            
                                }
                            }]);
                        router.replace({
                            pathname: '/',
                            params: { id: jsonResponse.id.toString() }, // Pass the newly added coffee
                        });
                    } else {
                        Alert.alert('Error', 'Failed to add coffee. Please try again.');
                    }
                } catch (error) {
                    console.error('Error parsing response:', error);
                    Alert.alert('Error', 'Failed to parse the response from the server.');
                }
            } else {
                // Handle different error codes here, such as the 502 error
                const errorResponse = await response.text();
                console.log('Error response:', errorResponse);
                Alert.alert('Error', `Server error: ${response.statusText} (${response.status})`);
            }

        } catch (error) {
            console.error('Error saving coffee:', error);
            Alert.alert('Error', 'Failed to save coffee. Please try again.');
        }
    };

    const fetchCoffees = async () => {
        const apiUrl = type === 'hot'
            ? 'https://sampleapis.assimilate.be/coffee/hot'
            : 'https://sampleapis.assimilate.be/coffee/iced';

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched Coffees:', data); // Check if the API returns the data
                setCoffees(data); // Store the fetched coffees in the state
            } else {
                Alert.alert('Error', 'Failed to fetch coffee list.');
            }
        } catch (error) {
            console.error('Error fetching coffee:', error);
            Alert.alert('Error', 'Failed to fetch coffee list. Please try again.');
        }
    };

    // Fetch coffee list when the component mounts
    useEffect(() => {
        if (type) {
            fetchCoffees();  // Fetch coffees based on the selected type (hot or iced)
        }
    }, [type]);  // Run this whenever the 'type' state changes


    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/tr_logo.png')} style={styles.logo} />
            </View>
            <ImageBackground
                source={require('../assets/images/cpus.jpeg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.4 }}
            >
                <Text style={styles.title}>     Add New Coffee</Text>
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
                        <Text style={styles.radioLabel}><Coffee size={20} color="#402024" />  Hot Coffee </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setType('iced')}
                    >
                        <View style={[styles.radioCircle, type === 'iced' && styles.radioCircleSelected]} />
                        <Text style={styles.radioLabel}><GlassWater size={20} color="#402024" /> Iced Coffee</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={pickImage}>

                    <Text style={styles.typeTitle}>Pick an Image <Images size={20} color="#402024" /></Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <TouchableOpacity style={styles.button} onPress={saveCoffee}>
                    <Text style={styles.buttonText}>Save Coffee <Save size={25} color="#402024" /></Text>
                </TouchableOpacity>

                <FlatList
                    data={coffees}

                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View >
                            <Text>{item.title}</Text>
                            <Text>{item.description}</Text>
                            <Image source={{ uri: item.image }} />
                        </View>
                    )}
                />

            </ImageBackground>
        </View>
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
        top: 1,
        left: 1,
        zIndex: 1, // To make sure the logo is on top of other content
    },
    logo: {
        width: 80,
        height: 80,
        marginTop: 11,
        marginLeft: 24,
        resizeMode: 'contain',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    title: {
        marginBottom: 180,
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
    input: {
        height: 40,
        width: '80%',
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 20,
        borderColor: '#402024',
        backgroundColor: '#FFF',
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 6,

    },
    typeTitle: {
        alignSelf: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#402024"

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
        color: "#402024"
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center'

    },
    buttonText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "#402024",
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 35,
        marginHorizontal: 20,
    },
    coffeeItem: {
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 8,
        width: '80%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 6,
    },
}); 