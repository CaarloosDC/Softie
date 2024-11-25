describe('tema sistema', () => {
    it('passes', () => {
      // Login
      cy.visit('/')
      cy.get('#email').type('test20neo@mailinator.com')
      cy.get('#password').type('ContraseñaMuySegura123!')
      cy.get('.gap-4 > .inline-flex').click()
      cy.wait(5000)
      cy.get('.gap-3 > :nth-child(2) > .text-xs').should('be.visible').and('have.text', 'test20neo@mailinator.com')
      
      // Cambiar tema al sistema
      cy.contains('Toggle theme').click()
      cy.get('[role="menuitem"]').contains('Sistema').click()
      // Verificar que el menú se cerró y se selecciono el tema del sistema
      cy.get('[role="menuitem"]').should('not.exist')
    })
  })