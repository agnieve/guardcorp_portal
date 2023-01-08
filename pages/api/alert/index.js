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
                foreignField: 'eventId',
                as: 'events',
                pipeline: [
                    {
                        "$limit": 1
                    }
                ]
            },


        },
            {
                $unwind: {
                    path: "$events",
                }
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "objectId(events.site.clientId)",
                    foreignField: "ObjectId(_id)",
                    as: "client",
                    pipeline: [
                        {
                            "$limit": 1
                        }
                    ]
                }
            },

            {
                $unwind: {
                    path: "$client",
                }
            },
            {"$sort": {"_id": -1}},


        ]).toArray();

        res.status(200).json(document);

    } catch (error) {
        res.status(500).json({message: error.message});
        return;
    }
}
