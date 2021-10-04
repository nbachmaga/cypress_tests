const projects = require('../../fixtures/projects.json')
const admin_modules = require('../../fixtures/admin_menu_modules.json')
const dashboard_modules = require('../../fixtures/dashboard_menu_modules.json')

const states = [
    {
        "user_name": "Administrator",
        "user": Cypress.env().admin,
        "modules": admin_modules
    },
    {
        "user_name": "Dashboard User",
        "user": Cypress.env().dashboard,
        "modules": dashboard_modules
    }
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

            cy.url().should('contain', '/module-loader/Metrics')

            cy.get('[data-cy="admin_main_header_project-selector"] input').should('have.value', projects.peru)
        })
        it('CCSDK_TC_SMK_03 Check correct version number displayed', () => {
            cy.get('[data-cy="admin_main_header_version"]')
                .should('have.attr', 'href', '/About')
                .should('contain', Cypress.env().version)
                .click()

            cy.url().should('contain', '/About')

            cy.get('h4').should('contain', 'About')
        })

        it('CCSDK_TC_SMK_04 (Peru) Check that ' + state.user_name + ' has full access to modules', () => {
            cy.get('[data-cy="admin_main_header_menu-hamburger"]').click()

            cy.checkAllModules(state.modules)
            cy.clickAllModules(state.modules)
        })

        it('CCSDK_TC_SMK_05 (Australia) Check that ' + state.user_name + ' has full access to modules', () => {
            cy.changeProject(projects.australia)

            cy.checkAllModules(state.modules)
            cy.clickAllModules(state.modules)
        })

        xit('CCSDK_TC_SMK_06 (Mexico) Check that ' + state.user_name + ' has full access to modules', () => {
            cy.changeProject(projects.mexico)

            cy.checkAllModules(state.modules)
            cy.clickAllModules(state.modules)
        })

        it('CCSDK_TC_SMK_07 Check that a project can be changed', () => {
            cy.get('[data-cy="admin_main_header_project-selector"] input').click({force: true})
            cy.get('[data-cy="admin_select-project-page_select-project-form_projects-list"]').should('be.visible')
            cy.get('[data-cy="admin_select-project-page_select-project-form_projects-list"] > div').should(($divs) => {
                expect($divs).to.have.length(3)
                expect($divs.eq(0)).to.contain(projects.australia)
                expect($divs.eq(1)).to.contain(projects.mexico)
                expect($divs.eq(2)).to.contain(projects.peru)
            }).eq(2).click()
            cy.get('h2').contains('Changing Project').should('be.visible')
            cy.get('button').contains('Yes').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('[data-cy="admin_main_header_project-selector"] input').should('have.value', projects.peru)
        })

        it('CCSDK_TC_SMK_08 Check logout of ' + state.user_name + ' from Inmarsat TIA', () => {
            cy.get('[data-cy="admin_menu_header_toggle-profile"]').click()
            cy.get('[data-cy="admin_menu_menu-item_sign-out"]').click()
            cy.url().should('match', /login/)
        })
    })
})