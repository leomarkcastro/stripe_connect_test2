// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { parseStripeEvent } from "@/lib/stripe/webhook";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  const body = await buffer(req);
  // console.log(body);
  const signature = req.headers["stripe-signature"] || "";

  const event = await parseStripeEvent(body, signature as string);

  res.status(200).json(JSON.parse(JSON.stringify(event)) || {});
}
