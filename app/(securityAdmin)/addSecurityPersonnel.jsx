import { ScrollView, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

const AddSecurityPersonnel = () => {

    const [gender, setGender] = useState('');
    const [rate, setRate] = useState('');

    return (

        <SafeAreaView edges={[]}>
            <ImageBackground source={images.background} style={styles.background}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Add Security Personnel</Text>
            </View>
        <ScrollView style={styles.container}>
            {/* Gender Selector */}
            <View style={styles.formContainer}>
                    <Text style={styles.label}>Gender:</Text>
                <View style={styles.pickerContainer}>
                </View>
            </View>

            {/* Rate Input */}
            <Text>Rate:</Text>
            <TextInput></TextInput>

                </ScrollView>
            </ImageBackground>

        </SafeAreaView>
    )
}

export default AddSecurityPersonnel

const styles = StyleSheet.create({
    background: {
        height: '100%',
        width: '100%',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        width: '100%',
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        alignItems: 'left',
        borderBottomWidth: 1,
        borderBottomColor: '#d3d3d3',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',

    },
    formContainer: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#FFF',
    },
    picker: {
        height: 50,
        color: '#000',
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
        justifyContent: 'center',
    },
    dateText: {
        color: '#000',
    },
    button: {
        backgroundColor: '#E21A1A',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    createButton: {
        backgroundColor: '#E21A1A',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
    },
});