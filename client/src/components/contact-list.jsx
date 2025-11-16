import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactsList = () => {
    const [contacts, setContacts] = useState([]);
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
                    throw new Error(data.message)
                }

                const data = await response.json();
                setContacts(data);

            } catch (error) {
                console.error(`Error fetching contacts: ${error.message}`);
            }
        }
        fetchContacts();
    }, [])

    const handleDelete = async (contactId) => {
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
    }

    return (
        <div className="ContactsListContainer">
            <h2 className="text-center">Contacts</h2>
            <button style={{ marginTop: '20px' }} onClick={() => navigate('/contact-details')}>Create New Contact</button>

            {contacts.length > 0 ? (
                <>
                    <table className="contactsTable">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact) => (
                                <tr key={contact._id}>
                                    <td>{contact.firstname}</td>
                                    <td>{contact.lastname}</td>
                                    <td>{contact.email}</td>
                                    <td>
                                        <button style={{ marginTop: '20px' }} onClick={() => navigate(`/contact-details/${contact._id}`)}>Update</button>
                                        <button style={{ marginTop: '20px' }} onClick={() => handleDelete(contact._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>)
                :
                (
                    <>
                        <p className='text-center'>No contacts available</p>
                    </>
                )}

        </div>
    )
}

export default ContactsList;