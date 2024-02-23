describe('Password Visibility Toggle', () => {
  it('toggles the visibility of the password', () => {
    cy.visit('http://localhost:3000/login'); // Adjust this URL to your actual login page

    // Type the password
    cy.get('#password').type('yourpassword');

    // Click the icon to show the password in plain text
    cy.get('.ant-form-item-control-input-content > .ant-input-affix-wrapper > .ant-input-suffix').click();

    // Assert that the password is now visible (input type should be "text")
    cy.get('#password').should('have.attr', 'type', 'text');

    // Optional: Click the icon again to hide the password
    cy.get('.ant-form-item-control-input-content > .ant-input-affix-wrapper > .ant-input-suffix').click();

    // Assert that the password is now hidden (input type should be "password")
    cy.get('#password').should('have.attr', 'type', 'password');
  });
});
