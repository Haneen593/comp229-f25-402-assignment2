export default function Services() {
    return (
        <>
            <div className="services-page">
                <h1>My Services</h1>
                <p>Here are some of the services I can offer based on my skills and experience:</p>
                
                <div className="services-list">
                    <div className="service-card">
                        <h1>Web Development</h1>
                        <p>I create responsive websites using HTML, CSS, JavaScript, and React to deliver smooth user experiences.</p>
                        <img src="https://5ivemedia.com.sg/wp-content/uploads/2017/02/htmlwebsitedesign-768x523.jpeg" alt="Web Development" className="service-image" />
                    </div>
                    
                    <div className="service-card">
                        <h1>Software Development</h1>
                        <p>I develop software applications using C#, Java, and Python with a focus on problem-solving and functionality.</p>
                        <img src="https://mfranc.com/images/code_review.jpeg" alt="Software Development" className="service-image" />
                    </div>
                    
                    <div className="service-card">
                        <h1>Database Management</h1>
                        <p>I design and manage databases with Oracle SQL, ensuring data is organized and efficient.</p>
                        <img src="https://bairesdev.mo.cloudinary.net/blog/2023/10/What-is-SQL-Server.jpg?tx=w_1920,q_auto" alt="Database Management" className="service-image" />
                    </div>
                </div>
            </div>
      </>
    );
}
