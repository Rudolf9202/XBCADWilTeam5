import { db } from './firebaseConfig';
import { ref,set, get, child, remove, update } from 'firebase/database';

export const fetchAllClubs = async () => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'Clubs'));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return {};
  }
};

export const fetchAllSecurityPersonnel = async () => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'securityPersonnel'));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return {};
  }
};

export const fetchAllClubManagers = async () => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'clubManager'));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return {};
  }
};

export const fetchPersonnelNeeded = async (clubName) => {
  try {
    // Fetch the club's data to get the opening time
    const clubRef = ref(db, `Clubs/${clubName}`);
    const clubSnapshot = await get(clubRef);
    if (!clubSnapshot.exists()) {
      console.log('No club data available');
      return [];
    }
    const clubData = clubSnapshot.val();
    const openingTime = clubData.openingTime;

    // Fetch the shifts data
    const shiftsRef = ref(db, `Clubs/${clubName}/Shifts`);
    const shiftsSnapshot = await get(shiftsRef);
    if (!shiftsSnapshot.exists()) {
      console.log('No shifts data available');
      return [];
    }
    const weeks = shiftsSnapshot.val();
    const personnelData = [];

    Object.keys(weeks).forEach(week => {
      const days = weeks[week];
      Object.keys(days).forEach(day => {
        personnelData.push({
          week,
          day,
          personnelNum: days[day],
          openingTime 
        });
      });
    });

    return personnelData;
  } catch (error) {
    console.error('Fetching personnel number error:', error);
    throw error;
  }
};

export const fetchSecurityPersonnelFullNames = async () => {
  try {
    const personnelRef = ref(db, 'securityPersonnel');
    const snapshot = await get(personnelRef);
    if (snapshot.exists()) {
      const personnel = snapshot.val();
      const fullNames = Object.values(personnel).map(person => person.fullName);
      return fullNames;
    } else {
      console.log('No data available');
      return [];
    }
  } catch (error) {
    console.error('Fetching security personnel error:', error);
    throw error;
  }
};

export const assignPersonnelToShift = async (personnelName, clubName, week, day, startTime) => {
  try {
    // Fetch all security personnel to find the user with the matching fullName
    const personnelRef = ref(db, 'securityPersonnel');
    const snapshot = await get(personnelRef);
    if (!snapshot.exists()) {
      console.log('No security personnel data available');
      return;
    }

    const personnel = snapshot.val();
    let userId = null;

    // Find the user with the matching fullName
    Object.keys(personnel).forEach(key => {
      if (personnel[key].fullName === personnelName) {
        userId = key;
      }
    });

    if (!userId) {
      console.log(`No user found with the name ${personnelName}`);
      return;
    }

    const shiftData = {
      clubName,
      startTime,
      shiftStatus: 'assigned',
      attendance: ""
    };

    // Save the shift data under the correct user
    const personnelShiftRef = ref(db, `securityPersonnel/${userId}/Shifts/${week}/${day}`);
    await set(personnelShiftRef, shiftData);
    return personnelName;
  } catch (error) {
    console.error('Assigning personnel to shift error:', error);
    throw error;
  }
};