import jwt from "jsonwebtoken";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";


export default async function handler(req, res) {

    let client;

    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(500).json({message: "Connecting to the database failed"});
        return;
    }

    try {
        // const secret = process.env.NEXTAUTH_SECRET;
        // const token = req.headers.authorization.split(' ')[1];
        //
        // const payload = jwt.verify(token, secret);
        //
        // if (!payload) {
        //     throw new Error('Invalid Token');
        // }

        const db = client.db();
        const documents1 = await db.collection('events').aggregate([{
            $group: {
                _id:  {
                    user_id: "$user._id",
                    date: "$start"
                }
            }
        }]).toArray();

        const documents = await db.collection('users').aggregate([{
            $group: {
                _id:  "$user._id"
            }
        }]).toArray();

        res.status(200).json(documents1);

    } catch (error) {
        res.status(500).json({message: error.message});
        return;
    }
}
