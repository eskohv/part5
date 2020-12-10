describe('Blog list', function() {
    beforeEach(function () {
        cy.wait(150)
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Eetu',
            username: 'admin',
            password: 'password'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })
    it('front page can be opened', function () {
        cy.contains('Login to application')
    })
    it('user can login', function () {
        cy.login({ username: 'admin', password: 'password' })

        cy.contains('Eetu logged in')
    })
    it('login fails with wrong credentials', function () {
        cy.get('#username').type('wrong')
        cy.get('#password').type('credentials')
        cy.get('#loginButton').click()

        cy.contains('Wrong credentials')
        cy.get('.error').should('have.css','color','rgb(255, 0, 0)')
    })

    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'admin', password: 'password' })
        })
        describe('And a blogpost exists',function () {
            beforeEach(function () {
                cy.newBlog({ title: 'Cypress', author: 'Cypress', url: 'www.cypress.com' })
            })
            //if a post can be expanded, it exists
            it('it post can be expanded', function () {
                cy.get('#view-button').click()
                cy.contains('hide')
            })
            it('it can be liked', function () {
                cy.get('#view-button').click()
                cy.get('#like-button').click()
                cy.contains('1')
            })
            it('if can be deleted', function () {
                cy.get('#view-button').click()
                cy.get('#delete-button').click()
                cy.contains('Cypress').should('not.exist')
            })
        })
    })
})
