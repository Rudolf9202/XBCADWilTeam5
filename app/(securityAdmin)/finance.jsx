import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getEstimatedAmountsForAllClubs, getAmountsForAllSecurityPersonnel } from '../../Backend/securityAdmin';

const Finance = () => {
  const router = useRouter();
  const [showSection, setShowSection] = useState(null);
  const [estimatedAmounts, setEstimatedAmounts] = useState({});
  const [personnelAmounts, setPersonnelAmounts] = useState({});

  useEffect(() => {
    const fetchEstimatedAmounts = async () => {
      try {
        const amounts = await getEstimatedAmountsForAllClubs();
        setEstimatedAmounts(amounts);
      } catch (error) {
        console.error('Error fetching estimated amounts:', error);
      }
    };

    const fetchPersonnelAmounts = async () => {
      try {
        const amounts = await getAmountsForAllSecurityPersonnel();
        setPersonnelAmounts(amounts);
      } catch (error) {
        console.error('Error fetching personnel amounts:', error);
      }
    };

    fetchEstimatedAmounts();
    fetchPersonnelAmounts();
  }, []);

  const toggleSection = (section) => {
    setShowSection((prevSection) => (prevSection === section ? null : section));
  };

  const renderCosts = (costs) => {
    return costs.map(({ day, amount }) => (
      <View style={styles.row} key={day}>
        <Text style={styles.summaryTextTitle2}>{day}:</Text>
        <Text style={styles.summaryTextData}>R{amount}</Text>
      </View>
    ));
  };

  const renderClubCosts = (clubName, costs, currentWeekRange, nextWeekRange) => (
    <View key={clubName} style={styles.clubContainer}>
      <View style={styles.clubCosts}>
        <Text style={styles.clubName}>{clubName}</Text>
        {costs.currentWeek.length > 0 && (
          <>
            <Text style={styles.summaryTextTitle}>
              This Week: <Text style={styles.dateText}> ({currentWeekRange})</Text>
            </Text>
            {renderCosts(costs.currentWeek)}
          </>
        )}
        {costs.nextWeek.length > 0 && (
          <>
            <Text style={styles.summaryTextTitle}>
              Next Week: <Text style={styles.dateText}> ({nextWeekRange})</Text>
            </Text>
            {renderCosts(costs.nextWeek)}
          </>
        )}
        <View style={styles.row}>
          <Text style={styles.summaryTextTitle}>Estimated Earn:</Text>
          <Text style={styles.summaryTextData}>R
            {costs.currentWeek.reduce((total, { amount }) => total + amount, 0) +
             costs.nextWeek.reduce((total, { amount }) => total + amount, 0)}
          </Text>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );

  const renderPersonnelCosts = (personnel) => {
    return personnel.map(({ name, currentWeekAmount, nextWeekAmount }) => (
      <View key={name} style={styles.clubContainer}>
        <View style={styles.clubCosts}>
          <Text style={styles.clubName}>{name}</Text>
          <Text style={styles.summaryTextTitle}>This Week:</Text>
          <View style={styles.row}>
            <Text style={styles.summaryTextTitle2}>Actual Amount:</Text>
            <Text style={styles.summaryTextData}>R{currentWeekAmount}</Text>
          </View>
          <Text style={styles.summaryTextTitle}>Next Week:</Text>
          <View style={styles.row}>
            <Text style={styles.summaryTextTitle2}>Estimated Amount:</Text>
            <Text style={styles.summaryTextData}>R{nextWeekAmount}</Text>
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    ));
  };

  return (
    <SafeAreaView edges={[]}>
      <ImageBackground source={images.background} className='h-full w-full'>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

          <View style={styles.header}>
            <Text style={styles.headerText}>Finance Management</Text>
          </View>

          {/* Payments from Specific Club Dropdown */}
          {/* <View style={styles.summary}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => toggleSection('clubPayments')}
            >
              <Text style={styles.summaryTitle}>Payments from ...</Text>
              <Ionicons
                name={showSection === 'clubPayments' ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="black"
              />
            </TouchableOpacity>

            {showSection === 'clubPayments' && (
              <View style={styles.extraInfo}>
                <Text style={styles.summaryTextTitle}>Breakdown by Night:</Text>
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle2}>Monday:</Text>
                  <Text style={styles.summaryTextData}>200</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle2}>Tuesday:</Text>
                  <Text style={styles.summaryTextData}>200</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle2}>Wednesday:</Text>
                  <Text style={styles.summaryTextData}>200</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle}>Total Earned:</Text>
                  <Text style={styles.summaryTextData}>600</Text>
                </View>
              </View>
            )}
          </View> */}

          {/* Payments from All Clubs Dropdown */}
          <View style={styles.summary}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => toggleSection('allClubsPayments')}
            >
              <Text style={styles.summaryTitle}>Payments from All Clubs</Text>
              <Ionicons
                name={showSection === 'allClubsPayments' ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="black"
              />
            </TouchableOpacity>
            {showSection === 'allClubsPayments' && (
              <View style={styles.extraInfo}>
                {/* Breakdown by night */}
                {Object.entries(estimatedAmounts.clubs || {}).map(([clubName, costs]) =>
                  renderClubCosts(clubName, costs, estimatedAmounts.currentWeekRange, estimatedAmounts.nextWeekRange)
                )}
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle}>Total Estimated Earn:</Text>
                  <Text style={styles.summaryTextData}>R
                    {Object.values(estimatedAmounts.clubs || {}).reduce((acc, clubCosts) => {
                      const thisWeekTotal = clubCosts.currentWeek.reduce((sum, { amount }) => sum + amount, 0);
                      const nextWeekTotal = clubCosts.nextWeek.reduce((sum, { amount }) => sum + amount, 0);
                      return acc + thisWeekTotal + nextWeekTotal;
                    }, 0)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Payments to Bouncers Dropdown */}
          <View style={styles.summary}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => toggleSection('bouncersPayments')}
            >
              <Text style={styles.summaryTitle}>Payments to Security Personnel</Text>
              <Ionicons
                name={showSection === 'bouncersPayments' ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="black"
              />
            </TouchableOpacity>

            {showSection === 'bouncersPayments' && (
              <View style={styles.extraInfo}>
                {/* Breakdown by night */}
                {renderPersonnelCosts(personnelAmounts.personnel || [])}
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle}>Total Payments:</Text>
                  <Text style={styles.summaryTextData}>R
                    {personnelAmounts.personnel.reduce((acc, { currentWeekAmount, nextWeekAmount }) => acc + currentWeekAmount + nextWeekAmount, 0)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Profit Dropdown */}
          <View style={styles.summary}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => toggleSection('profit')}
            >
              <Text style={styles.summaryTitle}>Profit</Text>
              <Ionicons
                name={showSection === 'profit' ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="black"
              />
            </TouchableOpacity>

            {showSection === 'profit' && (
              <View style={styles.extraInfo}>
                {/* Breakdown by night */}
                <Text style={styles.summaryTextTitle}>Breakdown by Night:</Text>
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle2}>Monday:</Text>
                  <Text style={styles.summaryTextData}>200</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle2}>Tuesday:</Text>
                  <Text style={styles.summaryTextData}>200</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle2}>Wednesday:</Text>
                  <Text style={styles.summaryTextData}>200</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.summaryTextTitle}>Total Profit:</Text>
                  <Text style={styles.summaryTextData}>600</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttonsContainer}>
            <CustomButton
              title="View Data Analytics"
              handlePress={() => router.push('dataAnalytics')}
              customStyle={styles.button}
              textStyle={styles.buttonText}
            />
            <CustomButton
              title="Back"
              handlePress={() => router.push('securityAdminHome')}
              customStyle={styles.button}
              textStyle={styles.buttonText}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15, // Reduced width by adding margin on sides
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Shadow effect
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryTextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'red',
  },
  summaryTextTitle2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryTextData: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  dateText: {
    fontSize: 15,
    color: 'black',
  },
  extraInfo: {
    marginTop: 10,
  },
  buttonsContainer: {
    marginTop: 30,
    marginHorizontal: 40,
  },
  button: {
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  clubContainer: {
    marginBottom: 20,
  },
  clubCosts: {
    marginBottom: 20,
  },
  clubName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#d3d3d3',
    marginVertical: 10,
  },
});

export default Finance;