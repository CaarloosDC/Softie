describe('Seleccionar múltiples usuarios', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
    
    // Ir a la ventana de usuarios
    cy.get('.h-full > .flex-1').contains('Usuarios').click()
    cy.wait(5000)
  })

  it('should toggle multiple user selection', () => {
    // Hacer clic en las casillas individuales y verificar su selección
    cy.get('button[role="checkbox"][aria-label="Select row"]').first().click()
      .should('have.attr', 'aria-checked', 'true')
    cy.get('button[role="checkbox"][aria-label="Select row"]').eq(1).click()
      .should('have.attr', 'aria-checked', 'true')
    cy.get('button[role="checkbox"][aria-label="Select row"]').eq(2).click()
      .should('have.attr', 'aria-checked', 'true')
    
    // Esperar para demostrar las selecciones individuales
    cy.wait(1000)
    
    // Hacer clic en "Seleccionar todo" y verificar que todas las casillas estén seleccionadas
    cy.get('button[role="checkbox"][aria-label="Select all"]').click()
    cy.get('button[role="checkbox"][aria-label="Select row"]')
      .should('have.attr', 'aria-checked', 'true')
    cy.get('button[role="checkbox"][aria-label="Select all"]')
      .should('have.attr', 'aria-checked', 'true')
    
    // Esperar para demostrar que todos están seleccionados
    cy.wait(1000)
    
    // Hacer clic en "Seleccionar todo" nuevamente y verificar que todas las casillas estén deseleccionadas
    cy.get('button[role="checkbox"][aria-label="Select all"]').click()
    cy.get('button[role="checkbox"][aria-label="Select row"]')
      .should('have.attr', 'aria-checked', 'false')
    cy.get('button[role="checkbox"][aria-label="Select all"]')
      .should('have.attr', 'aria-checked', 'false')
  })
})