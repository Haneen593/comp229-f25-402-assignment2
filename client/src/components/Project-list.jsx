import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/Project-list.css";

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('/api/projects', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch projects')
                }

                const data = await response.json();
                setProjects(data);

            } catch (error) {
                console.error(`Error fetching projects: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, [navigate])

    const handleDelete = useCallback(async (projectId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            console.error('No token found, redirecting to login');
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));

        } catch (error) {
            console.error(`Error deleting project: ${error.message}`);
        }
    }, [navigate]);

    const formatDate = useCallback((iso) => {
        try {
            return new Date(iso).toLocaleDateString();
        } catch {
            return iso;
        }
    }, []);

    if (loading) {
        return <div style={{textAlign: 'center', padding: '2rem'}}>Loading projects...</div>;
    }

    return (
        <div className="ProjectListContainer">
            <div className="page-header">
                <h1>Projects</h1>
                <button className="create-btn" onClick={() => navigate('/project-details')}>Create New Project</button>
            </div>

            {projects.length > 0 ? (
                <>
                    <table className="projectsTable">
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
                            {projects.map((project) => (
                                <tr key={project._id}>
                                    <td><a className="title-link" href={`/project-details/${project._id}`}>{project.title || 'Untitled'}</a></td>
                                    <td>{project.firstname}</td>
                                    <td>{project.lastname}</td>
                                    <td>{project.email}</td>
                                    <td>{formatDate(project.completion)}</td>
                                    <td>{project.description}</td>
                                    <td className="text-center">
                                        <button className="action-btn" onClick={() => navigate(`/project-details/${project._id}`)}>Update</button>
                                        <button className="action-btn delete" onClick={() => handleDelete(project._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>)
                :
                (
                    <>
                        <p className='text-center'>No projects available</p>
                    </>
                )}

        </div>
    )
}

export default ProjectList;