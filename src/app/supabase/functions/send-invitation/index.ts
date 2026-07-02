// @ts-ignore
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// @ts-ignore
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(
  // @ts-ignore
  Deno.env.get("RESEND_API_KEY")
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or http://localhost:5173 for stricter
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // your logic here
    
    const { email, name } = await req.json();

    const invitationUrl = "https://rogiealyssawedding.vercel.app/";

    const { data, error } = await resend.emails.send({
      from: "Wedding Invitation <onboarding@resend.dev>",
      to: email,
      subject: "💌 You're Invited to Our Wedding Celebration",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="
          margin:0;
          padding:0;
          background:#f8f6f3;
          font-family: Georgia, serif;
          color:#444444;
        ">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:40px 20px;">

                <table width="600" cellpadding="0" cellspacing="0" style="
                  max-width:600px;
                  background:#ffffff;
                  border-radius:12px;
                  overflow:hidden;
                  box-shadow:0 4px 20px rgba(0,0,0,0.08);
                ">

                  <tr>
                    <td style="
                      padding:50px 40px;
                      text-align:center;
                    ">

                      <p style="
                        font-size:14px;
                        letter-spacing:4px;
                        color:#b18c5b;
                        text-transform:uppercase;
                        margin:0;
                      ">
                        Wedding Invitation
                      </p>

                      <h1 style="
                        font-size:36px;
                        font-weight:normal;
                        margin:20px 0;
                        color:#2d2d2d;
                      ">
                        You're Invited
                      </h1>

                      <p style="
                        font-size:18px;
                        line-height:1.8;
                        margin:30px 0;
                      ">
                        Dear <strong>${name}</strong>,
                      </p>

                      <p style="
                        font-size:16px;
                        line-height:1.8;
                        margin:20px 0;
                      ">
                        Together with our families, we warmly invite you
                        to celebrate one of the most meaningful days of our lives.
                      </p>

                      <p style="
                        font-size:16px;
                        line-height:1.8;
                        margin:20px 0;
                      ">
                        Your presence would mean so much to us as we begin
                        this beautiful journey together.
                      </p>

                      <div style="margin:40px 0;">
                        <a href="${invitationUrl}"
                          style="
                            background:#b18c5b;
                            color:#ffffff;
                            text-decoration:none;
                            padding:16px 36px;
                            border-radius:50px;
                            display:inline-block;
                            font-size:16px;
                            font-weight:bold;
                          ">
                          View Wedding Invitation
                        </a>
                      </div>

                      <p style="
                        font-size:14px;
                        color:#777777;
                        margin-top:40px;
                      ">
                        If the button above doesn't work,
                        please copy and paste this link into your browser:
                      </p>

                      <p style="
                        font-size:14px;
                        word-break:break-all;
                        color:#b18c5b;
                      ">
                        ${"https://rogiealyssawedding.vercel.app/"}
                      </p>

                      <hr style="
                        margin:40px 0;
                        border:none;
                        border-top:1px solid #eeeeee;
                      ">

                      <p style="
                        font-size:15px;
                        color:#666666;
                        margin:0;
                      ">
                        With love and gratitude,
                      </p>

                      <p style="
                        font-size:20px;
                        margin-top:10px;
                        color:#2d2d2d;
                      ">
                        Bride & Groom
                      </p>

                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return new Response(
  JSON.stringify({
    success: true,
    data,
  }),
  {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  }
);
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});