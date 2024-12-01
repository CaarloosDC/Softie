describe('Editar un requerimiento', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
  })

  it('debería editar un requerimiento existente', () => {
    // Crear proyecto y requerimiento inicial (reutilizando código de TC20)
    // ... código de creación de proyecto ...

    // Buscar y acceder al requerimiento creado
    cy.contains('Login de usuarios').click()

    // Hacer clic en el botón de editar
    cy.get('button[aria-label="Editar requerimiento"]').click()

    // Modificar los campos del requerimiento
    cy.get('#nombre')
      .clear()
      .type('Login de usuarios actualizado')

    cy.get('#descripcion')
      .clear()
      .type('El sistema debe permitir a los usuarios iniciar sesión usando correo, contraseña y autenticación de dos factores')

    // Actualizar tipo de requerimiento
    cy.contains('button', 'Seleccionar')
      .click()
    cy.contains('No Funcional')
      .click()

    // Actualizar esfuerzo estimado
    cy.get('#esfuerzo_requerimiento')
      .clear()
      .type('12')

    // Guardar cambios
    cy.get('button[type="submit"]')
      .contains('Guardar')
      .click()

    // Verificar que los cambios se guardaron
    cy.contains('Login de usuarios actualizado').should('exist')
    cy.contains('autenticación de dos factores').should('exist')
    cy.contains('12 horas').should('exist')
  })
}) 