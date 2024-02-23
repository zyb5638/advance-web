describe('Downvote Post', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
      // Add login steps here if necessary
    });
  
    it('allows a user to downvote a post', () => {
      // Assuming the first card in the list can be downvoted
      cy.get(':nth-child(1) > .ant-card-actions > :nth-child(3) > :nth-child(1) > .ant-btn')
        .click();
      
      // Add an assertion here to check if the downvote was successful
      // This could be checking if the vote count has decreased
      // or if there's a visual confirmation that the downvote was registered
    });
  });
  