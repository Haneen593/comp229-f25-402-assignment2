import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProjectDetails = () => {
    const [project, setProject] = useState({
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
            const fetchProject = async () => {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                try {
                    const response = await fetch(`${apiUrl}/projects/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch project');
                    }

                    const data = await response.json();
                    setProject({
                        title: data.title,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email,
                        completion: data.completion.split('T')[0],
                        description: data.description
                    });

                } catch (error) {
                    console.error('Error fetching project', error);
                }
            }

            fetchProject();
        }
    }, [id, apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/projects/${id}` : `${apiUrl}/projects`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(project)
            });

            if (!response.ok) {
                throw new Error('Failed to save project');
            }

            navigate('/projects');
        } catch (error) {
            console.error('Error saving project', error);
        }
    }

    return (
        <div className="ProjectDetailsForm">
            <fieldset>
            <legend className="text-center">{id ? 'Update Project' : 'Create Project'}</legend>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={project.title}  onChange={handleChange} required />
                
                <label htmlFor="firstname">First Name</label>
                <input type="text" id="firstname" name="firstname" value={project.firstname} onChange={handleChange} required />
                       
                <label htmlFor="lastname">Last Name</label>
                <input type="text" id="lastname" name="lastname" value={project.lastname} onChange={handleChange} required />
                        
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={project.email} onChange={handleChange} required />
                       
                <label htmlFor="completion">Completion</label>
                <input type="date" id="completion" name="completion" value={project.completion} onChange={handleChange} required />
                       
                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" value={project.description} onChange={handleChange} required />
                    
                <button type="submit"  style={{ marginTop: '20px' }} className="btn btn-primary">
                    {id ? 'Update' : 'Create'}
                </button>
            </form>
            </fieldset>
        </div>
    )
};

export default ProjectDetails;