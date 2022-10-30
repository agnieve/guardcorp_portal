const { MongoClient } = require("mongodb");

export async function connectDatabase() {
  // const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.h7lt8.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
  let connectionString;
  if(process.env.env_type === 'local'){
    connectionString = `mongodb://127.0.0.1:27017/${process.env.mongodb_database}`;
  }
  else{
    connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.dny3iv1.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`
  }
  const client = await MongoClient.connect(connectionString);
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function getAllDocuments(client, collection, sort) {
  const db = client.db();
  const documents = await db.collection(collection).find().sort(sort).toArray();

  return documents;
}
