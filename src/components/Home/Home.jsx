import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { faCircleInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import BudgetForm from '../BudgetForm/budgetForm';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import Table from '../Table/Table';
import { getAllBudgets} from '../../services/budgetHelper';
import './home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllExpenses, getBudgetExpenses } from '../../services/expenseHelper';
import Progressbar from '../ProgressBar/Progressbar';

const Home = () => {
    const { userId } = useParams();
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const fetchBudgets = async () => {
        if (!userId) return;

        try {
            const budgetsData = await getAllBudgets(userId);
            const expensesData = await getAllExpenses(userId);
            const budgetsWithExpenses = await getBudgetExpenses(userId);
            setBudgets(budgetsWithExpenses);
            setExpenses(expensesData);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const HandleBudget = (id) => {
        navigate(`/h/${userId}/budgets/${id}`);
    }

    useEffect(() => {
        fetchBudgets();
    }, [userId])

    if (!user || user.id !== userId) {
        return <Navigate to="/" />;
    }

    return (
        <div className='home'>
            <h1 className='h1-text'>Bienvenue, <span className="accent">{user.name}!</span></h1>
            {
                budgets.length === 0 ? <BudgetForm onBudget={fetchBudgets} />
                    :
                    <>
                        <div className="wrapper">
                            <BudgetForm onBudget={fetchBudgets} />
                            <ExpenseForm budgets={budgets} onExpense={fetchBudgets} />
                        </div>
                        <div className="rest-box">
                            <h2 className='cat'>Catégories récentes</h2>
                            <div className="all-budgets">
                                {budgets.map(budget => (
                                    <div className="budget-box" key={budget.id}>
                                        <div className="prog-text">
                                            <h3 className='h3-text'>{budget.name}</h3>
                                            <p className='p-text'>{budget.amount} FCFA</p>
                                        </div>
                                        <Progressbar zspent={(budget.spent / budget.amount) * 100} />
                                        <div className="prog-text">
                                            <p className='p-small'>{budget.spent} dépensé</p>
                                            <p className='p-small'>{budget.amount - budget.spent} FCFA restant</p>
                                        </div>
                                        <button className='for-details' onClick={() => HandleBudget(budget.id)}>
                                            <FontAwesomeIcon icon={faCircleInfo} />
                                            <span className="text">Détails</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rest-box">
                            <h2 className='cat'>Dépenses récentes</h2>
                            <div className="all-expenses">
                                <Table expenses={expenses} onTable={fetchBudgets} />
                            </div>
                        </div>
                    </>
            }
        </div>
    );
};

export default Home;
