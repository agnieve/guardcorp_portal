import {hashPassword} from "../../../helpers/auth-utils";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";

async function handler(req, res) {

    if (req.method === 'POST') {
        const {email, name, contactName, address, mobilePhone} = req.body;

        if (!email || !email.includes('@')) {
            res.status(422).json({message: 'Invalid Input - password should also be at least 7 characters long.'});
        }

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

            const existingUser = await db.collection('clients').findOne({email: email});

            if (existingUser) {
                res.status(422).json({message: 'Client exists already!'});
                await client.close();
                return;
            }


            const result = await db.collection("clients").insertOne({
                email: email,
                address: address,
                mobilePhone: mobilePhone,
                name: name,
                contactName: contactName,
            });

            if (!result) {
                throw new Error('There was an error adding client');
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