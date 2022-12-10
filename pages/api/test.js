import {connectDatabase, getAllDocuments} from "../../helpers/db-util";

async function handler(req, res) {

    if (req.method === 'POST') {

        let client;
        let db;

        try {
            client = await connectDatabase();
            db = client.db();
        } catch (error) {
            res.status(500).json({message: "Connecting to the database failed"});
            return;
        }

        try {

            const result = await db.collection("test").insertOne(
                {
               status: 'this is test'
            });

            if (!result) {
                throw new Error('There was an error adding event');
            }

            res.status(201).json(result);
            await client.close();

        } catch (error) {
            res.status(500).json({message: error.message});
            return;
        }

    }
}

export default handler;