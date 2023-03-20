# Syllium photography Keystone blog

This project uses :

- Keystone

Keystone helps you build faster and scale further than any other CMS or App Framework. Just describe your schema, and get a powerful GraphQL API & beautiful Management UI for content and data.

https://keystonejs.com/

- Apollo Client

Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Use it to fetch, cache, and modify application data, all while automatically updating your UI.

- Graph QL

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

- MongoDB

MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

- React

React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta (formerly Facebook) and a community of individual developers and companies.

React can be used as a base in the development of single-page, mobile, or server-rendered applications with frameworks like Next.js. However, React is only concerned with the user interface and rendering components to the DOM, so creating React applications usually requires the use of additional libraries for routing, as well as certain client-side functionality.

## Running the Project.

To run this project, open your terminal and run `yarn` within the Keystone project root to install all required packages, then run `yarn start blog` to begin running Keystone.

The Keystone Admin UI is reachable from `localhost:3000/admin`. To log in, use the following credentials:

Username: `admin@keystonejs.com`
Password: `password`

To see an example Next.js app using KeystoneJS' GraphQl APIs, head to `localhost:3000`.

You can change the port that this demo runs on by setting the `PORT` environment variable.

```sh
PORT=5000 yarn start blog
```

## TODO: Permissions and Authorisation

Although the "Password" auth strategy is enabled for the Admin UI on this project, we haven't implemented any restrictions on the GraphQL API yet. So unauthenticated users are able to create and destroy admin users (!)

See the [Access Control](https://keystonejs.com/guides/access-control) documentation for information on how to do this.

## "dev" with mongodb.com

1 - Check MONGO_URI in .env file
2 - Go to https://cloud.mongodb.com/
3 - Navigate to "Network access"
4 - Click on "ADD IP ADDRESS" button
5 - Allow "0.0.0.0/0" temporarily
6 - Launch `npm run dev`

(Login : n-------d@h------.com / Password : A-------! )
