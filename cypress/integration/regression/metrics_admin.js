const projects = require('../../fixtures/projects.json')
const metrics = require('../../fixtures/metrics.json')
const random = Cypress._.random(0, 1e6)
const dashboard = "Test Dashboard " + random

    describe("(Peru) Administrator Role Metrics Tests", () => {
        before(() => {
            cy.visit('/')
            cy.login(Cypress.env().admin, projects.peru)
        })

        beforeEach(() => {
            cy.restoreLocalStorage();
            cy.wait(1000)
            cy.visit('/module-loader/Metrics', {failOnStatusCode: false})
            cy.get('header h6', {timeout: 60000}).should('contain', 'Metrics')
        })

        afterEach(() => cy.saveLocalStorage());

        after(() => cy.clearLocalStorageSnapshot());

        it('CCSDK_TC_MET_01 Check that a dashboard can be added', () => {
            cy.get('.gridDrag').should('be.visible')
            cy.wait(5000);
            //cy.get('#metricsDashboard div[role="button"] > div').should('not.eq', 'Dashboard')
            cy.get('#add-layout').click()
            cy.get('[role="dialog"]').should('be.visible')
            cy.get('[name="input-name"]').type(dashboard)
            cy.get('[name="input-template"]').parent().click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('[data-value="Empty Dashboard"]').click()
            //cy.get('#input-template').should('have.value','Empty Dashboard')
            cy.get('#button-save').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('#input-name').should('have.value',dashboard)
            cy.get('.gridDrag').should('be.visible')
            cy.wait(5000);
            cy.get('#save-layout').click()
            cy.get('#metricsDashboard div[role="button"] > div').should('contain',dashboard)
            cy.get('.gridDrag').should('not.exist')
            cy.wait(5000);
        })

        it('CCSDK_TC_MET_02 Check that a dashboard can be edited by adding a new card', () => {
            cy.wait(5000);
            cy.getDashboard(dashboard)
            cy.get('#edit-layout').click()
            cy.get('p').contains('Add Card').click()
            cy.get('[role="dialog"]').should('be.visible')
                .find('h2').should('contain','Add New Card')
            cy.get('#input-title').type(metrics.device_monitoring.card_name)
            cy.get('#select-source').parent().click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('[data-value="'+metrics.device_monitoring.data_source+'"]').click()
            cy.get('[data-testid="select-source"]').should('have.value',metrics.device_monitoring.data_source)
            cy.get('#standard-select-metric').parent().click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('li').contains(metrics.device_monitoring.select_name).click()
            cy.get('#standard-select-metric').parent().find('div')
                .should('contain',metrics.device_monitoring.select_name)
            cy.get('[data-testid="submit-button"]').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('#save-layout').click()
            cy.get('.gridDrag h6 > span').should('contain',metrics.device_monitoring.card_name)
        })

        xit('CCSDK_TC_MET_03 Check that a card can be resized', () => {
            cy.getDashboard(dashboard)
            cy.window().then((win) => {
                cy.get('.react-grid-item').then(($el) => {
                    var width = win.getComputedStyle($el[0]).width
                    var height = win.getComputedStyle($el[0]).height
                    cy.log("w: "+width+" h: " +height)

                    cy.get('.react-resizable-handle')
                        .trigger('mousedown')
                        .trigger('mousemove',
                            {clientX: parseInt(width,10) + 100,
                                clientY: parseInt(height,10) + 300})
                        .trigger('mouseup',{force:true})
                    cy.get('.react-grid-item').should(($el) => {
                        expect($el).to.not.have.css('width',width)
                        expect($el).to.not.have.css('height',height)
                    })
                })
            })
        })

        it('CCSDK_TC_MET_04 Check that a Map card can be added to a dashboard', () => {
            cy.getDashboard(dashboard)
            cy.get('#edit-layout').click()
            cy.get('p').contains('Add Card').click()
            cy.get('[role="dialog"]').should('be.visible')
                .find('h2').should('contain','Add New Card')
            cy.get('#input-title').type(metrics.map.card_name)
            cy.get('#select-source').parent().click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('[data-value="'+metrics.map.data_source+'"]').click()
            cy.get('[data-testid="select-source"]').should('have.value',metrics.map.data_source)
            cy.get('#standard-select-metric').parent().click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('li').contains(metrics.map.select_name).click()
            cy.get('#standard-select-metric').parent().find('div')
                .should('contain',metrics.map.select_name)
            cy.get('[data-testid="submit-button"]').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('#save-layout').click()
            cy.get('.gridDrag iframe').should('be.visible')
            cy.get('.gridDrag h6 > span').last().should('contain',metrics.map.card_name)
        })

        it('CCSDK_TC_MET_05 Check that a Table card can be added to a dashboard', () => {
            cy.getDashboard(dashboard)
            cy.get('#edit-layout').click()
            cy.get('p').contains('Add Card').click()
            cy.get('[role="dialog"]').should('be.visible')
                .find('h2').should('contain','Add New Card')
            cy.get('#input-title').type(metrics.table.card_name)
            cy.get('#select-source').parent().click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('[data-value="'+metrics.table.data_source+'"]').click()
            cy.get('[data-testid="select-source"]').should('have.value',metrics.table.data_source)
            cy.get('#standard-select-metric').parent().as('select_name').click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('li').contains(metrics.table.select_name).click()
            cy.get('@select_name').find('div')
                .should('contain',metrics.table.select_name)
            cy.get('.MuiInputBase-root > #standard-select-metric').eq(1).parent().as('select_metric_type').click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('li').contains(metrics.table.select_metric_type).click()
            cy.get('@select_metric_type').find('div')
                .should('contain',metrics.table.select_metric_type)
            cy.get('.MuiInputBase-root > #standard-select-metric').eq(2).parent().as('select_field').click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('li').contains(metrics.table.select_field).click()
            cy.get('@select_field').find('div')
                .should('contain',metrics.table.select_field)
            cy.get('.MuiInputBase-root > #standard-select-metric').eq(3).parent().as('select_type').click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('li').contains(metrics.table.select_type).click()
            cy.get('@select_type').find('div')
                .should('contain',metrics.table.select_type)

            cy.get('[data-testid="submit-button"]').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('#save-layout').click()
            cy.get('.gridDrag h6 > span').last().should('contain',metrics.table.card_name)
        })

        it('CCSDK_TC_MET_06 Check that a Chart card can be added to a dashboard', () => {
            cy.getDashboard(dashboard)
            cy.get('#edit-layout').click()
            cy.get('p').contains('Add Card').click()
            cy.get('[role="dialog"]').should('be.visible')
                .find('h2').should('contain','Add New Card')
            cy.get('#input-title').type(metrics.chart.card_name)
            cy.get('#select-source').parent().click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('[data-value="'+metrics.chart.data_source+'"]').click()
            cy.get('[data-testid="select-source"]').should('have.value',metrics.chart.data_source)
            cy.get('#standard-select-metric').parent().click()
            cy.get('ul[role="listbox"]')
                .find('li').contains(metrics.chart.select_name).scrollIntoView().click()
            cy.get('#standard-select-metric').parent().find('div')
                .should('contain',metrics.chart.select_name)
            cy.get('span').contains('bar').click()
            cy.get('[data-testid="submit-button"]').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('#save-layout').click()
            cy.get('.VictoryContainer').should('be.visible')
            cy.get('.gridDrag h6 > span').last().should('contain',metrics.chart.card_name)
        })

        it('CCSDK_TC_MET_10 Check that card filters function as expected', () => {
            cy.getDashboard(dashboard)
            cy.get('#edit-layout').click()
            cy.get('p').contains('Add Card').click()
            cy.get('[role="dialog"]').should('be.visible')
                .find('h2').should('contain', 'Add New Card')
            cy.get('#demo-mutiple-chip').parent().click()
            cy.get('ul[role="listbox"]')
                .find('[data-value="activity"]').click()
            cy.focused().type('{esc}')
            cy.get('#select-multiple-chip').should('have.value', 'activity')
            cy.get('#select-source').parent().click()
            cy.get('ul[role="listbox"] li').should(($lis) => {
                expect($lis).to.have.length(1)
                expect($lis.eq(0)).to.contain('Metrics')
            }).eq(0).click()
            cy.get('[data-testid="select-source"]').should('have.value', 'metrics')
            cy.get('#standard-select-metric').parent().click()
            cy.get('ul[role="listbox"] li').should(($lis) => {
                expect($lis).to.have.length(2)
                expect($lis.eq(0)).to.contain('1. Activity Demo')
                expect($lis.eq(1)).to.contain('2. Empty activityShape Demo')
            }).eq(0).click()
            cy.get('#demo-mutiple-chip').parent().click()
            cy.get('ul[role="listbox"]')
                .find('[data-value="crossSection"]').click()
            cy.focused().type('{esc}')
            cy.get('#select-multiple-chip').should('have.value', 'activity,crossSection')
            cy.get('#select-source').parent().click()
            cy.get('ul[role="listbox"] li').should(($lis) => {
                expect($lis).to.have.length(2)
                expect($lis.eq(0)).to.contain('Cross-Section - Metrics')
                expect($lis.eq(1)).to.contain('Metrics')
            }).eq(0).click()
            cy.get('[data-testid="select-source"]').should('have.value', 'crossSectionMetrics')
            cy.get('#standard-select-metric').parent().click()
            cy.get('ul[role="listbox"] li').should(($lis) => {
                expect($lis).to.have.length(1)
                expect($lis.eq(0)).to.contain('1. All Sensors')
            }).eq(0).click()
            cy.get('[role="dialog"] [role="button"] > span').contains('Cancel').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('#cancel-layout').click()
        })

        it('CCSDK_TC_MET_11 Check that a dashboard can be saved as a template', () => {
            cy.getDashboard(dashboard)
            cy.get('#more-button').click()
            cy.get('[role="menu"] >li').contains('Save Dashboard Template').click()
            cy.get('form').should('be.visible')
            cy.get('#form-dialog-title > h2').should('contain','Save Template')
            cy.get('[name="input-name"]').should('have.value',dashboard)
            cy.get('[name="input-template"]').should('have.value','New Template')
            cy.get('#button-save').click()
            cy.get('form').should('not.exist')
            //cy.focused().type('{esc}')
            cy.get('#more-button').click()
            cy.get('[role="menu"] >li').contains('Delete Dashboard Template').click()
            cy.get('[name="input-template"]').parent().click()
            cy.get('ul[role="listbox"] li[data-value="'+dashboard+'"]').should('be.visible')
        })

        it('CCSDK_TC_MET_012 Check that a dashboard can be added from a template', () => {
            cy.getDashboard(dashboard)
            //cy.get('.react-grid-layout').screenshot('template')
            cy.get('#add-layout').click()
            cy.get('[role="dialog"]').should('be.visible')
            cy.get('[name="input-name"]').type(dashboard + " 2")
            cy.get('[name="input-template"]').parent().click()
            cy.get('ul[role="listbox"]').should('be.visible')
                .find('[data-value="Template - '+dashboard+'"]').scrollIntoView().click()
            cy.get('[name="input-template"]').should('have.value','Template - '+dashboard)
            cy.get('#button-save').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('#input-name').should('have.value',dashboard + " 2")
            cy.get('.gridDrag').should('be.visible')
            cy.get('#save-layout').click()
            cy.get('#metricsDashboard div[role="button"] > div').should('contain',dashboard + " 2")
            // cy.get('.gridDrag').should('not.exist')
            // cy.wait(1000)
            //cy.get('.react-grid-layout').compareSnapshot('template')
        })

        it('CCSDK_TC_MET_14 Check that a dashboard template can be deleted', () => {
            cy.get('#more-button').click()
            cy.get('[role="menu"] >li').contains('Delete Dashboard Template').click()
            cy.get('form').should('be.visible')
            cy.get('#form-dialog-title > h2').should('contain','Delete Template')
            cy.get('[name="input-template"]').parent().click()
            cy.get('ul[role="listbox"] li[data-value="'+dashboard+'"]').should('be.visible').click()
            cy.get('[name="input-template"]').should('have.value',dashboard)
            cy.get('#button-save').click()
            cy.get('form').should('not.exist')
            //cy.focused().type('{esc}')
            cy.get('#more-button').click()
            cy.get('[role="menu"] >li').contains('Delete Dashboard Template').click()
            cy.get('[name="input-template"]').parent().click()
            cy.get('ul[role="listbox"] li[data-value="'+dashboard+'"]').should('not.exist')
        })

        it('CCSDK_TC_MET_16 Check that a dashboard can be deleted', () => {
            cy.getDashboard(dashboard)
            cy.get('#edit-layout').click()
            cy.get('#metricsDashboard button[aria-label="delete"]').should('be.visible').click()
            cy.get('[role="dialog"]').should('be.visible')
                .find('#alert-dialog-title > h2')
                .should('contain', 'Confirm Delete')
            cy.get('#button-confirm').click()
            cy.get('[role="dialog"]').should('not.exist')
            cy.get('#metricsDashboard div[role="button"] > div').should('not.contain',dashboard)
            cy.get('#metricsDashboard div[role="button"]').click()
            cy.get('ul[role="listbox"] > li[data-value="'+ dashboard + '"]').should('not.exist')
        })
})