import jwt from "jsonwebtoken";
import {downloadDocument} from "../../helpers/print";
import sendMail from "../../helpers/mailReport";


export default async function handler(req, res) {


  const fileLink = await downloadDocument();
  const html = '<a href="'+fileLink+'" download="test.pdf">Download PDF</a>';

  const sentEmail = await sendMail(
      'agnieve70@gmail.com',
      "GuardCorp - Report",
      html
  );
  return res.send(fileLink)
}
