describe('Agregar tarea a requerimiento', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
  })

  it('debería agregar una tarea a un requerimiento existente', () => {
    // Crear proyecto y requerimiento inicial
    cy.get('button[aria-haspopup="dialog"]')
      .contains('Nuevo proyecto')
      .click()

    // Generar nombre aleatorio para el proyecto
    const projectName = `Proyecto ToDo ${Math.floor(Math.random() * 10000)}`
    cy.get('#nombre').type(projectName)

    // ... (código de creación del proyecto) ...

    // Crear requerimiento
    cy.contains('button', 'Agregar requerimiento').click()
    cy.wait(3000)

    const reqName = 'Requerimiento con tareas'
    cy.get('#nombre').type(reqName)
    cy.get('#descripcion').type('Requerimiento para pruebas de tareas')
    
    // Seleccionar tipo
    cy.contains('button', 'Seleccionar').click()
    cy.contains('Funcional').click()
    
    cy.get('#esfuerzo_requerimiento').type('5')
    cy.get('button[type="submit"]').contains('Crear').click()
    cy.wait(1000)

    // Acceder al detalle del requerimiento
    cy.contains(reqName).click()

    // Hacer clic en "Agregar tarea"
    cy.contains('button', 'Agregar tarea').click()

    // Llenar el formulario de la tarea
    cy.get('#nombre_tarea')
      .type('Implementar formulario de login')

    cy.get('#descripcion_tarea')
      .type('Crear formulario con campos de email y contraseña')

    // Seleccionar prioridad
    cy.contains('button', 'Seleccionar prioridad')
      .click()
    cy.contains('Alta')
      .click()

    // Asignar horas estimadas
    cy.get('#horas_estimadas')
      .type('4')

    // Guardar la tarea
    cy.get('button[type="submit"]')
      .contains('Crear tarea')
      .click()

    // Verificar que la tarea se agregó correctamente
    cy.get('.tareas-list')
      .within(() => {
        cy.contains('Implementar formulario de login').should('exist')
        cy.contains('Alta').should('exist')
        cy.contains('4h').should('exist')
      })
  })
}) 