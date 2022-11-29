import {hashPassword} from "../../../helpers/auth-utils";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

async function handler(req, res) {

    if (req.method === 'POST') {

        const {timeIn, timeOut, siteId, hTimeIn, hTimeOut} = req.body;

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

            const selectedSite = await db.collection('sites').findOne({_id: ObjectId(siteId)});

            if (!selectedSite) {
                res.status(422).json({message: 'Site not found!'});
                await client.close();
                return;
            }

            const result = await db.collection("shifts").insertOne({
                timeIn, timeOut, site: {
                    _id: selectedSite._id,
                    siteName:selectedSite.siteName
                }, hTimeIn, hTimeOut
            });

            if (!result) {
                throw new Error('There was an error adding shift');
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