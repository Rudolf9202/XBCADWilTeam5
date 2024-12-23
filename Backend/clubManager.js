import { db } from './firebaseConfig';
import { ref, set, get, child, update } from 'firebase/database';

// adding security personnel needed: 
export const addPersonnelNeeded = async (clubName, week, day, personnelNum) => {
  try {
    const clubRef = ref(db, `Clubs/${clubName}/Shifts/${week}/${day}`);
    await set(clubRef, personnelNum);

    const clubRefFinances = ref(db, `Clubs/${clubName}/rate`);
    const rateSnapshot = await get(clubRefFinances);
    let rate = 0;
    if (rateSnapshot.exists()) {
      rate = rateSnapshot.val();
      const amountDue= rate *personnelNum;

      const financesRef = ref(db, `Clubs/${clubName}/Finances/${week}/${day}`);
      await set(financesRef, {
      estimatedAmount: amountDue,
    });
    } else {
      console.error('Rate not found for club:', clubName);
      throw new Error('Rate not found');
    }

    return clubName;
  } catch (error) {
    console.error('Uploading number of personnel error:', error);
    throw error;
  }
};

// getting a list of clubs by the specific club manager:
export const fetchClubsByManager = async (managerName) => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'Clubs'));
  if (snapshot.exists()) {
    const clubs = snapshot.val();
    const filteredClubs = Object.keys(clubs)
      .filter((clubKey) => clubs[clubKey].manager === managerName)
      .reduce((result, clubKey) => {
        result[clubKey] = clubs[clubKey];
        return result;
      }, {});
    return filteredClubs;
  } else {
    return {};
  }
};

export const getSchedule = async (clubName, week) => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `Clubs/${clubName}/Shifts/${week}`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return [];
  }
};

export const getSecurityPersonnelShifts = async (clubName, dateRange) => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'securityPersonnel'));
  const result = [];

  if (snapshot.exists()) {
    const personnel = snapshot.val();
    for (const email in personnel) {
      const shifts = personnel[email].Shifts;
      if (shifts) {
        for (const range in shifts) {
          // Check if the current shift range matches the given dateRange
          if (range === dateRange) {
            for (const day in shifts[range]) {
              const shift = shifts[range][day];
              if (shift.clubName === clubName) {
                result.push({
                  email,
                  day,
                  attendance: shift.attendance || '',
                  ...personnel[email],
                  shiftDetails: shift
                });
              }
            }
          }
        }
      }
    }
  }
  return result;
};

// adding attendance:  
export const addingAttendance = async (clubName,personnelName, dateRange, day, attendance) => {
  try {
    const personnelRef = ref(db, `securityPersonnel/${personnelName}/Shifts/${dateRange}/${day}`);
    await update(personnelRef, {
      attendance: attendance,
    });

    // Getting the rate of the personnel
    const personnelRateRef = ref(db, `securityPersonnel/${personnelName}/rate`);
    const rateSnapshot = await get(personnelRateRef);
    let rate = 0;
    if (rateSnapshot.exists()) {
      rate = rateSnapshot.val();
    } else {
      console.error('Rate not found for personnel:', personnelName);
      throw new Error('Rate not found');
    }

  if(attendance==="Attended"){
    // finance for personnel get actual:
    const actualIncomeRef = ref(db, `securityPersonnel/${personnelName}/Finances/${dateRange}`);
    const actualSnapshot = await get(actualIncomeRef);
  
    let actual = 0; // Default value if actualAmount is not set
    if (actualSnapshot.exists() && actualSnapshot.val().actualAmount !== undefined) {
    actual = Number(actualSnapshot.val().actualAmount); // Ensure actualAmount is a number
  }
     rate = Number(rate);
    // Calculate the new actual amount
    const newActual = rate + actual;
    // updating actual:
    await update(actualIncomeRef, {
      actualAmount: newActual,
    });

    // finance for club
    const clubRefFinances = ref(db, `Clubs/${clubName}/rate`);
    const rateSnapshot = await get(clubRefFinances);
    let clubRate = 0;
    if (rateSnapshot.exists()) {
      clubRate = rateSnapshot.val();
  
      const financesRef = ref(db, `Clubs/${clubName}/Finances/${dateRange}/${day}`);
      const actualAmountSnapshot = await get(financesRef);
  
      let actualAmount = 0; // Default value if actualAmount is not set
      if (actualAmountSnapshot.exists() && actualAmountSnapshot.val().amountDue !== undefined) {
        actualAmount = Number(actualAmountSnapshot.val().amountDue); // Ensure actualAmount is a number
      }
      clubRate = Number(clubRate);
      // Calculate the new actual amount
      const newActualDue = clubRate + actualAmount;
      // updating actual:
      await update(financesRef, {
        amountDue: newActualDue,
      });
    }
  }
    return attendance;
  } catch (error) {
    console.error('Uploading attendance error:', error);
    throw error;
  }
};

export const getFinances = async (clubName, dateRange) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `Clubs/${clubName}/Finances/${dateRange}`));

    if (snapshot.exists()) {
      const finances = snapshot.val();
      const result = [];

      for (const day in finances) {
        const { amountDue = 0, estimatedAmount = 0 } = finances[day];
        result.push({ day, amountDue, estimatedAmount });
      }

      return result; // List of all days with their amounts
    } else {
      console.warn('No finances found for the given date range.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching finances:', error);
    throw error;
  }
};


export const getAllFinances = async (clubName) => {
  try {
    const clubRefFinances = ref(db, `Clubs/${clubName}/rate`);
    const rateSnapshot = await get(clubRefFinances);
    let rate = 0;
    if (rateSnapshot.exists()) {
      rate = rateSnapshot.val();
    };

    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `Clubs/${clubName}/Finances`));

    if (snapshot.exists()) {
      const finances = snapshot.val();
      const result = [];
      let totalAmount=0;
      let totalAmountEstimate=0;

      // Iterate through all date ranges within the Finances node
      for (const dateRange in finances) {
        const dailyFinances = finances[dateRange];

        // Iterate through each day within the current date range
        for (const day in dailyFinances) {
          const { amountDue = 0, estimatedAmount = 0 } = dailyFinances[day];
          totalAmount +=amountDue;
          totalAmountEstimate += estimatedAmount;
        }
        const numberOfShifts = rate > 0 ? totalAmount / rate : 0;
        const numberOfShiftsEstimate = rate > 0 ? totalAmountEstimate / rate : 0;
        result.push({
          rate:rate,
            dateRange,
            totalAmount,
            numberOfShifts: numberOfShifts.toFixed(0),
            numberOfShiftsEstimate: numberOfShiftsEstimate.toFixed(0),
            totalAmountEstimate,
          });
          totalAmount=0;
          totalAmountEstimate=0;
      }
      return result; 
    } else {
      console.warn('No finances found for the given club.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching finances:', error);
    throw error;
  }
};

export const fetchFinancesByManager = async (managerName) => {
  try {
    // Fetch all clubs managed by the manager
    const clubs = await fetchClubsByManager(managerName);

    if (Object.keys(clubs).length === 0) {
      console.warn('No clubs found for the manager.');
      return {};
    }

    const clubFinances = {};

    for (const clubName in clubs) {
      // Get summarized finances for each club using getAllFinances
      const finances = await getAllFinances(clubName);
      clubFinances[clubName] = finances;
    }

    return clubFinances; // Object with club names as keys and summarized finances as values
  } catch (error) {
    console.error('Error fetching finances by manager:', error);
    throw error;
  }
};
