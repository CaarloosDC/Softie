describe('eliminar un usuario', () => {
    it('passes', () => {
    const randomNum = Math.floor(Math.random() * 1000000)
    const randomName = `Test User ${randomNum}`
    const randomEmail = `testuser${randomNum}@mailinator.com`
    const randomPhone = `52999${Math.floor(1000000 + Math.random() * 9000000)}` // Formato mexicano: 52 + 999 + 7 dígitos

    // Login
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
    cy.get('.gap-3 > :nth-child(2) > .text-xs').should('be.visible').and('have.text', 'test20neo@mailinator.com')

    // Navegar a la sección de usuarios
    cy.get('.h-full > .flex-1').contains('Usuarios').click()
    // Abrir el modal de agregar usuario
    cy.get('.items-start > .flex > .inline-flex').contains('Agregar Usuario').click()
    // Llenar el formulario con datos aleatorios
    cy.get('#email').type(randomEmail)
    cy.get('#name').type(randomName)

    // Asignar rol de usuario:
    cy.contains('label', 'Rol')
    .next('button[role="combobox"]')
    .click()

    // Seleccionar la opción "Usuario"
    cy.get('[role="option"]').contains('Usuario').click()


    // Abrir el combobox de nivel de experiencia
    cy.contains('label', 'Nivel de experiencia')
    .next('button[role="combobox"]')
    .click()
    // Seleccionar "Intermedio"
    cy.get('[role="option"]').contains('Intermedio').click()

     // Llenar el campo de teléfono
    cy.get('#phone').type(randomPhone)
    // Click en el botón "Agregar usuario"
    cy.get('button').contains('Agregar usuario').click()
    // Filtrar por el email
    cy.get('.rounded-lg > :nth-child(1) > :nth-child(1) > :nth-child(1) > .flex').click().type(randomEmail)

    // Validar que el usuario creado se encuentre en la tabla
    cy.get('table .border-b > :nth-child(3)')
    .should('contain', randomEmail)

    // Dar clic en el botón para cambiar el rol
    cy.get('table .border-b')
    .contains(randomEmail)
    .parent('tr')
    .within(() => {
      cy.get('button[aria-haspopup="menu"]')
        .should('be.visible')
        .click()
    })
    // Después, seleccionar "Borrar Usuario"
    cy.get('[role="menuitem"]')
      .contains('Borrar Usuario')
      .should('be.visible')
      .click()

    cy.wait(3000)
    // Filtrar por el email y asegurar que no se encuentre en la tabla
    cy.get('.rounded-lg > :nth-child(1) > :nth-child(1) > :nth-child(1) > .flex').click().type(randomEmail)
    cy.get('.p-2')
    .should('contain', 'No results.')
    })
  })