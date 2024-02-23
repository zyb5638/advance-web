describe('Upvote Post', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
      // Add login steps here if necessary
    });
  
    it('allows a user to upvote a post', () => {
      // Assuming the first card in the list can be upvoted
      cy.get(':nth-child(1) > .ant-card-actions > :nth-child(1) > :nth-child(1) > .ant-btn')
        .click();
      
      // Add an assertion here to check if the upvote was successful
      // This could be checking if the vote count has increased
      // or if there's a visual confirmation that the upvote was registered
    });
  });
  
  