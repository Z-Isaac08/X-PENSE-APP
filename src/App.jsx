import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BudgetPage from './components/BudgetPage/BudgetPage';
import Nav from './components/Nav/Nav';
import Home from './components/Home/Home';
import Register from './components/Register/Register';

const App = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <>
            <Nav />
            <Router>
                <Routes>
                    <Route path="/" element={user ? <Navigate to={`/h/${user.id}`} /> : <Register />} />
                    <Route path="/h/:userId" element={<Home />} />
                    <Route path="/h/:userId/budgets/:budgetID" element={<BudgetPage />} />
                </Routes>
            </Router>
            <ToastContainer />
        </>
    );
};

export default App;
