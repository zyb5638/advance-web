describe('Registration Page', () => {
    it('allows a user to create an account', () => {
      cy.visit('http://localhost:3000/register')
  
      // Wait for a specific element that confirms the page has loaded
      cy.get('form', { timeout: 10000 }).should('be.visible'); // Increase timeout if necessary
  
      // Fill out the form
      cy.get('#username')
        .type('newuser') // Replace with the desired username
        .should('have.value', 'newuser')
  
      cy.get('#email')
        .type('newuser@example.com') // Replace with a valid email
        .should('have.value', 'newuser@example.com')
  
      cy.get('#password')
        .type('password123') // Replace with a desired password
        .should('have.value', 'password123')
  
      // If your form has an admin code input field, uncomment and adjust the following lines:
      // cy.get('input[name="adminCode"]')
      //   .type('12345') // Replace with a valid admin code if needed
      //   .should('have.value', '12345')
  
      // Submit the form
      cy.get('.ant-form-item-control-input-content > .ant-btn').click();
  
      // Add assertions for successful form submission here
      // Example: Check for the success message or redirection after successful registration
      // cy.contains('Account created successfully').should('be.visible');
      // Or check if the URL has changed
      // cy.url().should('include', '/success'); // Adjust the URL to the actual success path
    })
  })
  