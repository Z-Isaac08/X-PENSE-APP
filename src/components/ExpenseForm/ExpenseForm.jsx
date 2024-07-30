import React, { useState } from 'react';
import { addExpense, formatDate } from '../../services/expenseHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const ExpenseForm = ({ budgets, onExpense }) => {
    const [newExpense, setNewExpense] = useState({ name: '', amount: '', budgetId: '' });
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newExpense.name.trim() === '' || newExpense.amount.trim() === '' || newExpense.budgetId.trim() === '') {
            toast.error('Veuillez entrer le nom, le montant et la catégorie de la dépense.');
            return;
        }

        try {
            const expense = {
                name: newExpense.name,
                amount: parseFloat(newExpense.amount),
                budget: newExpense.budgetId,
                date: formatDate(Date.now())
            };
            await addExpense(user.id, expense);
            toast.success('Dépense ajoutée avec succès !');
            // Réinitialiser le formulaire ou mettre à jour l'interface utilisateur si nécessaire
            setNewExpense({ name: '', amount: '', budgetId: '' });
            if (onExpense) onExpense();
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de l\'ajout de la dépense.');
        }
    };

    return (
        <div className='form-wrapper'>
            <form className="expense" onSubmit={handleSubmit}>
                <h2>Nouvelle dépense</h2>
                <input
                    type="text"
                    className='for-input'
                    value={newExpense.name}
                    placeholder='Nom de dépense'
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                    required
                />
                <input
                    type='number'
                    className='for-input'
                    value={newExpense.amount}
                    placeholder='Montant'
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    required
                />
                <select
                    className='for-input'
                    value={newExpense.budgetId}
                    onChange={(e) => setNewExpense({ ...newExpense, budgetId: e.target.value })}
                >
                    <option value="" disabled>Sélectionner un budget</option>
                    {budgets.map(budget => (
                        <option key={budget.id} value={budget.name}>
                            {budget.name}
                        </option>
                    ))}
                </select>
                <button className='for-register' type="submit">
                    <FontAwesomeIcon icon={faCirclePlus} />
                    <span className="text">Ajouter dépense</span>
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
