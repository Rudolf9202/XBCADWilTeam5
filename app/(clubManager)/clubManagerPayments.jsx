import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants'; 

const clubManagerPayments = () => {
    // Dummy data
    const paymentData = {
        clubName: 'Neon Night Club',
        clubLogo: 'URL', // Placeholder for club logo URL
        payments: {
            Thursday: 750.00,
            Friday: 950.00,
            Saturday: 500.00,
            Sunday: 1250.00,
        },
        total: 3450.00
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={images.background} style={styles.background}>
                {/* Semi-transparent Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>Payments Page</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Club Name and Logo */}
                    <View style={styles.clubInfo}>
                        <Text style={styles.clubName}>{paymentData.clubName}</Text>
                        <Image 
                            source={{ uri: paymentData.clubLogo }} 
                            style={styles.clubLogo}
                            resizeMode='contain'
                        />
                    </View>

                    {/* Payments List */}
                    <View style={styles.paymentDetails}>
                        <Text style={styles.sectionTitle}>Total Invoice to Pay</Text>

                        {Object.keys(paymentData.payments).map((day, index) => (
                            <View key={index} style={styles.paymentRow}>
                                <Text style={styles.dayText}>{day}:</Text>
                                <Text style={styles.amountText}>R {paymentData.payments[day].toFixed(2)}</Text>
                            </View>
                        ))}

                        {/* Total */}
                        <View style={styles.paymentRow}>
                            <Text style={[styles.dayText, { fontWeight: 'bold' }]}>Total for the Week:</Text>
                            <Text style={[styles.amountText, { fontWeight: 'bold', color: 'red' }]}>
                                R {paymentData.total.toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    {/* Payment Button */}
                    <TouchableOpacity style={styles.paymentButton}>
                        <Text style={styles.paymentButtonText}>Make Payment</Text>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        height: '100%',
        width: '100%',
    },
    header: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        padding: 15,
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clubInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    clubName: {
        fontSize: 22, 
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 10,
    },
    clubLogo: {
        width: 100,
        height: 100,
    },
    paymentDetails: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    dayText: {
        fontSize: 16,
        color: '#333',
    },
    amountText: {
        fontSize: 16,
        color: '#333',
    },
    paymentButton: {
        backgroundColor: '#E21A1A', 
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 5,
        marginTop: 20,
    },
    paymentButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default clubManagerPayments;