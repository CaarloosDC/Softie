describe('Funcionalidad de la Barra de Navegación', () => {
    beforeEach(() => {
      // Navegar a la página del projects antes de cada prueba
      cy.visit('/projects');
    });
  
    // Caso de Prueba 1: Verificar la presencia de los elementos de la barra de navegación
    it('debería mostrar todos los elementos de la barra de navegación', () => {
      // Verificar el campo de búsqueda
      cy.get('input[type="search"]').should('be.visible');
  
      // Verificar el botón de cambio de tema
      cy.get('button[aria-label="Toggle theme"]').should('be.visible');
  
      // Verificar el botón de notificaciones
      cy.get('button').find('.lucide-bell').should('be.visible');
  
      // Verificar el avatar del usuario y la información (en pantallas más grandes)
      cy.get('.md\\:flex').within(() => {
        cy.get('.rounded-full').should('be.visible');
        cy.contains('John Doe').should('be.visible');
        cy.contains('johndoe@gmail.com').should('be.visible');
      });
  
      // Verificar el botón del menú desplegable
      cy.get('button').find('.lucide-more-vertical').should('be.visible');
    });
  
    // Caso de Prueba 2: Probar la funcionalidad de búsqueda
    it('debería permitir al usuario ingresar una consulta de búsqueda', () => {
      const searchQuery = 'consulta de prueba';
      cy.get('input[type="search"]').type(searchQuery).should('have.value', searchQuery);
    });
  
    // Caso de Prueba 3: Probar la funcionalidad de cambio de tema
    it('debería alternar entre temas claro y oscuro', () => {
      // Hacer clic en el botón de cambio de tema
      cy.get('button[aria-label="Toggle theme"]').click();
  
      // Verificar si el menú desplegable se abre
      cy.get('[role="menu"]').should('be.visible');
  
      // Seleccionar el tema oscuro
      cy.contains('Oscuro').click();
  
      // Verificar si se aplica el tema oscuro
      cy.get('html').should('have.class', 'dark');
  
      // Volver al tema claro
      cy.get('button[aria-label="Toggle theme"]').click();
      cy.contains('Claro').click();
  
      // Verificar si se aplica el tema claro
      cy.get('html').should('not.have.class', 'dark');
    });
  
    // Caso de Prueba 4: Probar el botón de notificaciones
    it('debería abrir las notificaciones al hacer clic', () => {
      cy.get('button').find('.lucide-bell').click();
      // Agregar una aserción aquí para verificar si se abre el panel de notificaciones
      // Esto dependerá de cómo estén implementadas tus notificaciones
      // Por ejemplo: cy.get('#notifications-panel').should('be.visible');
    });
  
    // Caso de Prueba 5: Probar el menú desplegable del usuario
    it('debería abrir y cerrar el menú desplegable del usuario', () => {
      // Abrir el menú desplegable
      cy.get('button').find('.lucide-more-vertical').click();
      cy.get('[role="menu"]').should('be.visible');
  
      // Verificar los elementos del menú desplegable
      cy.contains('Mi cuenta').should('be.visible');
      cy.contains('Ajustes').should('be.visible');
      cy.contains('Cerrar sesión').should('be.visible');
  
      // Cerrar el menú desplegable haciendo clic fuera
      cy.get('body').click(0, 0);
      cy.get('[role="menu"]').should('not.exist');
    });
  
    // Caso de Prueba 6: Probar la navegación a la página de ajustes
    it('debería navegar a la página de ajustes', () => {
      cy.get('button').find('.lucide-more-vertical').click();
      cy.contains('Ajustes').click();
      // Ajustar la URL para que coincida con la URL real de tu página de ajustes
      cy.url().should('include', '/settings');
    });
  
    // Caso de Prueba 7: Probar la funcionalidad de cierre de sesión
    it('debería realizar la acción de cierre de sesión', () => {
      cy.get('button').find('.lucide-more-vertical').click();
      cy.contains('Cerrar sesión').click();
      // Agregar aserciones aquí para verificar si el cierre de sesión fue exitoso
      // Por ejemplo, verificar si se redirige a la página de inicio de sesión:
      // cy.url().should('include', '/login');
    });
  
    // Caso de Prueba 8: Probar la funcionalidad del menú móvil
    it('debería abrir y cerrar el menú móvil', () => {
      // Establecer el viewport al tamaño de un móvil
      cy.viewport('iphone-x');
  
      // Abrir el menú móvil
      cy.get('button').find('.lucide-menu').should('be.visible').click();
      cy.get('[role="dialog"]').should('be.visible');
  
      // Verificar si el contenido de la barra lateral es visible
      cy.get('.SidebarContent').should('be.visible');
  
      // Cerrar el menú móvil
      cy.get('body').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
    });
  
    // Caso de Prueba 9: Probar la capacidad de respuesta de la barra de navegación
    it('debería adaptarse a diferentes tamaños de pantalla', () => {
      // Verificar la vista de escritorio
      cy.viewport(1200, 800);
      cy.get('.md\\:flex').should('be.visible');
      cy.get('button').find('.lucide-menu').should('not.be.visible');
  
      // Verificar la vista móvil
      cy.viewport('iphone-x');
      cy.get('.md\\:flex').should('not.be.visible');
      cy.get('button').find('.lucide-menu').should('be.visible');
    });
  
    // Caso de Prueba 10: Probar la navegación por teclado
    it('debería soportar la navegación por teclado', () => {
      // Tabular hasta el campo de búsqueda
      cy.get('body').tab();
      cy.get('input[type="search"]').should('have.focus');
  
      // Tabular hasta el botón de cambio de tema
      cy.get('body').tab();
      cy.get('button[aria-label="Toggle theme"]').should('have.focus');
  
      // Continuar tabulando a través de otros elementos...
      // Es posible que necesites ajustar el número de tabulaciones según tu diseño exacto
    });
  });