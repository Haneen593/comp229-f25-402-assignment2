import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ContactDetails = () => {
    const [contact, setContact] = useState({
        firstname: '',
        lastname: '',
        email: ''
    });

    const { id } = useParams();
    const apiUrl = '/api';
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchContact = async () => {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                try {
                    const response = await fetch(`${apiUrl}/contacts/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch contact');
                    }

                    const data = await response.json();
                    setContact({
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email
                    });

                } catch (error) {
                    console.error('Error fetching contact', error);
                }
            }

            fetchContact();
        }
    }, [id, apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContact(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/contacts/${id}` : `${apiUrl}/contacts`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(contact)
            });

            if (!response.ok) {
                throw new Error('Failed to save contact');
            }

            navigate('/contact');
        } catch (error) {
            console.error('Error saving contact', error);
        }
    }

    return (
        <div className="ContactDetailsForm">
            <fieldset>
            <legend className="text-center">{id ? 'Update Contact' : 'Create Contact'}</legend>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstname">First Name</label>
                <input type="text" id="firstname" name="firstname" value={contact.firstname} onChange={handleChange} required />
                       
                <label htmlFor="lastname">Last Name</label>
                <input type="text" id="lastname" name="lastname" value={contact.lastname} onChange={handleChange} required />
                        
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={contact.email} onChange={handleChange} required />
                    
                <button type="submit"  style={{ marginTop: '20px' }} className="btn btn-primary">
                    {id ? 'Update' : 'Create'}
                </button>
            </form>
            </fieldset>
        </div>
    )
};

export default ContactDetails;