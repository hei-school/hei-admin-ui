it('show location details', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')

    cy.get('#location > :nth-child(1)').contains(student1Mock.location.latitude)
    cy.get('#location > :nth-child(2)').contains(student1Mock.location.longitude)
  })

  it('show error message when api doesn"t support the new functionality', () => {
    const error = 'Pas de coordonée GPS'
    cy.intercept('GET', `/students/${student1Mock.id}`, student1MockNoLocation).as('getStudent')

    cy.get('#location > :nth-child(1)').contains(error)
  })