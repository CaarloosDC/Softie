describe('Autenticar con Microsoft', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('debería autenticar con Microsoft Teams', () => {
    // Verificar que estamos en la página de login
    cy.get('#email').should('exist')
    
    // Verificar que existe el botón de Microsoft
    cy.get('button')
      .contains('Continuar con Microsoft')
      .should('exist')
      .and('not.be.disabled')

    // Hacer clic en el botón de Microsoft
    cy.get('button')
      .contains('Continuar con Microsoft')
      .click()

    // Esperar a que se abra la ventana de Microsoft
    cy.origin('https://login.microsoftonline.com', () => {
      // Ingresar credenciales de Microsoft
      cy.get('input[type="email"]')
        .type('usuario.prueba@empresa.com')
      
      cy.get('input[type="submit"]')
        .click()

      cy.get('input[type="password"]')
        .type('ContraseñaMicrosoft123!')

      cy.get('input[type="submit"]')
        .click()

      // Si aparece el prompt de "Mantener sesión iniciada"
      cy.get('#idSIButton9')
        .click()
    })

    // Esperar redirección y verificar autenticación exitosa
    cy.url().should('not.include', '/login')

    // Verificar que estamos en la página principal
    cy.get('.user-profile')
      .should('exist')
      .and('contain', '@empresa.com')

    // Verificar que se muestra el menú de usuario
    cy.get('button[aria-haspopup="menu"]')
      .should('exist')
      .click()

    // Verificar que aparece la opción de cerrar sesión
    cy.get('[role="menuitem"]')
      .contains('Cerrar sesión')
      .should('exist')
  })
}) 