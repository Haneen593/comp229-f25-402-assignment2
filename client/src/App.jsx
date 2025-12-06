import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback, useMemo, lazy, Suspense, memo } from 'react';
import logoImg from "./assets/logo.png";

// Lazy load components for code splitting
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Signup = lazy(() => import('./components/SignUp'));
const Login = lazy(() => import('./components/Login'));
const ProjectList = lazy(() => import('./components/Project-list'));
const ProjectDetails = lazy(() => import('./components/project-details'));
const EducationDetails = lazy(() => import('./components/education-details'));
const EducationList = lazy(() => import('./components/education-list'));
const ContactDetails = lazy(() => import('./components/contact-details'));
const ContactsList = lazy(() => import('./components/contact-list'));

const getUserFromStorage = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  return token && username ? { username } : null;
}

const AppContent = memo(({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    navigate('/login');
  }, [navigate, setUser])

  return (
    <>
      <header>
        <img src={logoImg} className="logo" alt="logo" />
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
          <Link to="/services">Services</Link> |{" "}
          <Link to="/projects">Projects</Link> |{" "}
          <Link to="/education">Education</Link> |{" "}
          <Link to="/contact">Contact</Link>
        </nav>
      </div>

      <Suspense fallback={<div style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/services' element={<Services />}/>
          <Route path='/signup' element={<Signup setUser={setUser} />}/> 
          <Route path='/login' element={<Login setUser={setUser} />}/> 
          <Route path='/projects' element={<ProjectList />} />
          <Route path='/project-details/:id?' element={<ProjectDetails />} />
          <Route path='/education' element={<EducationList />} />
          <Route path='/education-details/:id?' element={<EducationDetails />} />
          <Route path='/contact' element={<ContactsList />} />
          <Route path='/contact-details/:id?' element={<ContactDetails />} />
        </Routes>
      </Suspense>
    </>
  )
});

function App() {
  const [user, setUser] = useState(getUserFromStorage);

  // Remove redundant useEffect - useState accepts function initializer
  
  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  )
}

export default App;
