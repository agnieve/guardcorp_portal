import jwt from "jsonwebtoken";
import sendMail from "../../../helpers/mailReport";


export default async function handler(req, res) {

    const eventId = 123423;
    const html = `<p>
    Hi <Client Contact Name>, <br /> <br/>
    Please find attached today’s shift report for <Client Site Name>. <br />
    Please contact us with any queries or concerns. <br /> <br /> <br />
    Kind Regards, <br />
    The Guardcorp team<br/> <br />
    
    Please click the link to download report: <a href="https://guardcorp-portal.vercel.app/report/${eventId}">Donwload Report</a>
</p>`;

    const sentEmail = await sendMail(
        'agnieve70@gmail.com',
        "GuardCorp - Report",
        html
    );

    return res.status(200).json({
        email: sentEmail
    })
}
