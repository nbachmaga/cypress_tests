// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-localstorage-commands'
//import 'cypress-wait-until'
import 'cypress-file-upload'

// const compareSnapshotCommand = require('cypress-image-diff-js/dist/command')
// compareSnapshotCommand()

Cypress.Commands.add("login", (user, project) => {
    cy.get('[name="username"]',{timeout:60000}).type(user.username)
    cy.get('[name="password"]').type(user.password)
    cy.get('[type="submit"]').click()
    cy.get('[data-cy="admin_select-project-page_select-project-form_projects-list"] li').contains(project).click()
    cy.wait(500)
    cy.get('[type="submit"]').click()
    cy.get('[data-cy="admin_main_header_project-selector"] input',{timeout:60000}).should('have.value', project)

    cy.saveLocalStorage();
})

Cypress.Commands.add("changeProject", (project) => {
    cy.get('[data-cy="admin_main_header_project-selector"] input').click({ force: true })
    cy.get('[data-cy="admin_select-project-page_select-project-form_projects-list"] > div').contains(project).click()
    cy.get('button').contains('Yes').click()
    cy.get('[role="dialog"]').should('not.exist')
    cy.get('[data-cy="admin_main_header_project-selector"] input').should('have.value', project)
    cy.get('#cc-module-area',{timeout:30000}).should('be.visible')
})

Cypress.Commands.add("getDashboard", (dashboard) => {
    cy.get('#metricsDashboard div[role="button"]').click()
    cy.get('ul[role="listbox"] > li[data-value="'+ dashboard + '"]').click()
    cy.get('#metricsDashboard div[role="button"] > div').should('contain', dashboard)
})

Cypress.Commands.add("checkAllModules", (modules) => {
    cy.get('ul nav > div')
        .should('have.length', modules.modules_all.length)
        .then(($item) => {
            for (var i=0; i< modules.modules_all.length; i++)
            {
                cy.get($item).contains(modules.modules_all[i])
                    .should('contain', modules.modules_all[i])
            }
        })
})

Cypress.Commands.add("clickAllModules", (modules) => {
    cy.get('ul nav div[role="button"]').then(($btn) => {
        for (var i=0; i< modules.modules_clickable.length; i++) {
            cy.get($btn).contains(modules.modules_clickable[i]).click()
            if (modules.modules_clickable[i] == "Task Manager")
            {
                cy.get('header h6').should('contain', "Task Monitor")
            }
        else
            {
                cy.get('header h6').should('contain', modules.modules_clickable[i])
            }
            cy.get('#cc-module-area',{timeout:30000}).should('be.visible')
        }
    })
})

Cypress.Commands.add("getFirstLine", (table) => {
    return cy.get(table).find('div:last-child > div > div > div > div > div:last-child > div:first-child > div')
})

Cypress.Commands.add("getLastLine", (table) => {
    return cy.get(table).find('div:last-child > div > div > div > div > div:last-child > div:last-child > div')
})