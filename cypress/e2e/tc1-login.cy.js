describe('login con email y password', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
    cy.get('.gap-3 > :nth-child(2) > .text-xs').should('be.visible').and('have.text', 'test20neo@mailinator.com')
  })
})