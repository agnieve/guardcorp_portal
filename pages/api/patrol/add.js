import {hashPassword} from "../../../helpers/auth-utils";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";

async function handler(req, res) {

    if (req.method === 'POST') {

        const {dateTime, eventId, status} = req.body;

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
            const secret = process.env.NEXTAUTH_SECRET;
            const token = req.headers.authorization.split(' ')[1];

            const payload = jwt.verify(token, secret);

            if (!payload) {
                throw new Error('Invalid Token');
            }

            const result = await db.collection("patrol").insertOne({
                eventId, dateTime, status
            });

            if (!result) {
                throw new Error('There was an error adding patrol');
            }

            res.status(201).json(result);
            await client.close();

        } catch (error) {
            res.status(500).json({message: error});
            return;
        }

    }
}

export default handler;