import {hashPassword} from "../../../helpers/auth-utils";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";

async function handler(req, res) {

    if (req.method === 'POST') {
        const {email, password, firstName, lastName, mobilePhone, company, licenseNumber, profilePicture, role} = req.body;

        if (!email || !email.includes('@') || !password || password.trim().length < 7) {
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

            const existingUser = await db.collection('users').findOne({email: email});

            if (existingUser) {
                res.status(422).json({message: 'User exists already!'});
                await client.close();
                return;
            }

            const hashedPassword = await hashPassword(password);

            const result = await db.collection("users").insertOne({
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                fullName: `${firstName} ${lastName}`,
                mobilePhone: mobilePhone,
                company: 1,
                licenseNumber: licenseNumber,
                profilePicture:profilePicture,
                role: role
            });

            if (!result) {
                throw new Error('There was an error adding user');
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