import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons'; // For icons

const Settings = () => {
    // State for toggling switches - ADD
    return (
        <SafeAreaView edges={[]}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.profileContainer}>
                    <FontAwesome name="user" size={80} color="black" />
                    <Text style={styles.userName}>User Name</Text>
                </View>

                {/* Settings Options */}
                <View style={styles.settingsItem}>
                    <FontAwesome name="user" size={24} color="black" />
                    <Text style={styles.settingsText}>User Profile</Text>
                </View>

                <View style={styles.settingsItem}>
                    <FontAwesome name="moon-o" size={24} color="black" />
                    <Text style={styles.settingsText}>Select Light/Dark Mode</Text>
                    <View style={styles.switchContainer}>
                        <Switch
                        />
                    </View>
                </View>

                <View style={styles.settingsItem}>
                    <FontAwesome name="language" size={24} color="black" />
                    <Text style={styles.settingsText}>Language Preferences</Text>
                </View>

                <View style={styles.settingsItem}>
                    <FontAwesome name="bell" size={24} color="black" />
                    <Text style={styles.settingsText}>Notifications</Text>
                    <View style={styles.switchContainer}>
                        <Switch
                        />
                    </View>
                </View>

                <View style={styles.settingsItem}>
                    <FontAwesome name="lock" size={24} color="black" />
                    <Text style={styles.settingsText}>Change Password</Text>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;

const styles = StyleSheet.create({
    scrollViewContent: {
        padding: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    userName: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    settingsText: {
        marginLeft: 15,
        fontSize: 16,
        flex: 1, 
    },
    switchContainer: {
        justifyContent: 'flex-end',
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 40,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});