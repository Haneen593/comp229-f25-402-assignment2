import { Link } from 'react-router-dom';

export default function Layout() {
    return (
        <>
        <header>
           <img src = "logo.png"  className = "logo" alt = "logo" />
           <h2>My Portfolio</h2>
        </header>
            
            <div className = "navigationBar">
            <nav>
                <Link to="/">Home</Link> |{" "}
                <Link to="/about">About</Link> |{" "}
                <Link to="/projects">Projects</Link> |{" "}
                <Link to="/education">Education</Link> |{" "}
                <Link to="/services">Services</Link> |{" "}
                <Link to="/contact">Contact</Link>
            </nav>
            </div>
        </>
    )
}