import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name, weddingDate, groomName, brideName } = await req.json();

    // Validate input
    if (!email || !name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "onboarding@resend.dev";

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "RESEND_API_KEY is not configured for this edge function.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Generate email HTML
    const emailHtml = generateWeddingInvitationEmail(name, groomName, brideName, weddingDate);

    // Send email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `Rogimer & Alyssa Wedding <${fromEmail}>`,
        to: email,
        subject: `You're Invited to the Wedding of Rogimer & Alyssa Camille`,
        html: emailHtml,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to send email (${response.status}): ${responseText}`);
    }

    const result = JSON.parse(responseText);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation sent successfully",
        emailId: result.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-wedding-invitation:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Email template function
function generateWeddingInvitationEmail(
  name: string,
  groomName: string,
  brideName: string,
  weddingDate: string
): string {
  return \`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Wedding Invitation</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1f2d4c;
          background: linear-gradient(135deg, #f0f4f8 0%, #e8ecf1 100%);
          padding: 20px;
        }

        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(107, 139, 184, 0.2);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(107, 139, 184, 0.15);
        }

        .email-header {
          background: linear-gradient(135deg, #6B8BB8 0%, #7A9BC4 50%, #8BA7CE 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .email-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          filter: blur(40px);
        }

        .email-header::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -5%;
          width: 250px;
          height: 250px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          filter: blur(35px);
        }

        .header-content {
          position: relative;
          z-index: 1;
          color: white;
        }

        .header-title {
          font-size: 32px;
          font-weight: 300;
          margin-bottom: 8px;
          letter-spacing: 1px;
          font-family: 'Cormorant Garamond', serif;
        }

        .header-subtitle {
          font-size: 13px;
          opacity: 0.95;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 500;
        }

        .heart-divider {
          margin: 16px 0 0 0;
          font-size: 18px;
          opacity: 0.9;
        }

        .email-body {
          padding: 40px 30px;
        }

        .greeting {
          font-size: 16px;
          margin-bottom: 20px;
          color: #2d3f5f;
        }

        .greeting strong {
          color: #6B8BB8;
          font-weight: 600;
        }

        .invitation-text {
          margin: 24px 0;
          line-height: 1.8;
          color: #3d4f63;
          font-size: 14px;
        }

        .couple-names {
          margin: 24px 0;
          padding: 16px;
          background: linear-gradient(135deg, rgba(107, 139, 184, 0.08) 0%, rgba(168, 184, 216, 0.08) 100%);
          border-radius: 12px;
          border-left: 4px solid #6B8BB8;
          text-align: center;
        }

        .couple-names .name {
          font-size: 18px;
          font-weight: 600;
          color: #2d3f5f;
          font-family: 'Cormorant Garamond', serif;
        }

        .couple-names .ampersand {
          color: #A8B8D8;
          font-size: 20px;
          font-weight: 300;
          margin: 0 8px;
        }

        .event-details {
          margin: 32px 0;
          padding: 24px;
          background: linear-gradient(135deg, #f5f8fb 0%, #eef2f7 100%);
          border-radius: 12px;
          border: 1px solid rgba(107, 139, 184, 0.15);
        }

        .event-details h3 {
          font-size: 14px;
          font-weight: 600;
          color: #6B8BB8;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .detail-row {
          margin: 12px 0;
          font-size: 14px;
          color: #3d4f63;
        }

        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #6B8BB8 0%, #7A9BC4 100%);
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          margin: 24px 0;
          box-shadow: 0 4px 15px rgba(107, 139, 184, 0.25);
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(107, 139, 184, 0.3), transparent);
          margin: 32px 0;
        }

        .closing-text {
          font-size: 14px;
          color: #3d4f63;
          line-height: 1.8;
          margin: 20px 0;
        }

        .signature {
          font-size: 16px;
          font-weight: 600;
          color: #2d3f5f;
          margin-top: 24px;
          font-family: 'Cormorant Garamond', serif;
        }

        .signature-subtitle {
          font-size: 12px;
          color: #6B8BB8;
          margin-top: 4px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .email-footer {
          background: linear-gradient(135deg, rgba(107, 139, 184, 0.05) 0%, rgba(168, 184, 216, 0.05) 100%);
          padding: 24px 30px;
          text-align: center;
          border-top: 1px solid rgba(107, 139, 184, 0.1);
        }

        .footer-text {
          font-size: 12px;
          color: #6B7C9D;
          margin: 8px 0;
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .email-container {
            border-radius: 8px;
          }

          .email-header {
            padding: 30px 20px;
          }

          .header-title {
            font-size: 24px;
          }

          .email-body,
          .email-footer {
            padding: 24px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="header-content">
            <div class="header-title">You're Invited</div>
            <div class="heart-divider">💕</div>
            <div class="header-subtitle">Join us for a celebration of love</div>
          </div>
        </div>

        <div class="email-body">
          <div class="greeting">Dear <strong>\${name}</strong>,</div>

          <p class="invitation-text">
            With heartfelt joy and gratitude, we cordially invite you to witness and celebrate the sacred union of
          </p>

          <div class="couple-names">
            <span class="name">\${groomName}</span>
            <span class="ampersand">&</span>
            <span class="name">\${brideName}</span>
          </div>

          <p class="invitation-text">
            as they exchange vows and begin their journey together. Your presence would mean the world to us as we
            celebrate this beautiful milestone with loved ones and cherished friends.
          </p>

          <div class="event-details">
            <h3>📅 Wedding Details</h3>
            <div class="detail-row">
              <strong>📆 \${weddingDate}</strong> at 4:00 PM
            </div>
            <div class="detail-row">
              <strong>📍 Location details will be shared shortly</strong>
            </div>
          </div>

          <p class="invitation-text">
            We look forward to celebrating this special day with you. Please visit our wedding website to RSVP and
            share your meal preferences.
          </p>

          <div style="text-align: center;">
            <a href="https://rogie-alyssa.wedding" class="cta-button">
              RSVP & View Details
            </a>
          </div>

          <div class="divider"></div>

          <p class="closing-text">
            Thank you for being part of our lives and for the love and support you've shown us. We cannot wait to
            celebrate with you!
          </p>

          <div class="signature">
            With love,
            <div class="signature-subtitle">\${groomName} & \${brideName}</div>
          </div>
        </div>

        <div class="email-footer">
          <div class="footer-text">Wedding Date: \${weddingDate}</div>
          <div class="footer-text">
            This is an automated invitation. Please do not reply to this email.
          </div>
        </div>
      </div>
    </body>
    </html>
  \`;
}
