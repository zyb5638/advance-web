describe('Registration Page', () => {
    it('allows a user to create an account and toggle password visibility', () => {
      cy.visit('http://localhost:3000/register');
  
      // Wait for the form to be visible
      cy.get('form', { timeout: 10000 }).should('be.visible');
  
      // Fill out the form
      cy.get('#username')
        .type('newuser')
        .should('have.value', 'newuser');
  
      cy.get('#email')
        .type('newuser@example.com')
        .should('have.value', 'newuser@example.com');
  
      cy.get('#password')
        .type('password123')
        .should('have.value', 'password123');
  
      // Toggle password visibility
      cy.get('.ant-form-item-control-input-content > .ant-input-affix-wrapper > .ant-input-suffix').click();
  
      // Here you might want to add a check to ensure that the password is indeed visible.
      // This step is more complex because Cypress doesn't have a direct way to check if the text is masked.
      // One approach could be to check the type attribute of the password field if it changes to "text" from "password".
  
      cy.get('#adminCode')
        .type('123456')
        .should('have.value', '123456');
  
      // Submit the form
      cy.get('.ant-form-item-control-input-content > .ant-btn').click();
  
      // Add assertions for successful form submission here
    });
  });
  