import React, { useState } from 'react';
import { addBudget, verifyBudgetName } from '../../services/budgetHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import './budgetform.css';
import { toast } from 'react-toastify';

const BudgetForm = ({ onBudget }) => {
    const [newBudget, setNewBudget] = useState({ name: '', amount: '' ,});
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newBudget.name.trim() === '' || newBudget.amount.trim() === '') {
            toast.error('Veuillez entrer le nom et le montant du budget.');
            return;
        }

        try {
            const names = await verifyBudgetName(user.id);

            if (names.includes(newBudget.name)) {
                toast.error('Catégorie existante');
                return;
            }

            const budget = {
                name: newBudget.name,
                amount: parseFloat(newBudget.amount),
            };

            await addBudget(user.id, budget);
            toast.success('Catégorie ajoutée avec succès !');
            if (onBudget) onBudget(); // Utilisation de navigate pour la redirection
        } catch (error) {
            toast.error('Erreur lors de l\'ajout du budget.');
        }
    };

    return (
        <div className='form-wrapper'>
            <form className="budget" onSubmit={handleSubmit}>
                <h2>Nouvelle catégorie</h2>
                <input
                    type="text"
                    className='for-input'
                    value={newBudget.name}
                    placeholder='Nom de catégorie'
                    onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                    required
                />
                <input
                    type='number'
                    className='for-input'
                    value={newBudget.amount}
                    placeholder='Solde de catégorie'
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    required
                />
                <button className='for-register' type="submit">
                    <FontAwesomeIcon icon={faCirclePlus} />
                    <span className="text">Créer catégorie</span>
                </button>
            </form>
        </div>
    );
};

export default BudgetForm;
