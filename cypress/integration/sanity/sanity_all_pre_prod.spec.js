const projects = require('../../fixtures/projects.json')
const journal = require('../../fixtures/journal_entry.json')
const cross_section = require('../../fixtures/cross_section.json')
const file = require('../../fixtures/file.json')
const random = Cypress._.random(0, 1e6)

const states = [
    {
        "suite_name": "(Norway) Administrator Role Sanity Tests",
        "user": Cypress.env().admin,
        "project": projects.peru
    },
    // {
    //     "suite_name": "(Peru) Dashboard Role Sanity Tests",
    //     "user": Cypress.env().dashboard,
    //     "project": projects.peru
    // },
    // {
    //     "suite_name": "(Australia) Administrator Role Sanity Tests",
    //     "user": Cypress.env().admin,
    //     "project": projects.australia
    // },
    // {
    //     "suite_name": "(Australia) Dashboard Role Sanity Tests",
    //     "user": Cypress.env().dashboard,
    //     "project": projects.australia
    // },
    // {
    //     "suite_name": "(Mexico) Administrator Role Sanity Tests",
    //     "user": Cypress.env().admin,
    //     "project": projects.mexico
    // },
    // {
    //     "suite_name": "(Mexico) Dashboard Role Sanity Tests",
    //     "user": Cypress.env().dashboard,
    //     "project": projects.mexico
    // }
]

states.forEach((state) => {
    describe(state.suite_name, () => {
        before(() => {
            cy.visit('/')
            cy.get('[name="username"]').type(state.user.username)
            cy.get('[name="password"]').type(state.user.password)
            cy.get('[type="submit"]').click()
            cy.get('header:first-child input').should('have.value', 'Sintef')

            //cy.saveLocalStorage();
        })

        beforeEach(() => {
            //cy.restoreLocalStorage();
            cy.visit('/module-loader/Home', {failOnStatusCode: false})
            cy.get('header h6', {timeout: 60000}).should('contain', 'Home')
        })

        // afterEach(() => cy.saveLocalStorage());
        //
        // after(() => cy.clearLocalStorageSnapshot());

        it('CCSDK_TC_SAN_01 Check that required dashboards are present in Metrics', () => {
            cy.visit('/module-loader/Metrics', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Metrics')
            cy.get('#metricsDashboard div[role="button"]').click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .then(($lis) => {
                    cy.get($lis).find('[data-value="Site Overview"]').should('be.visible')
                    cy.get($lis).find('[data-value="Site Monitoring"]').should('be.visible')
                    cy.get($lis).find('[data-value="Safety Dashboard"]').should('be.visible')

                })
        })

        xit('CCSDK_TC_SAN_02 Check that Map card functions as expected', () => {
            cy.visit('/module-loader/Metrics', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Metrics')

            cy.getDashboard('Site Monitoring')

            // cy.get('h6').contains('Map').should('be.visible')
            //     .parentsUntil('div[class="react-grid-item react-draggable cssTransforms react-resizable"]')
        })

        xit('CCSDK_TC_SAN_03 Check that the time machine is functioning as expected', () => {
            cy.visit('/module-loader/Metrics', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Metrics')

            cy.getDashboard('Site Monitoring')

            cy.get('#show-timebar').click()
            cy.get('div[class="jss528 jss529"]').should('be.visible')
        })

        it('CCSDK_TC_SAN_04 Check that a journal entry can be added from the journal manager', () => {
            var random_2 = Cypress._.random(0, 1e6)

            cy.visit('/module-loader/JournalManager', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Journal Manager')

            cy.get('#journal-manager button[data-testid="save-edit-changes-btn"]').click()
            cy.get('[role="dialog"]').should('be.visible')
            cy.get('span').contains('Save').parent().should('be.disabled')

            cy.get('#title').type(journal.title + random_2).then(() => {
                cy.get('span').contains('Save').parent().should('not.be.disabled')
            })
            cy.get('#content').type(journal.content)
            journal.tags.forEach(item => cy.get('#tags').type(item + '{enter}'))
            cy.get('span').contains('Save').parent().click().then(() => {
                cy.get('[role="dialog"]').should('not.exist')
            })

            cy.getFirstLine('#journal-table').should('be.visible')
            cy.get('span').contains(journal.title + random_2).should('be.visible')
            cy.get('[placeholder="Search"]').type(journal.title + random_2)
            cy.getFirstLine('#journal-table')
                .should(($divs) => {
                    expect($divs.eq(0)).to.deep.contain(journal.title + random_2)
                    expect($divs.eq(1)).to.deep.contain(journal.content)
                    journal.tags.forEach(item => expect($divs.eq(2)).to.deep.contain(item))
                    expect($divs.eq(4)).to.deep.contain(Cypress.moment().format('MM/DD/YYYY'))
                }).wait(2000)
                .eq(5).find('button[aria-label="Delete"]').click({force: true})

            cy.get('[role="dialog"]').should('be.visible')
                .get('#scroll-dialog-title > h2')
                .should('contain', 'Delete Journal Entry')

            cy.get('button').contains('Delete').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('[data-testid="no-results"]')
                .should('be.visible')
        })

        it('CCSDK_TC_SAN_05 Check that a journal entry can be added from a dashboard', () => {
            cy.visit('/module-loader/Metrics', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Metrics')

            cy.getDashboard('Site Overview')

            cy.get('#more-button').click()
            cy.get('[role="menu"]').should('be.visible')
                .find('li').contains('Add Journal Entry').click()

            cy.get('[role="dialog"]').should('be.visible')
            cy.get('[role="tab"]', {timeout: 120000}).should('be.visible')
            cy.get('#title').type(journal.title + random)
            cy.get('#content').type(journal.content)
            journal.tags.forEach(item => cy.get('#tags').type(item + '{enter}'))
            cy.get('[role="dialog"]').find('span').contains('Save').parent().click()
                .then(() => {
                    cy.get('[role="dialog"]').should('not.exist')
                })
            cy.wait(2000)

            cy.visit('/module-loader/JournalManager', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Journal Manager')

            cy.getFirstLine('#journal-table').should('be.visible')
            cy.get('span').contains(journal.title + random).should('be.visible')
            cy.get('[placeholder="Search"]').type(journal.title + random)

            cy.getFirstLine('#journal-table')
                .should(($divs) => {
                    expect($divs.eq(0)).to.deep.contain(journal.title + random)
                    expect($divs.eq(1)).to.deep.contain(journal.content)
                    journal.tags.forEach((item) => expect($divs.eq(2)).to.deep.contain(item))
                    expect($divs.eq(4)).to.deep.contain(Cypress.moment().format('MM/DD/YYYY'))
                })
        })

        it('CCSDK_TC_SAN_06 Check that a journal entry can be deleted', () => {
            cy.visit('/module-loader/JournalManager', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Journal Manager')

            cy.getFirstLine('#journal-table').should('be.visible')
            cy.get('span').contains(journal.title + random).should('be.visible')
            cy.get('[placeholder="Search"]').type(journal.title + random)

            cy.getFirstLine('#journal-table')
                .should(($divs) => {
                    expect($divs.eq(0)).to.deep.contain(journal.title + random)
                }).wait(2000)
                .eq(5).find('button[aria-label="Delete"]').click({force: true})

            cy.get('[role="dialog"]').should('be.visible')
                .get('#scroll-dialog-title > h2')
                .should('contain', 'Delete Journal Entry')

            cy.get('button').contains('Delete').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('[data-testid="no-results"]')
                .should('be.visible')
        })

        it('CCSDK_TC_SAN_07 Check that an admin can add a cross section', () => {
            cy.visit('/module-loader/Data/GeoJsonEditor', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Cross Sections')

            cy.get('button[text="Add"]').click()
                .url().should('match', /create/)

            cy.get('#name').clear().type(cross_section.name + random)
            cy.get('#description').type(cross_section.description)
            cy.get('#x0Location').type(cross_section.origin)
            cy.get('#xMaxLocation').type(cross_section.end_point)

            cy.get('button[text="Save"]').scrollIntoView().should('be.visible').click()

            cy.getFirstLine('#geo-table').should('be.visible')
            cy.get('#search').type(cross_section.name + random)

            cy.getLastLine('#geo-table')
                .should(($divs) => {
                    expect($divs.eq(1).find('h6').eq(0)).to.deep.contain(cross_section.name + random)
                    expect($divs.eq(1).find('h6').eq(1)).to.deep.contain(cross_section.description)
                    //expect($divs.eq(3)).to.deep.contain(Cypress.moment().format('MM/DD/YYYY'))
                })
        })

        xit('CCSDK_TC_SAN_08 Check that an admin user can add a pond level sensor', () => {
            cy.visit('/module-loader/Data/GeoJsonEditor', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Cross Sections')

            cy.getFirstLine('#geo-table').should('be.visible')
            cy.get('#search').type(cross_section.name + random)

            cy.getLastLine('#geo-table')
                .should(($divs) => {
                    expect($divs.eq(1).find('h6').eq(0)).to.deep.contain(cross_section.name + random)
                    expect($divs.eq(1).find('h6').eq(1)).to.deep.contain(cross_section.description)
                    //expect($divs.eq(3)).to.deep.contain(Cypress.moment().format('MM/DD/YYYY'))
                })
                .eq(5).find('button[aria-label="Edit"]').click({force: true})
                .url().should('match', /edit/)

            cy.get('[role="tab"]').contains('Diagram').click()

            cy.get('.leaflet-draw-draw-marker').click()
            cy.get('.leaflet-container').click(390, 250)
            cy.get('.react-draggable').should('be.visible')
                .find('ul > div').eq(1).click()
            cy.get('img.leaflet-marker-icon').should('be.visible')

            cy.get('button[text="Save"]').scrollIntoView().should('be.visible').click()
        })

        it('CCSDK_TC_SAN_09 Check that an admin can delete a cross section', () => {
            cy.visit('/module-loader/Data/GeoJsonEditor', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'Cross Sections')

            cy.getFirstLine('#geo-table').should('be.visible')
            cy.get('#search').type(cross_section.name + random)

            cy.getLastLine('#geo-table')
                .should(($divs) => {
                    expect($divs.eq(1).find('h6').eq(0)).to.deep.contain(cross_section.name + random)
                })
                .eq(5).find('button[aria-label="Delete"]').click({force: true})
            cy.get('[role="dialog"]').should('be.visible')
                .find('button').contains('Yes').click()

            cy.get('[role="dialog"]').should('not.exist')
        })

        it('CCSDK_TC_SAN_10 Check file upload and deleting', () => {
            var fileUpload = 'test_image.png'
            cy.visit('/module-loader/FileManager', {failOnStatusCode: false})
            cy.get('header h6').should('contain', 'File Manager').should('be.visible')

            cy.get('#file-table').should('be.visible')
                .find('[role ="progressbar"]').should('not.exist')
            cy.wait(5000)
            cy.get('#file-manager button[data-testid="save-edit-changes-btn"]').click()
            cy.get('[role="dialog"]').should('be.visible')
            cy.get('[data-testid="fileuploader-dropzone"]')
                .attachFile(fileUpload, {subjectType: 'drag-n-drop'})

            cy.get('#content-type').should('contain', 'Image')
            cy.get('span').contains(fileUpload).should('be.visible')

            cy.get('label').contains('Display Name').parent().parent().find('input')
                .type(file.name + random)
            file.tags.forEach(item => cy.get('[placeholder="Enter tags"]').type(item + '{enter}'))

            cy.get('[role="dialog"]').find('span').contains('Upload').parent().click()
                .then(() => {
                    cy.get('[role="dialog"]').should('not.exist')
                })

            cy.getFirstLine('#file-table').should('be.visible')
                .find('span').contains(file.name + random).should('be.visible')
            cy.get('[placeholder="Search"]').type(file.name + random)
            cy.getFirstLine('#file-table')
                .should(($divs) => {
                    expect($divs.eq(1)).to.deep.contain(file.name + random)
                    expect($divs.eq(2)).to.deep.contain(file.type)
                    expect($divs.eq(3)).to.deep.contain(file.filesize)
                    file.tags.forEach(item => expect($divs.eq(4)).to.deep.contain(item))
                    expect($divs.eq(5)).to.deep.contain(Cypress.moment().format('MM/DD/YYYY'))
                })
                .eq(6).find('button[aria-label="Delete"]').click({force: true})

            cy.get('[role="dialog"]').should('be.visible')
                .get('#scroll-dialog-title > h2')
                .should('contain', 'Confirm Delete')

            cy.get('[data-testid="delete-file-confirm"]').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('[data-testid="no-results"]')
                .should('be.visible')
        })
    })
})