import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import AddUser from './components/addUser'
import NavBar from './components/navBar'
import UserManagement from './components/userManagement'
import AddClub from './components/addClub'
import ClubsList from './components/clubsList'

const App = () => {
  return (
    <Router>
      <div className='App'>
        <NavBar />
        <Routes>
          <Route path="/AddUser" element={<AddUser />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/AddUser" />} />
          <Route path="/AddClub" element={<AddClub />} />
          <Route path="/ClubsList" element={<ClubsList />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App