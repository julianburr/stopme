import { NextApiRequest } from "next";
import createClient from "twilio";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const client = createClient(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const body = await req.json();
    let number = body?.number?.startsWith("0")
      ? `+61${body?.number.substring(1)}`
      : body?.number;

    const message = await client.messages.create({
      from: "+12015966972",
      to: number,
      body: `Your verification code is 123456.\n\n@app.stopme.io #123456`,
    });

    return NextResponse.json({ message });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message });
  }
}
