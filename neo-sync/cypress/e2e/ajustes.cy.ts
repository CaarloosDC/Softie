describe('Navbar Settings', () => {
    beforeEach(() => {
      // Navigate to the dashboard page
      cy.visit('/projects');
    });
  
    it('should open settings from the navbar dropdown', () => {
      // Click on the dropdown menu trigger (the MoreVertical icon button)
      cy.get('button').find('.lucide-more-vertical').click();
  
      // The dropdown menu should be visible
      cy.get('[role="menu"]').should('be.visible');
  
      // Click on the "Ajustes" option
      cy.contains('Ajustes').click();
  
      // Here you would typically check if the settings page has loaded
      // For this example, let's assume it navigates to a /settings page
      cy.url().should('include', '/settings');
  
      // You can add more assertions here to verify the settings page content
      // For example:
      // cy.get('h1').should('contain', 'Ajustes de cuenta');
    });
  
    it('should display user information in the navbar', () => {
      // Check if the user's name is displayed
      cy.contains('John Doe').should('be.visible');
  
      // Check if the user's email is displayed
      cy.contains('johndoe@gmail.com').should('be.visible');
    });
  
    it('should open and close the mobile navigation menu', () => {
      // This test is for the mobile view, so we need to resize the viewport
      cy.viewport('iphone-x');
  
      // The menu button should be visible in mobile view
      cy.get('button').find('.lucide-menu').should('be.visible').click();
  
      // The sidebar content should now be visible
      cy.get('[role="dialog"]').should('be.visible');
  
      // Close the menu (you might need to adjust this based on how your Sheet component closes)
      cy.get('body').type('{esc}');
  
      // The sidebar content should now be hidden
      cy.get('[role="dialog"]').should('not.exist');
    });
  });