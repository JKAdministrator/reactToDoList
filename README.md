# Tasky
*Manage tasks quickly*
A Trello like board demo with login /logout / user profile forms  

## Why should i use it?
Tasky allows the organization to organize all its projects in a simple way by automating the priority of the requirements based on dependencies.
Additionally, it has tools to facilitate agile development, such as the kanban board for each project, organizational chat, and ticket system.

## What do I need to start?
To enter Tasky go to [Tasky.com](https://reactapptesting-4bfbb.web.app/login). From there you can access with your Google username or create a user using an email address.

## Why are features missing?
The application is in alpha so many of its main features are not online at the moment. Please note that due to this all information is deleted periodically, including registered users.

## Who is in charge of development?
Tasky.com is developed by [Julio Kania](linkedin.com/in/juliokania) as a practical exercise to learn React.

> Technical information:
- [React v18](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/) 
- Internationalization with [i18next](https://www.i18next.com/)
- Global state management with [React Context](https://es.reactjs.org/docs/context.html)
- Page router with [React Router](https://v5.reactrouter.com/)
- Code Splitting with [React Suspense](https://17.reactjs.org/docs/concurrent-mode-suspense.html)
- Styled commponents with [Material Design](https://v4.mui.com/)
- Trello like boards with [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- Backend with [Firebase](https://firebase.google.com/):

> Pending technical features
- Unit Testing with Jest (It is not so easy since most of the components use global context variables to access the database assuming that the user is already logged in) 
- Redux (It is not justified to use it for this project as it is a fairly small system) 
- Github actions
