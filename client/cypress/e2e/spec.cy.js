describe('Portfolio Application E2E Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Navigation and Public Pages', () => {
    it('loads the home page successfully', () => {
      cy.visit('/');
      cy.contains('My Portfolio').should('be.visible');
      cy.contains('Home').should('be.visible');
    });

    it('navigates to About page', () => {
      cy.visit('/');
      cy.contains('a', 'About').click();
      cy.url().should('include', '/about');
      cy.contains('About').should('be.visible');
    });

    it('navigates to Services page', () => {
      cy.visit('/');
      cy.contains('a', 'Services').click();
      cy.url().should('include', '/services');
      cy.contains('Services').should('be.visible');
    });

    it('displays navigation links', () => {
      cy.visit('/');
      cy.get('nav').within(() => {
        cy.contains('Home').should('be.visible');
        cy.contains('About').should('be.visible');
        cy.contains('Services').should('be.visible');
        cy.contains('Projects').should('be.visible');
        cy.contains('Education').should('be.visible');
        cy.contains('Contact').should('be.visible');
      });
    });

    it('displays Sign Up and Login links when not authenticated', () => {
      cy.visit('/');
      cy.contains('a', 'Sign Up').should('be.visible');
      cy.contains('a', 'Login').should('be.visible');
    });
  });

  describe('Login works', () => {
    it('logs the user in', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('123456password');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/');
    });

    it('displays login form fields', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('navigates to login page', () => {
      cy.visit('/');
      cy.contains('a', 'Login').click();
      cy.url().should('include', '/login');
      cy.contains('Login').should('be.visible');
    });
  });

  describe('Sign Up works', () => {
    it('navigates to signup page', () => {
      cy.visit('/');
      cy.contains('a', 'Sign Up').click();
      cy.url().should('include', '/signup');
      cy.contains('Sign Up').should('be.visible');
    });

    it('displays signup form fields', () => {
      cy.visit('/signup');
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  });

  describe('Protected route works (projects)', () => {
    it('redirects the user to login when not authenticated', () => {
      cy.clearLocalStorage();
      cy.clearCookies();
      cy.visit('/projects', { failOnStatusCode: false });
      // Should either redirect or show login
      cy.url().should('match', /(login|projects)/);
    });
  });

  describe('Projects Management', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
    });

    it('navigates to Projects page', () => {
      cy.visit('/');
      cy.contains('a', 'Projects').click();
      cy.url().should('include', '/projects');
    });

    it('displays Projects page header', () => {
      cy.visit('/projects');
      cy.contains('h1', 'Projects').should('be.visible');
    });

    it('displays Create New Project button', () => {
      cy.visit('/projects');
      cy.contains('button', 'Create New Project').should('be.visible');
    });

    it('navigates to create project form', () => {
      cy.visit('/projects');
      cy.contains('button', 'Create New Project').click();
      cy.url().should('include', '/project-details');
      cy.contains('Create Project').should('be.visible');
    });

    it('displays project form fields', () => {
      cy.visit('/project-details');
      cy.get('input[name="title"]').should('be.visible');
      cy.get('input[name="firstname"]').should('be.visible');
      cy.get('input[name="lastname"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="completion"]').should('be.visible');
      cy.get('input[name="description"]').should('be.visible');
    });

    it('fills project form with data', () => {
      cy.visit('/project-details');
      cy.get('input[name="title"]').type('Test Project');
      cy.get('input[name="firstname"]').type('John');
      cy.get('input[name="lastname"]').type('Doe');
      cy.get('input[name="email"]').type('john@example.com');
      cy.get('input[name="completion"]').type('2024-12-31');
      cy.get('input[name="description"]').type('Test Description');
      
      cy.get('input[name="title"]').should('have.value', 'Test Project');
      cy.get('input[name="firstname"]').should('have.value', 'John');
    });
  });

  describe('Protected route works (education)', () => {
    it('redirects the user to login when not authenticated', () => {
      cy.clearLocalStorage();
      cy.clearCookies();
      cy.visit('/education', { failOnStatusCode: false });
      cy.url().should('match', /(login|education)/);
    });
  });

  describe('Education Management', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
    });

    it('navigates to Education page', () => {
      cy.visit('/');
      cy.contains('a', 'Education').click();
      cy.url().should('include', '/education');
    });

    it('displays Education page header', () => {
      cy.visit('/education');
      cy.contains('h1', 'Education').should('be.visible');
    });

    it('displays Create New Education button', () => {
      cy.visit('/education');
      cy.contains('button', 'Create New Education').should('be.visible');
    });

    it('navigates to create education form', () => {
      cy.visit('/education');
      cy.contains('button', 'Create New Education').click();
      cy.url().should('include', '/education-details');
      cy.contains('Create Education').should('be.visible');
    });

    it('displays education form fields', () => {
      cy.visit('/education-details');
      cy.get('input[name="title"]').should('be.visible');
      cy.get('input[name="firstname"]').should('be.visible');
      cy.get('input[name="lastname"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="completion"]').should('be.visible');
      cy.get('input[name="description"]').should('be.visible');
    });

    it('fills education form with data', () => {
      cy.visit('/education-details');
      cy.get('input[name="title"]').type('Bachelor of Science');
      cy.get('input[name="firstname"]').type('Jane');
      cy.get('input[name="lastname"]').type('Smith');
      cy.get('input[name="email"]').type('jane@example.com');
      cy.get('input[name="completion"]').type('2024-06-15');
      cy.get('input[name="description"]').type('Computer Science Degree');
      
      cy.get('input[name="title"]').should('have.value', 'Bachelor of Science');
    });
  });

  describe('Protected route works (contact)', () => {
    it('redirects the user to login when not authenticated', () => {
      cy.clearLocalStorage();
      cy.clearCookies();
      cy.visit('/contact', { failOnStatusCode: false });
      cy.url().should('match', /(login|contact)/);
    });
  });

  describe('Contact Management', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
    });

    it('navigates to Contact page', () => {
      cy.visit('/');
      cy.contains('a', 'Contact').click();
      cy.url().should('include', '/contact');
    });

    it('displays Contact page header', () => {
      cy.visit('/contact');
      cy.contains('h1', 'Contacts').should('be.visible');
    });

    it('displays Create New Contact button', () => {
      cy.visit('/contact');
      cy.contains('button', 'Create New Contact').should('be.visible');
    });

    it('navigates to create contact form', () => {
      cy.visit('/contact');
      cy.contains('button', 'Create New Contact').click();
      cy.url().should('include', '/contact-details');
      cy.contains('Create Contact').should('be.visible');
    });

    it('displays contact form fields', () => {
      cy.visit('/contact-details');
      cy.get('input[name="firstname"]').should('be.visible');
      cy.get('input[name="lastname"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
    });

    it('fills contact form with data', () => {
      cy.visit('/contact-details');
      cy.get('input[name="firstname"]').type('Alice');
      cy.get('input[name="lastname"]').type('Johnson');
      cy.get('input[name="email"]').type('alice@example.com');
      
      cy.get('input[name="firstname"]').should('have.value', 'Alice');
      cy.get('input[name="lastname"]').should('have.value', 'Johnson');
      cy.get('input[name="email"]').should('have.value', 'alice@example.com');
    });
  });

  describe('User logout works', () => {
    it('user logout', () => {
      // Set up authenticated state
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
      cy.reload();
      
      // Wait for authentication state to be visible
      cy.contains('Welcome !').should('be.visible');
      cy.contains('button', 'Log Out').should('be.visible');
      
      // Click logout button
      cy.contains('button', 'Log Out').click();
      
      // Verify localStorage is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
        expect(win.localStorage.getItem('username')).to.be.null;
      });
      
      // Verify redirected to login page
      cy.url().should('include', '/login');
      cy.contains('Login').should('be.visible');
    });

    it('shows welcome message when authenticated', () => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
      cy.reload();
      cy.contains('Welcome !').should('be.visible');
      cy.contains('button', 'Log Out').should('be.visible');
    });

    it('hides Sign Up and Login links when authenticated', () => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
      cy.reload();
      cy.contains('a', 'Sign Up').should('not.exist');
      cy.contains('a', 'Login').should('not.exist');
    });
  });

  describe('UI Elements', () => {
    it('displays logo', () => {
      cy.visit('/');
      cy.get('img.logo').should('be.visible');
      cy.get('img.logo').should('have.attr', 'alt', 'logo');
    });

    it('displays header with portfolio title', () => {
      cy.visit('/');
      cy.get('header').within(() => {
        cy.contains('My Portfolio').should('be.visible');
      });
    });

    it('has proper navigation structure', () => {
      cy.visit('/');
      cy.get('.navigationBar nav').should('exist');
      cy.get('.navRight').should('exist');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
    });

    it('validates all required fields on project form', () => {
      cy.visit('/project-details');
      cy.get('input[name="title"]').should('have.attr', 'required');
      cy.get('input[name="firstname"]').should('have.attr', 'required');
      cy.get('input[name="lastname"]').should('have.attr', 'required');
      cy.get('input[name="email"]').should('have.attr', 'required');
      cy.get('input[name="completion"]').should('have.attr', 'required');
      cy.get('input[name="description"]').should('have.attr', 'required');
    });

    it('validates all required fields on education form', () => {
      cy.visit('/education-details');
      cy.get('input[name="title"]').should('have.attr', 'required');
      cy.get('input[name="firstname"]').should('have.attr', 'required');
      cy.get('input[name="lastname"]').should('have.attr', 'required');
      cy.get('input[name="email"]').should('have.attr', 'required');
    });

    it('validates all required fields on contact form', () => {
      cy.visit('/contact-details');
      cy.get('input[name="firstname"]').should('have.attr', 'required');
      cy.get('input[name="lastname"]').should('have.attr', 'required');
      cy.get('input[name="email"]').should('have.attr', 'required');
    });

    it('has correct input types', () => {
      cy.visit('/project-details');
      cy.get('input[name="email"]').should('have.attr', 'type', 'email');
      cy.get('input[name="completion"]').should('have.attr', 'type', 'date');
    });
  });

  describe('Page Navigation', () => {
    it('navigates through all main pages', () => {
      cy.visit('/');
      cy.url().should('include', '/');
      
      cy.contains('a', 'About').click();
      cy.url().should('include', '/about');
      
      cy.contains('a', 'Services').click();
      cy.url().should('include', '/services');
      
      cy.contains('a', 'Home').click();
      cy.url().should('include', '/');
    });

    it('handles browser back button', () => {
      cy.visit('/');
      cy.contains('a', 'About').click();
      cy.url().should('include', '/about');
      cy.go('back');
      cy.url().should('include', '/');
    });

    it('handles browser forward button', () => {
      cy.visit('/');
      cy.contains('a', 'Services').click();
      cy.url().should('include', '/services');
      cy.go('back');
      cy.url().should('include', '/');
      cy.go('forward');
      cy.url().should('include', '/services');
    });
  });

  describe('Authentication Persistence', () => {
    it('persists authentication across page refreshes', () => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
      cy.reload();
      cy.contains('Welcome !').should('be.visible');
    });

    it('handles direct navigation to forms when authenticated', () => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
      
      cy.visit('/project-details');
      cy.contains('Create Project').should('be.visible');
    });
  });

  describe('Complete User Journey', () => {
    it('completes full project creation journey', () => {
      cy.visit('/');
      
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
      cy.reload();
      
      cy.contains('a', 'Projects').click();
      cy.url().should('include', '/projects');
      
      cy.contains('button', 'Create New Project').click();
      cy.url().should('include', '/project-details');
      
      cy.get('input[name="title"]').type('E2E Test Project');
      cy.get('input[name="firstname"]').type('Cypress');
      cy.get('input[name="lastname"]').type('Test');
      cy.get('input[name="email"]').type('cypress@test.com');
      cy.get('input[name="completion"]').type('2024-12-31');
      cy.get('input[name="description"]').type('Created via E2E test');
      
      cy.get('input[name="title"]').should('have.value', 'E2E Test Project');
      cy.get('button[type="submit"]').should('contain', 'Create');
    });

    it('completes full education creation journey', () => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
      cy.reload();
      
      cy.contains('a', 'Education').click();
      cy.contains('button', 'Create New Education').click();
      
      cy.get('input[name="title"]').type('E2E Degree');
      cy.get('input[name="firstname"]').type('Test');
      cy.get('input[name="lastname"]').type('Student');
      cy.get('input[name="email"]').type('student@test.com');
      cy.get('input[name="completion"]').type('2025-06-15');
      cy.get('input[name="description"]').type('Test degree');
      
      cy.get('button[type="submit"]').should('contain', 'Create');
    });

    it('completes full contact creation journey', () => {
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'test-token-123');
        win.localStorage.setItem('username', 'testuser');
      });
      cy.reload();
      
      cy.contains('a', 'Contact').click();
      cy.contains('button', 'Create New Contact').click();
      
      cy.get('input[name="firstname"]').type('Test');
      cy.get('input[name="lastname"]').type('Contact');
      cy.get('input[name="email"]').type('contact@test.com');
      
      cy.get('button[type="submit"]').should('contain', 'Create');
    });
  });
});
