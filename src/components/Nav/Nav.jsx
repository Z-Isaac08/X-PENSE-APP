import React, { useEffect, useState } from 'react';
import { deleteUser } from '../../services/userHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './nav.css';
import Logo from "../../assets/logo.svg"
import { toast } from 'react-toastify';

const Nav = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    const handleDelete = async () => {
        try {
            await deleteUser(user.id);
            toast.success("Compte supprimé avec succès")
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async () => {
        window.location.href = `/h/${user.id}`
    }

    return (
        <nav className="nav">
            {!user ?
                <>
                    <div className="name-logo">
                        <img src={Logo} className='logo' />
                        <p className='name-app'><span>X</span>pense</p>
                    </div>
                </>
                :
                <>
                    <div className="name-logo" onClick={handleSubmit}>
                        <img src={Logo} className='logo' />
                        <p className='name-app'><span>X</span>pense</p>
                    </div>
                    <button className='for-sup' onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} />
                        <span className="text">Suprimer cet compte</span>
                    </button>
                </>
            }
        </nav>
    )
    
}

export default Nav