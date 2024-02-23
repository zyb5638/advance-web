// post_comment_spec.js
describe('PostCard Post Comment Interaction', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    // Add login steps here if necessary
  });

  it('allows a user to post a comment on a post', () => {
    // First, type a comment
    cy.get(':nth-child(1) > .ant-card-body > :nth-child(4) > .ant-input').type('This is a test comment.');
    // Then, click the post comment button
    cy.get(':nth-child(1) > .ant-card-body > :nth-child(4) > .ant-btn').click();
    // Add assertions here to verify that the comment has been posted
  });
});
