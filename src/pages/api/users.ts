import { SignUp } from "@/services/auth/services";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        await SignUp(req.body, (status: boolean) => {
            if (status) {
                res.status(200).json({ success: true, message: "success" });
            } else {
                res.status(400).json({ success: false, message: "email already exist" });
            }
        });
    } else {
        res.status(405).json({ success: false, message: "method not allowed" });
    }
}
