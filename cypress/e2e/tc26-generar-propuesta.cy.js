describe('Generar propuesta de proyecto', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
  })

  it('debería generar una propuesta del proyecto', () => {
    // Crear proyecto inicial
    cy.get('button[aria-haspopup="dialog"]')
      .contains('Nuevo proyecto')
      .click()

    // Generar nombre aleatorio para el proyecto
    const projectName = `Proyecto ToDo ${Math.floor(Math.random() * 10000)}`
    cy.get('#nombre').type(projectName)

    // Insertar requerimientos del proyecto
    const requirements = `Requerimientos para aplicación ToDo:
1. Interfaz de usuario intuitiva y responsive
2. Capacidad para crear, editar y eliminar tareas
3. Sistema de priorización de tareas`
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

    // Hacer clic en el botón de generar propuesta
    cy.contains('button', 'Generar propuesta').click()

    // Esperar a que se genere la propuesta
    cy.wait(5000)

    // Verificar que se generó el documento
    cy.get('.document-preview')
      .should('exist')
      .and('contain', 'Propuesta de Proyecto')

    // Verificar elementos clave de la propuesta
    cy.get('.document-preview')
      .within(() => {
        cy.contains('Requerimientos').should('exist')
        cy.contains('Estimación de Esfuerzo').should('exist')
        cy.contains('Equipo del Proyecto').should('exist')
        cy.contains(projectName).should('exist')
      })

    // Descargar propuesta
    cy.contains('button', 'Descargar PDF')
      .click()

    // Verificar que se descargó el archivo
    cy.readFile(`cypress/downloads/Propuesta_${projectName}.pdf`)
      .should('exist')
  })
}) 