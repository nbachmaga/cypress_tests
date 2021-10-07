pipeline {
    agent any

    tools {nodejs "node"}

    environment {
        CHROME_BIN = '/bin/google-chrome'
    }

    stages {
        stage('Dependencies') {
            steps {
                //sh 'rm -rf node_modules package-lock.json && npm install && npm i'
                sh 'npm i'
            }
        }
        stage('e2e Tests') {
            steps {
                 catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                sh 'npm run test:allure'
                     //sh 'npx cypress run'
                 }
            }  
        }
        stage('Allure Report') {
            steps {
                script {
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'target/allure-results']]
                ])
                }
            }
        }
        stage ('Mocha Report') {
            steps {
            publishHTML (target : [allowMissing: false,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'cypress/reports',
            reportFiles: 'index.html',
            reportName: 'My Reports',
            reportTitles: 'The Report'])
            }
        }
        stage('Jira Report') {
            steps {
                junit (
                    skipPublishingChecks: true,
 testResults: '**/reports/junit/*.xml',
 testDataPublishers: [
   jiraTestResultReporter(
     configs: [
       jiraStringField(fieldKey: 'summary', value: '${DEFAULT_SUMMARY}'),
       jiraStringField(fieldKey: 'description', value: '${DEFAULT_DESCRIPTION}'),
       jiraStringArrayField(fieldKey: 'labels', values: [jiraArrayEntry(value: 'Jenkins'), jiraArrayEntry(value:'e2e')])
     ],
     projectKey: 'TEST',
     issueType: '10009',
     autoRaiseIssue: false,
     autoResolveIssue: false,
     autoUnlinkIssue: false,
   )
 ]
)
            }
        }
    }
}
