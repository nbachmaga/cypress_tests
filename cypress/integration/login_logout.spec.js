const projects = require('../fixtures/projects.json')
const admin_modules = require('../fixtures/admin_menu_modules.json')
const dashboard_modules = require('../fixtures/dashboard_menu_modules.json')

const states = [
    {
        "user_name": "Administrator",
        "user": Cypress.env().admin,
        "modules": admin_modules
    },
    // {
    //     "user_name": "Dashboard User",
    //     "user": Cypress.env().dashboard,
    //     "modules": dashboard_modules
    // }
    ]

states.forEach((state) => {
    describe(state.user_name + ' Role Smoke Tests', () => {

        beforeEach(() => cy.restoreLocalStorage());

        afterEach(() => cy.saveLocalStorage());

        after(() => cy.clearLocalStorageSnapshot());

        it('CCSDK_TC_SMK_01 Check login of ' + state.user_name + ' to Inmarsat TIA', () => {
            cy.visit('/')
                .url().should('match', /login/)

            cy.get('[name="username"]',{timeout:60000})
                .type(state.user.username)

            cy.get('[name="password"]')
                .type(state.user.password)

            cy.get('[type="submit"]').click()

            cy.get('[data-cy="admin_select-project-page_select-project-form_projects-list"]').should('be.visible')
        })

        it('CCSDK_TC_SMK_02 Check that project list displayed and directs user upon project selection', () => {
            cy.get('[data-cy="admin_select-project-page_select-project-form_projects-list"] li').should(($lis) => {
                expect($lis).to.have.length(4)
                expect($lis.eq(1)).to.contain(projects.australia)
                expect($lis.eq(2)).to.contain(projects.mexico)
                expect($lis.eq(3)).to.contain(projects.peru)
            })
                .eq(3).click()

            cy.wait(2000)
            cy.get('[type="submit"]').click()

            cy.url().should('contain', '/module-loader/Metrics2')

            cy.get('[data-cy="admin_main_header_project-selector"] input').should('have.value', projects.peru)
        })

        it('CCSDK_TC_SMK_03 Check logout of ' + state.user_name + ' from Inmarsat TIA', () => {
            cy.get('[data-cy="admin_main_header_menu-hamburger"]').click()
            cy.get('[data-cy="admin_menu_header_toggle-profile"]').click()
            cy.get('[data-cy="admin_menu_menu-item_sign-out"]').click()
            cy.url().should('match', /login/)
        })
    })
})
