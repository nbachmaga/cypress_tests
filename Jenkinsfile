pipeline {
    agent any

    tools {nodejs "node"}

    environment {
        CHROME_BIN = '/bin/google-chrome'
    }

    stages {
        stage('Dependencies') {
            steps {
                sh 'npm i'
            }
        }
        stage('e2e Tests') {
            steps {
                 catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                sh 'npm run test:allure'
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
        stage('Jira Report') {
            steps {
                junit (
 testResults: '**/test-reports/*.xml',
 testDataPublishers: [
   jiraTestResultReporter(
     configs: [
       jiraStringField(fieldKey: 'summary', value: '${DEFAULT_SUMMARY}'),
       jiraStringField(fieldKey: 'description', value: '${DEFAULT_DESCRIPTION}'),
       jiraStringArrayField(fieldKey: 'labels', values: [jiraArrayEntry(value: 'Jenkins'), jiraArrayEntry(value:'e2e')])
     ],
     projectKey: 'TEST',
     issueType: 'Bug',
     autoRaiseIssue: false,
     autoResolveIssue: false,
     autoUnlinkIssue: false,
   )
 ]
)
            }
        }
    }
    post {
      always {
        junit '**/test-reports/*.xml'
      }
   } 
}
