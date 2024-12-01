describe('Eliminar tarea de requerimiento', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
  })

  it('debería eliminar una tarea de un requerimiento', () => {
    // Crear proyecto y requerimiento inicial
    cy.get('button[aria-haspopup="dialog"]')
      .contains('Nuevo proyecto')
      .click()

    // Generar nombre aleatorio para el proyecto
    const projectName = `Proyecto ToDo ${Math.floor(Math.random() * 10000)}`
    cy.get('#nombre').type(projectName)

    // Insertar requerimientos del proyecto
    const requirements = `Requerimientos para aplicación ToDo:
1. Interfaz de usuario intuitiva y responsive
2. Capacidad para crear, editar y eliminar tareas`
    cy.get('#descripcion').type(requirements)

    // Crear el proyecto
    cy.get('button[type="submit"]').click()
    cy.wait(3000)

    // Buscar y acceder al proyecto
    cy.get('.relative.flex-row > .flex')
      .type(projectName)
    cy.wait(5000)

    // Hacer clic en la tarjeta del proyecto
    cy.get('.rounded-xl.border.bg-card.text-card-foreground')
      .contains(projectName)
      .click()

    // Crear requerimiento con tarea
    cy.contains('button', 'Agregar requerimiento').click()
    cy.wait(3000)

    const reqName = 'Requerimiento con tarea'
    cy.get('#nombre').type(reqName)
    cy.get('#descripcion').type('Requerimiento para prueba de eliminación de tarea')
    
    // Seleccionar tipo
    cy.contains('button', 'Seleccionar').click()
    cy.contains('Funcional').click()
    
    cy.get('#esfuerzo_requerimiento').type('5')
    cy.get('button[type="submit"]').contains('Crear').click()
    cy.wait(1000)

    // Acceder al detalle del requerimiento
    cy.contains(reqName).click()

    // Agregar tarea
    cy.contains('button', 'Agregar tarea').click()
    cy.get('#nombre_tarea').type('Tarea para eliminar')
    cy.get('#descripcion_tarea').type('Esta tarea será eliminada')
    cy.contains('button', 'Seleccionar prioridad').click()
    cy.contains('Alta').click()
    cy.get('#horas_estimadas').type('4')
    cy.get('button[type="submit"]').contains('Crear tarea').click()

    // Encontrar la tarea y abrir menú de opciones
    cy.contains('Tarea para eliminar')
      .parent()
      .find('button[aria-haspopup="menu"]')
      .click()

    // Seleccionar opción eliminar
    cy.get('[role="menuitem"]')
      .contains('Eliminar')
      .click()

    // Confirmar eliminación
    cy.get('button')
      .contains('Eliminar')
      .click()

    // Verificar que la tarea ya no existe
    cy.contains('Tarea para eliminar').should('not.exist')
  })
}) 