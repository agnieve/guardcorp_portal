import jwt from "jsonwebtoken";
import {connectDatabase} from "../../../helpers/db-util";
import {ObjectId} from "mongodb";


export default async function handler(req, res) {

    let client;

    const {id} = req.query;

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
        const documents = await db.collection('sites').deleteOne({
            _id: ObjectId(id)
        });

        res.status(200).json(documents);

    } catch (error) {
        res.status(500).json({message: error.message});
        return;
    }
}
