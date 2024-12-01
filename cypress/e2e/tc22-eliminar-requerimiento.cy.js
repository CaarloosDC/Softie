describe('Eliminar un requerimiento', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
  })

  it('debería eliminar un requerimiento existente', () => {
    // Crear proyecto y requerimiento inicial (similar a TC20)
    cy.get('button[aria-haspopup="dialog"]')
      .contains('Nuevo proyecto')
      .click()

    // Generar nombre aleatorio para el proyecto
    const projectName = `Proyecto ToDo ${Math.floor(Math.random() * 10000)}`
    cy.get('#nombre').type(projectName)

    // ... (código de creación del proyecto) ...

    // Crear requerimiento para eliminar
    cy.contains('button', 'Agregar requerimiento').click()
    cy.wait(3000)

    const reqName = 'Requerimiento para eliminar'
    cy.get('#nombre').type(reqName)
    cy.get('#descripcion').type('Este requerimiento será eliminado')
    
    // Seleccionar tipo
    cy.contains('button', 'Seleccionar').click()
    cy.contains('Funcional').click()
    
    cy.get('#esfuerzo_requerimiento').type('5')
    cy.get('button[type="submit"]').contains('Crear').click()
    cy.wait(1000)

    // Verificar que el requerimiento existe
    cy.contains(reqName).should('exist')

    // Abrir menú de opciones del requerimiento
    cy.contains(reqName)
      .parent()
      .find('button[aria-haspopup="menu"]')
      .click()

    // Seleccionar opción de eliminar
    cy.get('[role="menuitem"]')
      .contains('Eliminar')
      .click()

    // Confirmar eliminación en el modal
    cy.get('button')
      .contains('Eliminar')
      .click()

    // Verificar que el requerimiento ya no existe
    cy.contains(reqName).should('not.exist')
  })
}) 