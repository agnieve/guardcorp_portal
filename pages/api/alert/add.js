import {connectDatabase} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";
import sendMail from "../../../helpers/mail";
import {ObjectId} from "mongodb";

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

            const event = await db.collection("events").findOne({
                _id: ObjectId(eventId)
            });

            const site = await db.collection("sites").findOne({
                _id: ObjectId(event.site._id)
            });

            const client = await db.collection("clients").findOne({
                _id: ObjectId(site.clientId)
            });

            const result = await db.collection("alert").insertOne({
                eventId, dateTime, status
            });

            const sentEmail = await sendMail(
                client.email,
                "GuardCorp - Alert",
                "alert-email.html",
                { data: "test" }
            );

            if (!result) {
                throw new Error('There was an error adding alert');
            }

            res.status(201).json({result: result, emailSent: sentEmail});
            await client.close();

        } catch (error) {
            res.status(500).json({message: error});
            return;
        }

    }
}

export default handler;