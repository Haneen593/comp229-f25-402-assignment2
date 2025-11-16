import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
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
                    throw new Error(data.message)
                }

                const data = await response.json();
                setProjects(data);

            } catch (error) {
                console.error(`Error fetching projects: ${error.message}`);
            }
        }
        fetchProjects();
    }, [])

    const handleDelete = async (projectId) => {
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
    }

    return (
        <div className="ProjectListContainer">
            <h2 className="text-center">Projects</h2>
            <button style={{ marginTop: '20px' }} onClick={() => navigate('/project-details')}>Create New Project</button>

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
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project._id}>
                                    <td>{project.title}</td>
                                    <td>{project.firstname}</td>
                                    <td>{project.lastname}</td>
                                    <td>{project.email}</td>
                                    <td>{project.completion}</td>
                                    <td>{project.description}</td>
                                    <td>
                                        <button style={{ marginTop: '20px' }} onClick={() => navigate(`/project-details/${project._id}`)}>Update</button>
                                        <button style={{ marginTop: '20px' }} onClick={() => handleDelete(project._id)}>Delete</button>
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