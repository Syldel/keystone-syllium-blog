//imports for Keystone app core
const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { NextApp } = require('@keystonejs/app-next');
const { StaticApp } = require('@keystonejs/app-static');

require('dotenv').config();

let mongooseAdapterInstance;
if (process.env.MONGO_URI) {
  mongooseAdapterInstance = new MongooseAdapter({
    mongoUri: process.env.MONGO_URI
  });
} else {
  console.log('process.env.MONGO_URI undefined :-(');
  mongooseAdapterInstance = new MongooseAdapter();
}

const { staticRoute, staticPath, distDir } = require('./config');
const { User, Post, PostCategory, Comment, Setting, NavItem } = require('./schema');

const keystone = new Keystone({
  name: 'Keystone Syllium Blog',
  adapter: mongooseAdapterInstance,
  secureCookies: false,
  onConnect: async () => {
    // Initialise some data.
    // NOTE: This is only for demo purposes and should not be used in production
    const users = await keystone.lists.User.adapter.findAll();
    if (!users.length) {
      const initialData = require('./initialData');
      await keystone.createItems(initialData);
    }
  },
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

keystone.createList('User', User);
keystone.createList('Post', Post);
keystone.createList('PostCategory', PostCategory);
keystone.createList('Comment', Comment);
keystone.createList('Setting', Setting);
keystone.createList('NavItem', NavItem);

const adminApp = new AdminUIApp({
  adminPath: '/admin',
  hooks: require.resolve('./admin/'),
  authStrategy,
  isAccessAllowed: ({ authentication: { item: user } }) => !!user && !!user.isAdmin,
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: staticRoute, src: staticPath }),
    adminApp,
    new NextApp({ dir: 'app' }),
  ],
  distDir,
};
