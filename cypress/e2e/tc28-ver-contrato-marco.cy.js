describe('Ver contrato marco', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('test20neo@mailinator.com')
    cy.get('#password').type('ContraseñaMuySegura123!')
    cy.get('.gap-4 > .inline-flex').click()
    cy.wait(5000)
  })

  it('debería mostrar los detalles de un contrato marco', () => {
    // Navegar a la sección de contratos marco
    cy.get('.h-full > .flex-1')
      .contains('Contratos Marco')
      .click()

    // Crear un contrato nuevo para visualizar
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
      .type('Contrato marco para servicios de desarrollo de software 2024')

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
      .type('1. Términos de pago: 30 días\n2. Renovación automática\n3. Confidencialidad')

    cy.get('button[type="submit"]')
      .contains('Crear Contrato')
      .click()

    cy.wait(3000)

    // Hacer clic en el contrato para ver detalles
    cy.contains(contractName)
      .click()

    // Verificar que se muestran los detalles correctos
    cy.get('.contract-details')
      .within(() => {
        cy.contains(contractName).should('exist')
        cy.contains('Empresa Cliente S.A.').should('exist')
        cy.contains('100,000 USD').should('exist')
        cy.contains('desarrollo de software 2024').should('exist')
        cy.contains('Términos de pago: 30 días').should('exist')
      })

    // Verificar que se muestran las secciones principales
    cy.contains('Información General').should('exist')
    cy.contains('Proyectos Asociados').should('exist')
    cy.contains('Historial de Cambios').should('exist')

    // Verificar que los botones de acción están presentes
    cy.contains('button', 'Editar Contrato').should('exist')
    cy.contains('button', 'Descargar PDF').should('exist')
  })
}) 