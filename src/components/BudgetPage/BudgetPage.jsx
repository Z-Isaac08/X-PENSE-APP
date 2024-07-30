import React, { useEffect, useState } from 'react';
import './budgetpage.css';
import { getExpenseBudget, getExpensesByBudget } from '../../services/expenseHelper';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { deleteBudget, getBudgetsbyID } from '../../services/budgetHelper';
import Table from '../Table/Table';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Progressbar from '../ProgressBar/Progressbar';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { toast } from 'react-toastify';

const BudgetPage = () => {
    const { userID, budgetID } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(null);
    const [spent, setSpent] = useState(0);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/" />;
    }

    const fetchExpenses = async () => {
        try {
            const expensesData = await getExpensesByBudget(user.id, budgetID);
            const budgetData = await getBudgetsbyID(user.id, budgetID);
            const spent =  await getExpenseBudget(user.id, budgetID);
            setExpenses(expensesData);
            setBudget(budgetData);
            setSpent(spent);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [user.id, budgetID]);

    const handleDelete = async () => {
        try {
            const del = await deleteBudget(user.id, budgetID);
            toast.success('Catégorie supprimée')
            navigate(`/h/${user.id}`)
        } catch (error) {
            toast.error('Echec lors de la suppression')
        }
    }

    if (!budget) {
        return <div>Chargement...</div>;
    }

    return (
        <div className='budget-page'>
            <h1 className='h1-text'><span className="accent">{budget.name}</span> Overview</h1>
            <div className="all-budget">
                <div className="budget-box" key={budget.id}>
                    <div className="prog-text">
                        <h3 className='h3-text'>{budget.name}</h3>
                        <p className='p-text'>{budget.amount} FCFA</p>
                    </div>
                    <Progressbar spent={(spent / budget.amount) * 100} />
                    <div className="prog-text">
                        <p className='p-small'>{spent} dépensé</p>
                        <p className='p-small'>{budget.amount - spent} FCFA restant</p>
                    </div>
                    <button className='for-details' onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} />
                        <span className="text">Supprimer</span>
                    </button>
                </div>
                <ExpenseForm budgets={[budget]} onExpense={fetchExpenses}/>
            </div>
            
            <div className="rest-box">
                <h2 className='cat'>Dépenses récentes</h2>
                <div className="all-expenses">
                    <Table expenses={expenses} onTable={fetchExpenses} />
                </div>
            </div>
        </div>
    );
};

export default BudgetPage;
