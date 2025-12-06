import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/education-list.css";

const EducationList = () => {
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
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
                    throw new Error('Failed to fetch educations')
                }

                const data = await response.json();
                setEducations(data);

            } catch (error) {
                console.error(`Error fetching educations: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
        fetchEducation();
    }, [navigate])

    const handleDelete = useCallback(async (educationId) => {
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
    }, [navigate]);

    const formatDate = useCallback((iso) => {
        try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
    }, []);

    if (loading) {
        return <div style={{textAlign: 'center', padding: '2rem'}}>Loading education...</div>;
    }

    return (
        <div className="ProjectListContainer">
            <div className="page-header">
                <h1>Education</h1>
                <button className="create-btn" onClick={() => navigate('/education-details')}>Create New Education</button>
            </div>

            {educations.length > 0 ? (
                <>
                    <table className="projectsTable educationsTable">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Completion</th>
                                <th>Description</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {educations.map((education) => (
                                <tr key={education._id}>
                                    <td>{education.title || 'Untitled'}</td>
                                    <td>{education.firstname}</td>
                                    <td>{education.lastname}</td>
                                    <td>{education.email}</td>
                                    <td>{formatDate(education.completion)}</td>
                                    <td>{education.description}</td>
                                    <td className="text-center">
                                        <button className="action-btn" onClick={() => navigate(`/education-details/${education._id}`)}>Update</button>
                                        <button className="action-btn delete" onClick={() => handleDelete(education._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>) : (
                    <>
                        <p className='text-center'>No educations available</p>
                    </>
                )}

        </div>
    )
}

export default EducationList;