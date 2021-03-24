# aloha

## project description

This is a tool that allows companies (and individuals) to create custom tests for evaluating candidates applying for a job/internship/position. Logged in users (with google account) can create evaluation projects. A project is a collection of test questions grouped into stages (or topics). The project allows the owners to generate unique tests, each containing a unique identifier for each applicant. For each stage, a random question from the collection of questions in that stage is chosen to be part of the test. The test progress can be saved (with Ctrl + S) and when the time is up, it will be automatically submitted as a solution.

The solutions page offers the possibility to evaluate candidates by offering grades per each question.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### deploy to production:

```
npm run build
firebase deploy
```


