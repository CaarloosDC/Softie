describe('Completar tarea de requerimiento', () => {
  beforeEach(() => {
    // ... código de login ...
  })

  it('debería marcar una tarea como completada', () => {
    // ... código de creación de proyecto y requerimiento ...

    // Acceder al detalle del requerimiento con la tarea creada
    cy.contains('Implementar formulario de login')
      .parent()
      .within(() => {
        // Marcar la tarea como completada
        cy.get('input[type="checkbox"]').click()
      })

    // Verificar que la tarea está marcada como completada
    cy.contains('Implementar formulario de login')
      .parent()
      .should('have.class', 'completed')
      .within(() => {
        cy.get('input[type="checkbox"]').should('be.checked')
      })
  })
}) 