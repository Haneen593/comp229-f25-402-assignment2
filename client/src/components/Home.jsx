export default function Home() {
    return (
        <>
            <div className="message">
                <h1>Welcome to My Portfolio</h1>
                <p>My mission is to grow as a software engineer 
                by committing to continuous learning and enhancing my skills in AI and software development, 
                so I can contribute to meaningful projects that improve everyday life.
                </p>
            </div>
            
            <button type = "about-me"
            onClick={() => 
            window.location.href='/about'}>More about me</button>
        </>
    );
}
