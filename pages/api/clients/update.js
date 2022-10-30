import {hashPassword} from "../../../helpers/auth-utils";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

async function handler(req, res) {

    if (req.method === 'PUT') {
        const {email, name, address, mobilePhone} = req.body;
        const { id } = req.query;

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
                throw Error('Invalid Token');
            }

            const result = await db.collection("clients").updateOne({
                _id: ObjectId(id)
            }, {
                $set: {
                    email : email,
                    name : name,
                    address : address,
                    mobilePhone : mobilePhone,
                }
            });

            console.log(result);

            if(result.matchedCount === 0) throw Error('No Client');
            if(result.modifiedCount === 0) throw Error('No need to modify');

            res.status(200);
            res.json(result);

        }catch(e){
            console.log(e);
            res.status(500).json({message: e.message});
            return;
        }
    }
}

export default handler;