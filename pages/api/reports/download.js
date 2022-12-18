import sendMail from "../../../helpers/mailReport";
import {connectDatabase} from "../../../helpers/db-util";
import {ObjectId} from "mongodb";


export default async function handler(req, res) {

    let client;

    const {eventId} = req.query;

    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(500).json({message: "Connecting to the database failed"});
        return;
    }

    try {

        const db = client.db();

        const eventCollection = db.collection("events");
        const event = await eventCollection.findOne({
            _id: ObjectId(eventId),
        });

        const clientCollection = db.collection("clients");
        const clientDb =  await clientCollection.findOne({
            _id: ObjectId(event.site.clientId),
        });

        const html = `<p>
                Hi ${clientDb.contactName}, <br /> <br/>
                Please find attached today’s shift report for ${event.site.siteName}. <br />
                Please contact us with any queries or concerns. <br /> <br /> <br />
                Kind Regards, <br />
                The Guardcorp team<br/> <br />
                
                Please click the link to download report: <a href="https://guardcorp-portal.vercel.app/report/${eventId}">Donwload Report</a>
               
            </p>
             <iframe src="https://guardcorp-portal.vercel.app/report/${eventId}" title="Download Report"
             width="100%" height="300" style="border:1px solid black;"
             ></iframe>`;

        const sentEmail = await sendMail(
            clientDb.email,
            "GuardCorp - Report",
            html
        );

        return res.status(200).json({
            email: sentEmail
        })

    } catch (error) {
        res.status(500).json({message: error.message});
        return;
    }

}
