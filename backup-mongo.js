const backup = require('mongodb-backup-4x');

// HELP : https://www.npmjs.com/package/mongodb-backup
// Fork : https://github.com/phoscur/mongodb-backup

require('dotenv').config();

if (process.env.MONGO_URI) {

  /*
  const MongoClient = require('mongodb').MongoClient;
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    if (err) {
      console.log('error:', err);
    } else {
      console.log('client.db("test")', client.db("test"));
      const collection = client.db("test").collection("devices");
      // perform actions on the collection object
      client.close();
    }
  });
  */

  const date = new Date();
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const dateString = `${y}-${m}-${d}`;
  const backupPath = `_backups/${dateString}`;

  backup({
    uri: String(process.env.MONGO_URI), // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
    root: `${__dirname}/${backupPath}`,
    callback: (cb) => {
      if (cb) {
        console.log('Mongo Database BACKUP - cb:', cb);
      } else {
        console.log(`Mongo Database BACKUP ${backupPath} success :-)`);
      }
    }
  });
} else {
  console.log('BACKUP => process.env.MONGO_URI not found!');
}