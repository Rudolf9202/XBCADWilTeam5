import React from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const ClubDetails = () => {
  const router = useRouter();
  const { club: clubParam } = useLocalSearchParams();
  const club = JSON.parse(decodeURIComponent(clubParam));

  return (
    <SafeAreaView edges={[]}>
      <ImageBackground source={images.background} style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{club.name}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Club Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color="#E21A1A" />
              <Text style={styles.detailTitle}>Address:</Text>
            </View>
            <Text style={styles.detailText}>{club.address}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={18} color="#E21A1A" />
              <Text style={styles.detailTitle}>Manager:</Text>
            </View>
            <Text style={styles.detailText}>{club.manager}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={18} color="#E21A1A" />
              <Text style={styles.detailTitle}>Contact:</Text>
            </View>
            <Text style={styles.detailText}>{club.contactNum}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#E21A1A" />
              <Text style={styles.detailTitle}>Opening Time:</Text>
            </View>
            <Text style={styles.detailText}>{club.openingTime}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#E21A1A" />
              <Text style={styles.detailTitle}>Closing Time:</Text>
            </View>
            <Text style={styles.detailText}>{club.closingTime}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#E21A1A" />
              <Text style={styles.detailTitle}>Club Rate:</Text>
            </View>
            <Text style={styles.detailText}>{club.rate}</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => router.push(`/clubManagerPayments?club=${encodeURIComponent(JSON.stringify(club))}`)}
              style={styles.button}>
              <Text style={styles.buttonText}>Payments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push(`/schedule?club=${encodeURIComponent(JSON.stringify(club))}`)}
              style={styles.button}>
              <Text style={styles.buttonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
  },
  header: { padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.7)' },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#E21A1A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '48%', // Take half the width of the container
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ClubDetails;