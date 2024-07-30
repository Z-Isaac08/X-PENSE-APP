import React from 'react';
import './table.css'
import { deleteExpense } from '../../services/expenseHelper';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Table = ({ expenses, onTable }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const handleDelete = async (id) => {
        try {
            const del = await deleteExpense(user.id, id);
            toast.success('Dépense supprimée')
            if (onTable) onTable();
        } catch (error) {
            toast.error('Echec lors de la suppression')
        }
    }

    return (
        <div className='table'>
            <table className='expense-table'>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Montant</th>
                        <th>Catégorie</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(expense => (
                        <tr key={expense.id}>
                            <td>{expense.name}</td>
                            <td>{expense.amount}</td>
                            <td>{expense.budget}</td>
                            <td>{expense.date}</td>
                            <td>
                                <button  className='for-sup' onClick={() => handleDelete(expense.id)}><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table