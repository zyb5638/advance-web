describe('Login Page', () => {
    it('allows a user to log in', () => {
      cy.visit('http://localhost:3000/login')
  
      // Wait for the form to be visible
      cy.get('form', { timeout: 10000 }).should('be.visible');
  
      // Fill out the username and password fields
      cy.get('#username')
        .type('newuser') // Replace with a valid username
        .should('have.value', 'newuser');
  
      cy.get('#password')
        .type('password123') // Replace with a valid password
        .should('have.value', 'password123');
  
      // Click the login button
      cy.get('.ant-form-item-control-input-content > .ant-btn').click();
  
      // Add assertions to check for successful login
      // This could be a check for a URL redirect, a logout button, or a welcome message
      // For example:
      // cy.url().should('include', '/dashboard'); // Adjust the URL to the actual logged-in path
      // Or:
      // cy.contains('Log out').should('be.visible');
    });
  });
  