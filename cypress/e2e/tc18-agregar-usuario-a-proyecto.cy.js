describe('Agregar usuario a proyecto', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
  })

  it('debería agregar un miembro al equipo del proyecto', () => {
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

    // Buscar el proyecto usando el campo de búsqueda
    cy.get('.relative.flex-row > .flex')
      .type(projectName)

    // Esperar a que se filtren los resultados
    cy.wait(5000)

    // Hacer clic en la tarjeta del proyecto
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

    // Hacer clic en el botón "Equipo del Proyecto"
    cy.contains('button', 'Equipo del Proyecto').click()

    // Esperar a que se abra el modal
    cy.wait(1000)

    // Hacer clic en "Agregar Miembro"
    cy.contains('button', 'Agregar Miembro').click()

    // Esperar a que se abra el modal de agregar miembro
    cy.wait(1000)

    // Seleccionar Rol: Desarrollador
    cy.contains('button', 'Seleccionar rol').click()
    cy.contains('Desarrollador').click()

    // Seleccionar Experiencia: Junior
    cy.contains('button', 'Seleccionar experiencia').click()
    cy.contains('Junior').click()

    // Hacer clic en el botón Agregar dentro del contenedor flex
    cy.get('.flex.flex-col-reverse.sm\\:flex-row.sm\\:justify-end.sm\\:space-x-2')
      .contains('button', 'Agregar')
      .click()

    // Verificar que se agregó el miembro correctamente
    cy.get('table')
      .within(() => {
        cy.contains('td', 'Desarrollador').should('exist')
        cy.contains('td', 'Junior').should('exist')
      })
  })
})