// write_comment_spec.js
describe('PostCard Write Comment Interaction', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
      // Add login steps here if necessary
    });
  
    it('allows a user to write a comment on a post', () => {
      // Type a comment in the input field on the first post card
      cy.get(':nth-child(1) > .ant-card-body > :nth-child(4) > .ant-input').type('This is a test comment.');
      // Assert the input field contains the typed comment
      cy.get(':nth-child(1) > .ant-card-body > :nth-child(4) > .ant-input').should('have.value', 'This is a test comment.');
    });
  });
  