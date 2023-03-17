describe('Profile Show', () => {
    it('displays the latitude and longitude fields with default values', () => {
      cy.login()
      cy.visit('/profile')
  
      cy.contains('Latitude')
        .next()
        .should('contain', 'LATITUDE HERE')
  
      cy.contains('Longitude')
        .next()
        .should('contain', 'LONGITUDE HERE')
    })
  })
  