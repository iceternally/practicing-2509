pipeline {
  agent any
  options { timestamps(); ansiColor('xterm') }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Task1 - Python Build') {
      steps {
        dir('task1') {
          sh 'python -m pip install --upgrade pip && if [ -f requirements.txt ]; then pip install -r requirements.txt; fi'
          sh 'python -m compileall app'
          sh 'docker build -t ${REGISTRY}/${JOB_NAME}-task1:${GIT_COMMIT} .'
        }
      }
    }
    stage('Task2 - Frontend Build') {
      steps {
        dir('task2') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }
    stage('Task2 - Backend Build') {
      steps {
        dir('task2/backend-java') {
          sh 'mvn -B verify'
          sh 'docker build -t ${REGISTRY}/${JOB_NAME}-task2-backend:${GIT_COMMIT} .'
        }
      }
    }
    stage('Push Images') {
      when { branch 'main' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'registry-creds', usernameVariable: 'REGISTRY_USERNAME', passwordVariable: 'REGISTRY_PASSWORD')]) {
          sh 'echo $REGISTRY_PASSWORD | docker login $REGISTRY -u $REGISTRY_USERNAME --password-stdin'
          sh 'docker push ${REGISTRY}/${JOB_NAME}-task1:${GIT_COMMIT}'
          sh 'docker push ${REGISTRY}/${JOB_NAME}-task2-backend:${GIT_COMMIT}'
        }
      }
    }
  }
}