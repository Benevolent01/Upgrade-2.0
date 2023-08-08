let { MongoClient, ServerApiVersion } = require("mongodb");

let uri = process.env.MONGODB_CRED;

let client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
  } catch (e) {
    console.log(e);
  }
}

module.exports = connectToMongoDB;

/*
.insertMany([
    {name: "Sandy", gpa: 4.0, city: "Thessaloniki", isStudent: false},
    {name: "Jim", gpa: 4.5, city: "Athens", isStudent: true},
    {name: "John", gpa: 3.2, city: "Chania", isStudent: false},
    {name: "Ryan", gpa: 2.5, city: "Alexandroupoli", isStudent: false},
    {name: "William", gpa: 3.1, city: "Ioannina", isStudent: true},
  ])
*/
