describe('Eliminar un proyecto', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
  })

  it('debería eliminar un proyecto existente', () => {
    // Hacer clic en el botón "Nuevo proyecto"
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
3. Organización de tareas por categorías o etiquetas
4. Sistema de priorización de tareas
5. Fechas límite para las tareas
6. Notificaciones para tareas próximas a vencer
7. Función de búsqueda y filtrado de tareas
8. Sincronización entre dispositivos
9. Modo oscuro/claro
10. Exportación de tareas en formato CSV`
    cy.get('#descripcion').type(requirements)

    // Insertar transcripción simulada de reunión
    const transcript = `Transcripción reunión inicial - 15/03/2024

Cliente: Necesitamos una aplicación que ayude a nuestro equipo a organizarse mejor.
Desarrollador: ¿Qué funcionalidades específicas necesitan?

Cliente: Principalmente necesitamos crear tareas, asignarlas y hacer seguimiento.
Desarrollador: ¿Cuántos usuarios aproximadamente utilizarían la aplicación?

Cliente: Inicialmente seremos un equipo de 10 personas.
Desarrollador: ¿Necesitan alguna integración con otras herramientas?

Cliente: Por ahora no, pero sería bueno poder exportar los datos.
Desarrollador: Podemos implementar una exportación a CSV.

Cliente: Perfecto. ¿En cuánto tiempo podría estar lista una primera versión?
Desarrollador: Con estas funcionalidades, en aproximadamente 6 semanas.

Cliente: Me parece bien. ¿Cuándo podemos empezar?
Desarrollador: Podemos iniciar la próxima semana, prepararé el backlog inicial.`
    cy.get('#transcripcion').type(transcript)

    // Hacer clic en el botón para crear el proyecto
    cy.get('button[type="submit"]').click()

    // Esperar a que se cargue la vista del proyecto
    cy.wait(3000)

    // Buscar y hacer clic en la tarjeta del proyecto creado
    cy.get('.rounded-xl.border.bg-card.text-card-foreground')
      .should('exist')
      .each(($card) => {
        const cardTitle = $card.find('.tracking-tight.text-lg.font-bold').text()
        if (cardTitle === projectName) {
          cy.wrap($card).click()
          return false
        }
      })

    // Esperar a que cargue la vista detallada
    cy.wait(2000)

    // Hacer clic en el botón de eliminar
    cy.get('button[type="button"]')
      .contains('Eliminar')
      .should('exist')
      .click()

    // Confirmar la eliminación en el diálogo
    cy.get('[role="alertdialog"]')
      .should('exist')
      .within(() => {
        cy.get('button')
          .contains('Eliminar')
          .click()
      })

    // Esperar a que se complete la eliminación
    cy.wait(2000)

    // Verificar que el proyecto ya no existe
    let projectFound = false
    cy.get('.rounded-xl.border.bg-card.text-card-foreground')
      .each(($card) => {
        const cardTitle = $card.find('.tracking-tight.text-lg.font-bold').text()
        if (cardTitle === projectName) {
          projectFound = true
          return false
        }
      })
      .then(() => {
        expect(projectFound).to.be.false
      })
  })
})