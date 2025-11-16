import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EducationDetails = () => {
    const [education, setEducation] = useState({
        title: '',
        firstname: '',
        lastname: '',
        email: '',
        completion: '',
        description: ''
    });

    const { id } = useParams();
    const apiUrl = '/api';
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchEducation = async () => {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                try {
                    const response = await fetch(`${apiUrl}/educations/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch education');
                    }

                    const data = await response.json();
                    setEducation({
                        title: data.title,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email,
                        completion: data.completion.split('T')[0],
                        description: data.description
                    });

                } catch (error) {
                    console.error('Error fetching education', error);
                }
            }

            fetchEducation();
        }
    }, [id, apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEducation(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/educations/${id}` : `${apiUrl}/educations`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(education)
            });

            if (!response.ok) {
                throw new Error('Failed to save education');
            }

            navigate('/education');
        } catch (error) {
            console.error('Error saving education', error);
        }
    }

    return (
        <div className="EducationDetailsForm">
            <fieldset>
            <legend className="text-center">{id ? 'Update Education' : 'Create Education'}</legend>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={education.title}  onChange={handleChange} required />
                
                <label htmlFor="firstname">First Name</label>
                <input type="text" id="firstname" name="firstname" value={education.firstname} onChange={handleChange} required />
                       
                <label htmlFor="lastname">Last Name</label>
                <input type="text" id="lastname" name="lastname" value={education.lastname} onChange={handleChange} required />
                        
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={education.email} onChange={handleChange} required />
                       
                <label htmlFor="completion">Completion</label>
                <input type="date" id="completion" name="completion" value={education.completion} onChange={handleChange} required />
                       
                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" value={education.description} onChange={handleChange} required />
                    
                <button type="submit"  style={{ marginTop: '20px' }} className="btn btn-primary">
                    {id ? 'Update' : 'Create'}
                </button>
            </form>
            </fieldset>
        </div>
    )
};

export default EducationDetails;