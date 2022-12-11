import {hashPassword} from "../../../helpers/auth-utils";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";

async function handler(req, res) {

    if (req.method === 'POST') {

        const {user, picture, site, date, action} = req.body;

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
            const data = {
                user: user,
                picture: picture,
                site: site,
                start: date,
                end:null,
                action: action
            };

            const result = await db.collection("events").insertOne(data);

            if (!result) {
                throw new Error('There was an error adding event');
            }

            res.status(201).json({...result, ...data});
            await client.close();

        } catch (error) {
            res.status(500).json({message: error.message});
            return;
        }

    }
}

export default handler;