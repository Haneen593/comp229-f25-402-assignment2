import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/contact-list.css";

const ContactsList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('/api/contacts', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch contacts')
                }

                const data = await response.json();
                setContacts(data);

            } catch (error) {
                console.error(`Error fetching contacts: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
        fetchContacts();
    }, [navigate])

    const handleDelete = useCallback(async (contactId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            console.error('No token found, redirecting to login');
            return;
        }

        try {
            const response = await fetch(`/api/contacts/${contactId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete contact');
            }

            setContacts(prevContacts => prevContacts.filter(contact => contact._id !== contactId));
        } catch (error) {
            console.error(`Error deleting contact: ${error.message}`);
        }
    }, [navigate]);

    if (loading) {
        return <div style={{textAlign: 'center', padding: '2rem'}}>Loading contacts...</div>;
    }

    return (
        <div className="ProjectListContainer">
            <div className="page-header">
                <h1>Contacts</h1>
                <button className="create-btn" onClick={() => navigate('/contact-details')}>Create New Contact</button>
            </div>

            {contacts.length > 0 ? (
                <>
                    <table className="projectsTable contactsTable">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact) => (
                                <tr key={contact._id}>
                                    <td>{contact.firstname}</td>
                                    <td>{contact.lastname}</td>
                                    <td>{contact.email}</td>
                                    <td className="text-center">
                                        <button className="action-btn" onClick={() => navigate(`/contact-details/${contact._id}`)}>Update</button>
                                        <button className="action-btn delete" onClick={() => handleDelete(contact._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>) : (
                    <>
                        <p className='text-center'>No contacts available</p>
                    </>
                )}

        </div>
    )
}

export default ContactsList;