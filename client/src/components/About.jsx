import profilePic from "../assets/Haneen.jpg";
import resumePdf from "../assets/Resume.2025.pdf";
import "../Styles/About.css";

export default function About() {
    return (
        <>
            <div className="about-message">
                <img width="200" id="profile-pic" src={profilePic} alt="Profile" loading="lazy" />

                <div className="about">
                    <p>My name is <b>Haneen Ftayeh</b>, 
                    and I am a student in AI–Software Engineering Technology at Centennial College. 
                    Originally from Syria, I moved to Canada in 2023 and currently live in Stouffville, Ontario. 
                    I am passionate about learning and growing in the field of software development, 
                    with a strong focus on artificial intelligence and problem-solving. 
                    My goal is to enhance my skills and prepare for a successful career in the tech field.
                    </p>

                    <a href={resumePdf} target="_blank" rel="noopener noreferrer">View My Resume</a>
                </div>  
            </div>
        </>
    );
}

