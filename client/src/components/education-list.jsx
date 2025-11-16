import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EducationList = () => {
    const [educations, setEducations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('/api/educations', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(data.message)
                }

                const data = await response.json();
                setEducations(data);

            } catch (error) {
                console.error(`Error fetching educations: ${error.message}`);
            }
        }
        fetchEducation();
    }, [])

    const handleDelete = async (educationId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            console.error('No token found, redirecting to login');
            return;
        }

        try {
            const response = await fetch(`/api/educations/${educationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete education');
            }

            setEducations(prevEducations => prevEducations.filter(education => education._id !== educationId));
        } catch (error) {
            console.error(`Error deleting education: ${error.message}`);
        }
    }

    return (
        <div className="EducationListContainer">
            <h2 className="text-center">Educations</h2>
            <button style={{ marginTop: '20px' }} onClick={() => navigate('/education-details')}>Create New Education</button>

            {educations.length > 0 ? (
                <>
                    <table className="educationsTable">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Completion</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {educations.map((education) => (
                                <tr key={education._id}>
                                    <td>{education.title}</td>
                                    <td>{education.firstname}</td>
                                    <td>{education.lastname}</td>
                                    <td>{education.email}</td>
                                    <td>{education.completion}</td>
                                    <td>{education.description}</td>
                                    <td>
                                        <button style={{ marginTop: '20px' }} onClick={() => navigate(`/education-details/${education._id}`)}>Update</button>
                                        <button style={{ marginTop: '20px' }} onClick={() => handleDelete(education._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>)
                :
                (
                    <>
                        <p className='text-center'>No educations available</p>
                    </>
                )}

        </div>
    )
}

export default EducationList;