describe('Actualizar visibilidad de columnas', () => {
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
  
})