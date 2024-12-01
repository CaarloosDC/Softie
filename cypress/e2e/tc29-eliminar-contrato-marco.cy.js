describe('Eliminar contrato marco', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
  })

  it('debería eliminar un contrato marco', () => {
    // Navegar a la sección de contratos marco
    cy.get('.h-full > .flex-1')
      .contains('Contratos Marco')
      .click()

    // Crear un contrato nuevo para eliminar
    cy.contains('button', 'Nuevo Contrato Marco')
      .click()

    // Generar nombre aleatorio para el contrato
    const contractName = `Contrato Marco ${Math.floor(Math.random() * 10000)}`

    // Llenar formulario del contrato
    cy.get('#nombre_contrato')
      .type(contractName)

    cy.get('#cliente')
      .type('Empresa Cliente S.A.')

    cy.get('#descripcion')
      .type('Contrato marco para eliminar')

    // Seleccionar fecha de inicio
    cy.get('button[aria-label="Seleccionar fecha de inicio"]')
      .click()
    cy.get('.rdp-day')
      .not('.rdp-day_disabled')
      .first()
      .click()

    // Seleccionar fecha de fin
    cy.get('button[aria-label="Seleccionar fecha de finalización"]')
      .click()
    cy.get('.rdp-day')
      .not('.rdp-day_disabled')
      .last()
      .click()

    cy.get('#monto')
      .type('100000')

    cy.get('button[aria-label="Seleccionar moneda"]')
      .click()
    cy.contains('USD')
      .click()

    cy.get('#terminos')
      .type('Términos para contrato de prueba')

    cy.get('button[type="submit"]')
      .contains('Crear Contrato')
      .click()

    cy.wait(3000)

    // Verificar que el contrato existe
    cy.contains(contractName).should('exist')

    // Abrir menú de opciones del contrato
    cy.contains(contractName)
      .parent()
      .find('button[aria-haspopup="menu"]')
      .click()

    // Seleccionar opción eliminar
    cy.get('[role="menuitem"]')
      .contains('Eliminar')
      .click()

    // Confirmar eliminación en el modal
    cy.get('.modal-delete')
      .within(() => {
        cy.contains('button', 'Eliminar')
          .click()
      })

    // Esperar a que se procese la eliminación
    cy.wait(2000)

    // Verificar que el contrato ya no existe
    cy.contains(contractName).should('not.exist')

    // Verificar mensaje de confirmación
    cy.contains('Contrato eliminado correctamente').should('exist')
  })
}) 