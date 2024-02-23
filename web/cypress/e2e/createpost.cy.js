describe('Create Post Page', () => {
  it('allows a logged-in user to create a post', () => {
    // Assuming the user is already logged in and the session is saved
    // If not, you'll need to log in first as shown in the previous example

    // Visit the "Create Post" page directly
    cy.visit('http://localhost:3000/createpost')

    // Fill in the post title
    cy.get('.ant-form-item-control-input-content > .ant-input')
      .type('Test Post Title')
      .should('have.value', 'Test Post Title');

    // Enter content into the rich text editor
    // You may need to focus the editor first if it's not focused by default
    cy.get('.public-DraftStyleDefault-block').click()
      .type('This is a test post content.');

    // If the editor has a specific class for the content area, you might need to target that instead
    cy.get('.editor-class').click()
      .type('This is a test post content.');

    // Submit the form to create the post
    cy.get('.ant-form > .ant-btn-primary').click();

    // Verify the post creation was successful
    // Adjust this verification step based on your application's behavior (e.g., redirection, success message)
    // cy.url().should('include', '/posts') // If the app redirects to a posts list page
    // cy.contains('Post created successfully').should('exist') // If the app shows a success message
  });
});
