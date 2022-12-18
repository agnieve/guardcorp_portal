import jwt from "jsonwebtoken";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";
import {ObjectId} from "mongodb";


export default async function handler(req, res) {

    let client;

    try {
        client = await connectDatabase();
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

        const db = client.db();
        const alertCollection = db.collection("alert");

        const document = await alertCollection.aggregate([{
            $lookup: {
                from: 'events',
                localField: 'objectId(eventId)',
                foreignField: 'c',
                let: {
                    eventId: "eventId",
                    event: "$_id"
                },
                as: 'eventDetails',
                pipeline: [
                    {
                        "$sort": {_id: 1},
                        "$limit": 1
                    }
                ]
            },
        }]).toArray();

        res.status(200).json(document);

    } catch (error) {
        res.status(500).json({message: error.message});
        return;
    }
}
