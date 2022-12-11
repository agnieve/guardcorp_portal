import jwt from "jsonwebtoken";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";
import {ObjectId} from "mongodb";


export default async function handler(req, res) {

    let client;

    const {eventId} = req.query;

    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(500).json({ message: "Connecting to the database failed" });
        return;
    }

    try{
        const secret = process.env.NEXTAUTH_SECRET;
        const token = req.headers.authorization.split(' ')[1];

        const payload = jwt.verify(token, secret);

        if(!payload){
            throw new Error('Invalid Token');
        }

        const db = client.db();

        const eventCollection = db.collection("events");
        const event = await eventCollection.findOne({
            _id: ObjectId(eventId),
        });

        const incidents = await db.collection('incidents').find(
            {'eventId': eventId}
        ).toArray();

        const inspections = await db.collection('inspections').find(
            {'eventId': eventId}
        ).toArray();

        const patrol = await db.collection('patrol').find(
            {'eventId': eventId}
        ).toArray();

        res.status(200).json({
            event: event,
            incidents: incidents,
            inspections: inspections,
            patrol: patrol
        });

    }catch (error){
        res.status(500).json({ message: error});
        return;
    }
}
