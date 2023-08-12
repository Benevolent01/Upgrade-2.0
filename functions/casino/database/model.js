let { MongoClient, ServerApiVersion } = require("mongodb");
let { dbName, collName } = require("../config");

let uri = process.env.MONGODB_CRED;

let client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let currentDB = dbName;
let collectionName = collName;

async function handleCollection() {
  try {
    let collectionExists = (
      await client.db(currentDB).listCollections().toArray()
    ).some((doc) => doc.name === collectionName);

    if (collectionExists) {
      console.log("Collection already exists, skipping..");
      return;
    }

    let db2 = client.db(currentDB);

    // if additionalProperties: false is passed, add _id to properties & bson aliases

    await db2.createCollection(collectionName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          title: "Data for the casino",
          required: ["_id", "name", "money", "isAdmin", "dateRegistered"],
          properties: {
            _id: { bsonType: "objectId" },
            name: { bsonType: "string" },
            money: { bsonType: "long" },
            isAdmin: { bsonType: "bool" },
            dateRegistered: { bsonType: "string" },
          },
          additionalProperties: false,
        },
      },
    });

    console.log("Collection successfully created!");
  } catch (e) {
    console.log("An error occured initializing the collection..");
  }
}

module.exports = handleCollection;
