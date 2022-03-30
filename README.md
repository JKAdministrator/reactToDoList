# commmit the changes of all files

git commit -a -m "added loguin with email & gmail"

# push to repository (branch principal: main)

git push -u origin <your-branch-name>

# see current branch and changes not staged for commit

git status

# create a new branch

git checkout -b <your-new-branch-name>

# deploy a firebase

firebase deploy

# deploy a firebase (solo funciones o solo hosting)

firebase deploy --only functions
firebase deploy --only hosting

# start a firebase emulator

firebase emulators:start

# Features

    React 16 using functional components & hooks
    - Global state (React Context)
    - Routing (React Router)
    - Login + Signin + Signup working Forms

    - Customizable style by user (light/dark mode)
    - Customizable language (english / spanish)
    - Security Microservice: NoSQL database (Firestore) + Node.js Cloud Functions (Firebase Cloud functions) for Registration, validation and authorization

    - MySQL database (Google Cloud) for core functionalities (Monolith style app working in conjuntion with the Security Miscroservice)
    - Node.js API EndPoints for REST API consuption
    - Server side rendering when seeing other users information


    How to test it?
    - Login with your gmail account (http://.../login) or Register at on http://.../signup
    - Create a Proyect
    - Create the lists for the proyect. Each list is a diferent state a task can have (example: "To Do" "Working on" "Testing" "Finished")
    - Create the first task for the proyect
    - Go to the recently created task and from there create subtasks
    - CRUD List on the proyect
    - CRUD Tasks on the proyect assining every task to a list
    - Create subtask

    - Assign users to the Proyect (by email) (it gives proyect tasks visualization)
    - Assign users to tasks (it gives full task control)
    - Give

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
