// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BudgetPage from './components/BudgetPage/BudgetPage';
import Nav from './components/Nav/Nav';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Footer from './components/Footer/Footer';
import './App.css';

const App = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Router>
            <div className="app-container">
                <Nav />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={user ? <Navigate to={`/h/${user.id}`} /> : <Register />} />
                        <Route path="/h/:userId" element={<Home />} />
                        <Route path="/h/:userId/budgets/:budgetID" element={<BudgetPage />} />
                    </Routes>
                </main>
                <Footer />
                <ToastContainer />
            </div>
        </Router>
    );
};

export default App;
