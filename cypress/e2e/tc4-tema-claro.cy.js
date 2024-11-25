describe('tema claro', () => {
  it('passes', () => {
    // Login
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
    cy.get('.gap-3 > :nth-child(2) > .text-xs').should('be.visible').and('have.text', 'test20neo@mailinator.com')
    
    // Cambiar tema a claro
    cy.contains('Toggle theme').click()
    cy.get('[role="menuitem"]').contains('Claro').click()
    
    cy.get('html').should('not.have.class', 'dark')

  })
})