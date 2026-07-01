export function generateWeddingInvitationEmail(name: string, groomName: string, brideName: string, weddingDate: string): string {
  const emailFrom = "Rogimer & Alyssa Camille";

  return `
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

        /* Header with dusty blue gradient */
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

        /* Main content */
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 24px 0;
          padding: 16px;
          background: linear-gradient(135deg, rgba(107, 139, 184, 0.08) 0%, rgba(168, 184, 216, 0.08) 100%);
          border-radius: 12px;
          border-left: 4px solid #6B8BB8;
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
          display: flex;
          align-items: center;
          margin: 12px 0;
          font-size: 14px;
          color: #3d4f63;
        }

        .detail-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          color: #6B8BB8;
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
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(107, 139, 184, 0.25);
        }

        .cta-button:hover {
          background: linear-gradient(135deg, #7A9BC4 0%, #8BA7CE 100%);
          box-shadow: 0 6px 20px rgba(107, 139, 184, 0.35);
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

        /* Footer */
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

        .footer-divider {
          height: 1px;
          background: rgba(107, 139, 184, 0.15);
          margin: 12px 0;
        }

        .social-links {
          margin-top: 12px;
        }

        .social-links a {
          display: inline-block;
          width: 32px;
          height: 32px;
          margin: 0 4px;
          background: linear-gradient(135deg, #6B8BB8, #7A9BC4);
          border-radius: 50%;
          color: white;
          text-align: center;
          line-height: 32px;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: linear-gradient(135deg, #7A9BC4, #8BA7CE);
          transform: translateY(-2px);
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

          .couple-names {
            flex-direction: column;
            gap: 8px;
          }

          .detail-row {
            align-items: flex-start;
          }

          .detail-icon {
            margin-top: 2px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="email-header">
          <div class="header-content">
            <div class="header-title">You're Invited</div>
            <div class="heart-divider">💕</div>
            <div class="header-subtitle">Join us for a celebration of love</div>
          </div>
        </div>

        <!-- Body -->
        <div class="email-body">
          <div class="greeting">Dear <strong>${name}</strong>,</div>

          <p class="invitation-text">
            With heartfelt joy and gratitude, we cordially invite you to witness and celebrate the sacred union of
          </p>

          <div class="couple-names">
            <span class="name">Rogimer</span>
            <span class="ampersand">&</span>
            <span class="name">Alyssa Camille</span>
          </div>

          <p class="invitation-text">
            as they exchange vows and begin their journey together. Your presence would mean the world to us as we
            celebrate this beautiful milestone with loved ones and cherished friends.
          </p>

          <!-- Event Details -->
          <div class="event-details">
            <h3>📅 Wedding Details</h3>
            <div class="detail-row">
              <span class="detail-icon">📆</span>
              <span><strong>Saturday, November 28, 2026</strong> at 4:00 PM</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">📍</span>
              <span>Details will be shared shortly</span>
            </div>
          </div>

          <p class="invitation-text">
            We look forward to celebrating this special day with you. Please visit our wedding website to RSVP and
            share your meal preferences.
          </p>

          <center>
            <a href="https://rogie-alyssa.wedding" class="cta-button">
              RSVP & View Details
            </a>
          </center>

          <div class="divider"></div>

          <p class="closing-text">
            Thank you for being part of our lives and for the love and support you've shown us. We cannot wait to
            celebrate with you!
          </p>

          <div class="signature">
            With love,
            <div class="signature-subtitle">Rogimer & Alyssa Camille</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="email-footer">
          <div class="footer-text">Wedding Date: Saturday, November 28, 2026</div>
          <div class="footer-divider"></div>
          <div class="footer-text">
            This is an automated invitation. Please do not reply to this email.<br />
            For inquiries, please contact us through our wedding website.
          </div>
          <div class="social-links">
            <a href="#" title="Facebook">f</a>
            <a href="#" title="Instagram">📷</a>
            <a href="#" title="Email">✉</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
