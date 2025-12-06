import { useNavigate } from 'react-router-dom';
import "../Styles/Home.css";

export default function Home() {
    const navigate = useNavigate();
    
    return (
        <>
            <div className="message">
                <h1>Welcome to My Portfolio</h1>
                <p>My mission is to grow as a software engineer 
                by committing to continuous learning and enhancing my skills in AI and software development, 
                so I can contribute to meaningful projects that improve everyday life.
                </p>
            </div>
            
            <button type="button"
            onClick={() => navigate('/about')}>More about me</button>
        </>
    );
}
