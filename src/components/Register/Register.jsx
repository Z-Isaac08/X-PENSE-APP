import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../services/userHelper';
import './register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Illustration from '../../assets/illustration.svg';

const Register = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name.trim() === '') {
            toast.error('Veuillez entrer votre nom.');
            return;
        }

        try {
            const userId = await addUser(name);
            toast.success(`Bienvenue ${name}`);
            navigate(`/h/${userId}`)
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div className='Register'>
            <form onSubmit={handleSubmit} className='form'>
                <h1 className='h1'>Prenez le contrôle de votre <span className='accent'>djai</span></h1>
                <p className='p'>
                    Avec notre Expense Tracker, suivez vos dépenses facilement, <br />
                    établissez des budgets efficaces et optimisez votre gestion financière.
                </p>
                <input
                    type="text"
                    className='for-name'
                    value={name}
                    placeholder='Entrez votre nom'
                    onChange={(e) => setName(e.target.value )}
                    required
                />
                <button className='for-register'>
                    <FontAwesomeIcon icon={faUserPlus} />
                    <span className="text">Commencer</span>
                </button>
            </form>
            <div className="image-container">
                <img src={Illustration} width={600} height={600} />
            </div>

        </div>
    )
}

export default Register