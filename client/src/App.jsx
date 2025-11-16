import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Education from './components/Education';
import Projects from './components/Projects';
import Services from './components/Services';
import Signup from './components/SignUp';
import Login from './components/Login';
import ProjectList from './components/Project-list';
import ProjectDetails from './components/project-details';
import EducationDetails from './components/education-details';
import EducationList from './components/education-list';
import ContactDetails from './components/contact-details';
import ContactsList from './components/contact-list';

function App() {

  const getUserFromStorage = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    return token && username ? { username } : null;
  }

  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    setUser(getUserFromStorage());
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  }
  
  return (
    <>
    <Router>
    <header>
      <img src = "logo.png"  className = "logo" alt = "logo" />
      <h2>My Portfolio</h2>
      </header>
      
      <div className = "navRight">
        {user ? (
          <>
          <span>Welcome !</span>
          <button onClick={handleLogout}>Log Out</button>
          </>
          ) : (
          <>
          <Link to="/signup">Sign Up</Link> |{" "}
          <Link to="/login">Login</Link>
          </>
        )}
        </div>
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

             <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/about' element={<About />}/>
                {/* <Route path='/projects' element={<Projects />}/> */}
                {/* <Route path='/education' element={<Education />}/> */}
                <Route path='/services' element={<Services />}/>
                {/* <Route path='/contact' element={<Contact />}/> */}
                <Route path='/signup' element={<Signup setUser={setUser} />}/> 
                <Route path='/login' element={<Login setUser={setUser} />}/> 
                <Route path='/projects' element={<ProjectList />} />
                <Route path='/project-details/:id?' element={<ProjectDetails />} />
                <Route path='/education' element={<EducationList />} />
                <Route path='/education-details/:id?' element={<EducationDetails />} />
                <Route path='/contact' element={<ContactsList />} />
                <Route path='/contact-details/:id?' element={<ContactDetails />} />
            </Routes>
    </Router>
    </>
  )
}

export default App;
