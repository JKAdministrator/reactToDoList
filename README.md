# Tasky
*Manage tasks quickly*
A Trello like board demo with login /logout / user profile forms  

## About this app
The app is developed by [Julio Kania](linkedin.com/in/juliokania) as a practical exercise to learn React.

> Technical information:
- [React v18](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/) 
- Internationalization with [i18next](https://www.i18next.com/)
- Global state management with [React Context](https://es.reactjs.org/docs/context.html)
- Page router with [React Router](https://v5.reactrouter.com/)
- Code Splitting with [React Suspense](https://17.reactjs.org/docs/concurrent-mode-suspense.html)
- styled commponents with [Material Design](https://v4.mui.com/) && [CSS Modules](https://developer.adobe.com/commerce/pwa-studio/guides/general-concepts/css-modules/)
- Trello like boards with [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- Backend with [Firebase](https://firebase.google.com/) (Hosting, Node 16 Cloud functions & NoSQL database)

> Pending technical features
- Unit Testing with Jest (It is not so easy since most of the components use global context variables to access the database assuming that the user is already logged in) 
- Redux (It is not justified to use it for this project as it is a fairly small system) 
- Github actions
