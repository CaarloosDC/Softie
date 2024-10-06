describe('Theme Toggle', () => {
  beforeEach(() => {
    // Navigate to the projects page
    cy.visit('/projects');
  });

  it('should toggle between light, dark, and system themes', () => {
    // Function to open the theme dropdown
    const openThemeDropdown = () => {
      cy.get('button[aria-label="Toggle theme"]').click();
    };

    // Check initial theme (assuming it starts in light mode)
    cy.get('html').should('not.have.class', 'dark');

    // Test dark theme
    openThemeDropdown();
    cy.contains('Oscuro').click();
    cy.get('html').should('have.class', 'dark');

    // Test light theme
    openThemeDropdown();
    cy.contains('Claro').click();
    cy.get('html').should('not.have.class', 'dark');

    // Test system theme
    openThemeDropdown();
    cy.contains('Sistema').click();

    // Simulate light mode preference
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: {
        media: 'screen',
        features: [{ name: 'prefers-color-scheme', value: 'light' }]
      }
    }));
    cy.get('html').should('not.have.class', 'dark');

    // Simulate dark mode preference
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: {
        media: 'screen',
        features: [{ name: 'prefers-color-scheme', value: 'dark' }]
      }
    }));
    cy.get('html').should('have.class', 'dark');
  });

  it('should persist theme preference after page reload', () => {
    // Set theme to dark
    cy.get('button[aria-label="Toggle theme"]').click();
    cy.contains('Oscuro').click();
    cy.get('html').should('have.class', 'dark');

    // Reload the page
    cy.reload();

    // Check if dark theme is still applied
    cy.get('html').should('have.class', 'dark');

    // Set theme to light
    cy.get('button[aria-label="Toggle theme"]').click();
    cy.contains('Claro').click();
    cy.get('html').should('not.have.class', 'dark');

    // Reload the page
    cy.reload();

    // Check if light theme is still applied
    cy.get('html').should('not.have.class', 'dark');
  });

  it('should apply correct theme based on system preference', () => {
    // Set theme to system
    cy.get('button[aria-label="Toggle theme"]').click();
    cy.contains('Sistema').click();

    // Simulate light mode preference
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: {
        media: 'screen',
        features: [{ name: 'prefers-color-scheme', value: 'light' }]
      }
    }));

    // Reload the page to ensure system preference is applied
    cy.reload();

    // Check if light theme is applied
    cy.get('html').should('not.have.class', 'dark');

    // Simulate dark mode preference
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: {
        media: 'screen',
        features: [{ name: 'prefers-color-scheme', value: 'dark' }]
      }
    }));

    // Reload the page to ensure system preference is applied
    cy.reload();

    // Check if dark theme is applied
    cy.get('html').should('have.class', 'dark');
  });
});