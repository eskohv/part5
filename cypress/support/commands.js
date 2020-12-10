Cypress.Commands.add('login', ({ username, password }) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/login',
        body:{ username, password } ,
        failOnStatusCode: false
    }).then(({ body }) => {
        console.log(body)
        if( body.error === ('invalid username or password')) {
            cy.wait(150)
            console.log('error')
        } else {
            localStorage.setItem('loggedBlogListUser', JSON.stringify(body))
            cy.visit('http://localhost:3000')
        }
    })
})

Cypress.Commands.add('newBlog', ({ title, author, url }) => {
    cy.request({
        url: 'http://localhost:3001/api/blogs',
        method: 'POST',
        body: { title, author, url },
        headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogListUser')).token}`
        }
    })

    cy.visit('http://localhost:3000')
})