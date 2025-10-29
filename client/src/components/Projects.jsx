export default function Projects() {
    return (
        <>
            <div className="projects-page">
                <h1>My Projects</h1>
                <p>Here are some of the projects I have worked on:</p>
                
                <div className="projects-list">
                    <div className="project-card">
                        <p>Developed a multi-page website for a fast food restaurant, 
                            including pages for the menu, locations, and contact information. 
                            Implemented an interactive location page that allows users to view 
                            restaurant locations by clicking on a map, enhancing navigation.</p>
                            <img src="project1.png"  className="project-image" />
                    </div>
                    
                    <div className="project-card">
                        <p>Developed a C# program that calculates off-peak, mid-peak, 
                            and on-peak times of the day to show when electricity is least and most expensive.</p>
                            <img src="project2.png"  className="project-image" />
                    </div>
                    
                    <div className="project-card">
                        <p>Designed a database to efficiently store and manage data for an organization using Oracle SQL. 
                            Implemented tables, relationships, and queries to ensure data integrity and accessibility.</p>
                            <img src="project3.png"  className="project-image" />
                    </div>
                </div>
            </div>
        </>
    );
}
