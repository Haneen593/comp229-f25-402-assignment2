export default function Contact() {
    const handleSubmit = (e) => {
        e.preventDefault(); // Always prevent default form submission
        
        // Get form data
        const formData = new FormData(e.target.form);
        const firstName = formData.get('first-name').trim();
        const lastName = formData.get('last-name').trim();
        const phone = formData.get('phone').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        // Check if any field is empty
        if (!firstName || !lastName || !phone || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }
        
        // All fields are filled
        alert("Thank you for your message!");
        window.location.href = "/"; // redirect to Home page
    };
    
    return (
        <>
            <div className="contact-page">
                <div className="contact-info">
                    <fieldset>
                        <legend>Contact Information</legend>
                        <p>Email: haneen.ftayeh93@gmail.com</p>
                        <p>Phone: +1 647 288 4955</p>
                    </fieldset>
                </div>
                
                <div className="contact-form">
                    <fieldset>
                        <legend>Send me a message:</legend>
                        <form>
                            <label htmlFor="first-name">First Name:</label>
                            <input type="text" id="first-name" name="first-name" required />
                        
                            <label htmlFor="last-name">Last Name:</label>
                            <input type="text" id="last-name" name="last-name" required />
                        
                            <label htmlFor="phone">Phone Number:</label>
                            <input type="tel" id="phone" name="phone" required />
                        
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" required />
                        
                            <label htmlFor="message">Message:</label>
                            <textarea id="message" name="message" rows="4" required></textarea>
                            
                            <button type="submit" onClick={handleSubmit} >Submit</button>
                        </form>
                    </fieldset>
                </div>
            </div>
        </>
    );
}

  
  
  
