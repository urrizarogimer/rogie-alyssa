// Email clients render fonts inconsistently: Apple Mail loads web fonts, while Gmail and
// Outlook ignore them and fall back to whatever the device has. The decorative lines are
// therefore pre-rendered images (public/images/email), and all live text uses fonts that
// are installed everywhere.
const EMAIL_ASSETS = "https://rogiealyssawedding.vercel.app/images/email";
const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "Arial, Helvetica, sans-serif";

function emailImage(file: string, width: number, height: number, alt: string, altStyle: string): string {
  return `<img src="${EMAIL_ASSETS}/${file}" width="${width}" height="${height}" alt="${alt}" style="display:block;margin:0 auto;border:0;outline:none;text-decoration:none;max-width:100%;height:auto;${altStyle}">`;
}

export function generateWeddingInvitationEmail(
  name: string,
  groomName: string,
  brideName: string,
  weddingDate: string
): string {
  const petal = (size: number, color: string) =>
    `<svg width="${size}" height="${size * 1.3}" viewBox="0 0 20 26" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0C10 0 20 8 20 16C20 21.5 15.5 26 10 26C4.5 26 0 21.5 0 16C0 8 10 0 10 0Z" fill="${color}"/>
    </svg>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">


<style>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family:${SERIF};
  background: linear-gradient(180deg, #d8e6f1 0%, #eef5fb 55%, #f9fcff 100%);
  padding:28px 18px;
  color:#314860;
}

.email-container{
  position:relative;
  max-width:700px;
  margin:auto;
  background:#ebf4fc;
  border-radius:36px;
  overflow:hidden;
  border:1px solid rgba(123,156,185,0.28);
  box-shadow:0 24px 60px rgba(74,110,147,0.12);
}

/* STATIC PETALS */

.petal{
  position:absolute;
  opacity:.45;
  z-index:1;
}

/* HEADER */

.email-header{
  position:relative;
  overflow:hidden;
  text-align:center;

  padding:78px 30px 56px;

  background: linear-gradient(180deg, #d7e5f2 0%, #edf5fb 100%);
}

.email-header:before{
  content:"";
  position:absolute;
  left:50%;
  top:-140px;
  transform:translateX(-50%);

  width:520px;
  height:520px;

  background: radial-gradient(circle, rgba(255,255,255,0.88), transparent 72%);
}

.email-header:after{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
}

.hero-image-wrap{
  position:relative;
  margin:0 auto 24px;
  max-width:640px;
  border-radius:28px;
  overflow:hidden;
  box-shadow:0 18px 40px rgba(75,112,144,0.08);
}

.hero-image{
  width:100%;
  display:block;
  height:auto;
  object-fit:cover;
}

.header-content{
  position:relative;
  z-index:5;
}

.corner{
  position:absolute;
  font-size:120px;
  opacity:.18;
  color:#7aa9dc;
}

.corner-left{
  top:-20px;
  left:-15px;
}

.corner-right{
  top:-20px;
  right:-15px;
}

.monogram{
  font-family:${SERIF};
  font-size:88px;
  font-weight:400;
  color:#8ea9cc;
  line-height:1;
  letter-spacing:2px;
}

.monogram .heart{
  color:#aab6c5;
  font-size:64px;
  margin:0 10px;
}

.header-subtitle{
  margin-top:18px;
  font-family:${SANS};
  font-size:11px;
  letter-spacing:5px;
  text-transform:uppercase;
  color:#7f8895;
}

.header-title{
  margin-top:22px;
  font-family:${SERIF};
  font-size:58px;
  font-weight:600;
  letter-spacing:1px;
  color:#274464;
  text-transform:uppercase;
}

.header-script{
  margin-top:10px;
  font-family:${SERIF};
  font-size:28px;
  font-style:italic;
  color:#5d728e;
}

.mini-divider{
  margin-top:20px;
  color:#8ea9cc;
  letter-spacing:4px;
}

/* BODY */

.email-body{
  position:relative;
  z-index:5;
  padding:45px;
}

.greeting{
  font-size:22px;
  color:#24466f;
  margin-bottom:20px;
}

.greeting strong{
  font-style:italic;
}

.invitation-text{
  font-family:${SANS};
  color:#5c6f86;
  font-size:15px;
  line-height:1.9;
  margin:20px 0;
}

/* COUPLE CARD */

.couple-names{
  position:relative;
  margin:40px 0;
  padding:45px 30px;
  border-radius:20px;
  background:
    linear-gradient(
      180deg,
      #f8fbff,
      #edf5fc
    );

  border:1px solid #e1ebf5;
  box-shadow:
    0 8px 20px rgba(126,167,215,.08);

  text-align:center;
}

.name{
  display:block;
  font-size:48px;
  color:#7297c5;
  font-style:normal;
}

.ampersand{
  display:block;
  margin:14px 0;
  font-size:26px;
  font-style:italic;
  color:#9099a6;
}

/* DETAILS */

.event-details{
  background:#f7faff;
  border:1px solid #e3ebf5;
  border-radius:18px;
  padding:30px;
  margin:40px 0;
  box-shadow:
    0 5px 15px rgba(126,167,215,.05);
}

.details-grid{
  display:flex;
  justify-content:space-around;
  align-items:center;
  text-align:center;
}

.details-item{
  flex:1;
}

.details-separator{
  width:1px;
  height:60px;
  background:#dfe7f2;
}

.details-icon{
  font-size:24px;
  margin-bottom:10px;
}

.details-value{
  color:#6f88a9;
  font-size:16px;
}

/* BUTTON */

.cta-button{
  display:inline-block;
  padding:16px 46px;

  background: linear-gradient(180deg, #2f4f83, #1f3b64);
  border: 1px solid rgba(255,255,255,0.32);

  color:#ffffff;
  text-decoration:none;
  border-radius:999px;

  font-family:${SANS};
  font-size:13px;
  font-weight:700;
  letter-spacing:0.2em;
  text-transform:uppercase;
  text-shadow: 0 1px 2px rgba(0,0,0,0.18);

  box-shadow: 0 14px 30px rgba(18,42,82,.26);
}

.floating-petal{
  position:absolute;
  width:22px;
  height:30px;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #dfeefb
    );

  border-radius:
    60% 40%
    70% 30% /
    40% 60%
    40% 60%;

  opacity:.75;

  box-shadow:
    0 4px 10px rgba(0,0,0,.06);

  z-index:2;
}

.p1{top:90px;left:25px;transform:rotate(25deg);}
.p2{top:150px;right:30px;transform:rotate(-20deg);}
.p3{top:430px;left:30px;transform:rotate(40deg);}
.p4{top:620px;right:40px;transform:rotate(-35deg);}
.p5{bottom:320px;left:60px;transform:rotate(30deg);}
.p6{bottom:220px;right:50px;transform:rotate(-40deg);}
.p7{bottom:100px;left:30px;transform:rotate(50deg);}
.p8{bottom:80px;right:40px;transform:rotate(-60deg);}

/* CLOSING */

.divider{
  height:1px;
  background:#dbeaf7;
  margin:40px 0 30px;
}

.closing-text{
  text-align:center;

  font-family:${SANS};

  color:#5c6f86;
  line-height:1.9;
}

.signature{
  margin-top:25px;

  text-align:center;

  font-family:${SERIF};
  font-size:34px;
  font-style:normal;

  color:#2f67ae;
}

.signature-subtitle{
  margin-top:12px;

  font-family:${SANS};

  color:#5f88b6;

  font-size:11px;
  letter-spacing:3px;
  text-transform:uppercase;
}

/* FOOTER */

.email-footer{
  position:relative;

  padding:30px;

  text-align:center;

  background:#f6fbff;
  border-top:1px solid #dbeaf7;
}

.footer-text{
  font-family:${SANS};
  font-size:11px;
  color:#7b8fa6;
  line-height:1.8;
}

@media(max-width:600px){

  .email-body{
    padding:25px;
  }

  .header-title{
    font-size:48px;
  }

  .monogram{
    font-size:62px;
  }

  .name{
    font-size:30px;
  }
}
</style>
</head>

<body>



<div class="email-container" style="font-family:${SERIF};">

  <!-- STATIC PETALS -->

  <div class="petal" style="top:80px;left:20px;transform:rotate(25deg)">
    ${petal(18,"#bdd7f3")}
  </div>

  <div class="petal" style="top:160px;right:25px;transform:rotate(-35deg)">
    ${petal(20,"#d2e4f7")}
  </div>

  <div class="petal" style="top:420px;left:35px;transform:rotate(50deg)">
    ${petal(16,"#bdd7f3")}
  </div>

  <div class="petal" style="top:620px;right:60px;transform:rotate(-15deg)">
    ${petal(22,"#d2e4f7")}
  </div>

  <div class="petal" style="bottom:200px;left:80px;transform:rotate(30deg)">
    ${petal(20,"#c2d7ee")}
  </div>

  <div class="petal" style="bottom:80px;right:50px;transform:rotate(-45deg)">
    ${petal(24,"#d2e4f7")}
  </div>

  <!-- HEADER -->

  <div class="email-header">


    <div class="header-content">

  <div class="monogram">
    ${emailImage("invite-monogram.png", 221, 75, "R ♡ A", "font-family:" + SERIF + ";font-size:56px;color:#8ea9cc;text-align:center;")}
  </div>

  <div class="header-subtitle">
    TOGETHER WITH JOY
  </div>

  <div class="header-title">
    ${emailImage("invite-youre-invited.png", 469, 51, "YOU'RE INVITED", "font-family:" + SERIF + ";font-size:40px;font-weight:bold;color:#274464;text-align:center;")}
  </div>

  <div class="header-script">
    ${emailImage("invite-to-our-wedding.png", 133, 39, "to our wedding", "font-family:" + SERIF + ";font-size:22px;font-style:italic;color:#5d728e;text-align:center;")}
  </div>

  <div class="mini-divider">
    ─── ♥ ───
  </div>
</div>

  <!-- BODY -->

  <div class="email-body">

    <div class="greeting">
      Dear <strong>${name}</strong>,
    </div>

    <p class="invitation-text">
      With heartfelt joy and gratitude, we invite you
      to witness and celebrate the beginning of our forever.
    </p>


    <p class="invitation-text">
      As we exchange vows and begin our new journey together,
      your presence would mean the world to us.
      We would be honored to celebrate this special day
      surrounded by the people we cherish most.
    </p>

    <div class="event-details">

      <h3>
        Wedding Details
      </h3>

      <div class="detail-row">
        ${weddingDate} • 3:30 PM
      </div>

      <div class="detail-row muted">
        Venue: Spacio Caliraya, Lumban, Laguna
      </div>

    </div>

    <p class="invitation-text" style="text-align:center;">
      Please visit our wedding website to RSVP
      and confirm your attendance.
    </p>

    <div class="cta-wrap">

      <center><a
        href="https://rogiealyssawedding.vercel.app/"
        class="cta-button">
        RSVP & VIEW DETAILS
      </a></center>

    </div>

    <div class="divider"></div>

    <p class="closing-text">
      Thank you for being part of our lives and
      for the love you've shown us.<br>
      We cannot wait to celebrate this unforgettable
      moment with you.
    </p>

    <div class="signature">

      ${emailImage("invite-with-love.png", 192, 51, "With Love, ♡", "font-family:" + SERIF + ";font-size:26px;font-style:italic;color:#2f67ae;text-align:center;")}

      <div class="signature-subtitle">
        ${groomName} &amp; ${brideName}
      </div>

    </div>

  </div>

  <!-- FOOTER -->

  <div class="email-footer">

    <div class="footer-text">
      Wedding Date • ${weddingDate}
    </div>

    <div class="footer-text">
      This is an automated invitation — please don't reply
      to this email.<br>
      For inquiries, please visit our wedding website.
    </div>

  </div>

</div>

</body>
</html>
`;
}

export function generateRsvpConfirmationEmail(
  name: string,
  groomName: string,
  brideName: string,
  weddingDate: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:${SERIF};background: linear-gradient(180deg, #eef6fb 0%, #f9f8ff 100%);padding:28px 18px;color:#324b68;}
.container{max-width:700px;margin:0 auto;background:#ffffff;border-radius:30px;overflow:hidden;border:1px solid rgba(139,166,201,0.24);box-shadow:0 24px 60px rgba(88,128,166,0.12);}
.header{padding:60px 30px 40px;text-align:center;background:linear-gradient(180deg, #dcedf9 0%, #f3f8ff 100%);position:relative;}
.header:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent);}
.monogram{font-family:${SERIF};font-size:75px;color:#6085b6;letter-spacing:1px;position:relative;z-index:1;}
.monogram .heart{color:#a1b6d1;font-size:48px;letter-spacing:0;}
.subtitle{position:relative;z-index:1;margin-top:12px;font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#6f839b;}
.title{position:relative;z-index:1;margin-top:22px;font-family:${SERIF};font-size:46px;color:#2d567d;}
.body{padding:40px 36px 50px;position:relative;z-index:1;}
.greeting{font-size:22px;color:#2c4e71;margin-bottom:18px;}
.text{font-family:${SANS};color:#556d87;font-size:15px;line-height:1.9;margin-bottom:18px;}
.highlight{font-weight:600;color:#304a6a;}
.details{background:#f6fbff;border:1px solid #dbe7f3;border-radius:20px;padding:28px;margin:30px 0;}
.details h3{margin-bottom:16px;font-size:18px;color:#446085;}
.details p{margin:8px 0;color:#5c7189;font-size:15px;}
.footer{padding:26px 36px 40px;background:#f7fbff;border-top:1px solid #e1ebf5;text-align:center;color:#6e8298;font-size:13px;line-height:1.8;}
.signature{margin-top:28px;font-family:${SERIF};font-size:34px;color:#3c6c96;}
</style>
</head>
<body>
<div class="container" style="font-family:${SERIF};">
  <div class="header">
    <div class="monogram">${emailImage("rsvp-monogram.png", 166, 65, "R ♡ A", "font-family:" + SERIF + ";font-size:48px;color:#6085b6;text-align:center;")}</div>
    <div class="subtitle">RSVP CONFIRMATION</div>
    <div class="title">${emailImage("rsvp-title-confirmed.png", 367, 68, "Thank you for saying yes", "font-family:" + SERIF + ";font-size:30px;font-style:italic;color:#2d567d;text-align:center;")}</div>
  </div>
  <div class="body">
    <div class="greeting">Dear <strong>${name}</strong>,</div>
    <p class="text">We are delighted to confirm that your RSVP has been received, and we cannot wait to celebrate with you.</p>
    <p class="text">Your response is now recorded, and we are looking forward to seeing you at our wedding on <span class="highlight">${weddingDate}</span>.</p>
    <div class="details">
      <h3>Event Details</h3>
      <p><strong>Couple:</strong> ${groomName} &amp; ${brideName}</p>
      <p><strong>Date:</strong> ${weddingDate}</p>
      <p><strong>Location:</strong> Spacio Caliraya, Lumban, Laguna</p>
    </div>
    <p class="text">If you need to update your RSVP, please visit our wedding website. We appreciate your love and support.</p>
    <div class="signature">${emailImage("rsvp-signature.png", 440, 51, `With love, ${groomName} &amp; ${brideName}`, "font-family:" + SERIF + ";font-size:26px;font-style:italic;color:#3c6c96;text-align:center;")}</div>
  </div>
  <div class="footer">This is an automated confirmation email. Please do not reply to this message.</div>
</div>
</body>
</html>`;
}

export function generateRsvpDeclineEmail(
  name: string,
  groomName: string,
  brideName: string,
  weddingDate: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:${SERIF};background: linear-gradient(180deg, #eef6fb 0%, #f9f8ff 100%);padding:28px 18px;color:#324b68;}
.container{max-width:700px;margin:0 auto;background:#ffffff;border-radius:30px;overflow:hidden;border:1px solid rgba(139,166,201,0.24);box-shadow:0 24px 60px rgba(88,128,166,0.12);}
.header{padding:60px 30px 40px;text-align:center;background:linear-gradient(180deg, #dcedf9 0%, #f3f8ff 100%);position:relative;}
.header:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent);}
.monogram{font-family:${SERIF};font-size:75px;color:#6085b6;letter-spacing:1px;position:relative;z-index:1;}
.monogram .heart{color:#a1b6d1;font-size:48px;letter-spacing:0;}
.subtitle{position:relative;z-index:1;margin-top:12px;font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#6f839b;}
.title{position:relative;z-index:1;margin-top:22px;font-family:${SERIF};font-size:46px;color:#2d567d;}
.body{padding:40px 36px 50px;position:relative;z-index:1;}
.greeting{font-size:22px;color:#2c4e71;margin-bottom:18px;}
.text{font-family:${SANS};color:#556d87;font-size:15px;line-height:1.9;margin-bottom:18px;}
.highlight{font-weight:600;color:#304a6a;}
.details{background:#f6fbff;border:1px solid #dbe7f3;border-radius:20px;padding:28px;margin:30px 0;}
.details h3{margin-bottom:16px;font-size:18px;color:#446085;}
.details p{margin:8px 0;color:#5c7189;font-size:15px;}
.footer{padding:26px 36px 40px;background:#f7fbff;border-top:1px solid #e1ebf5;text-align:center;color:#6e8298;font-size:13px;line-height:1.8;}
.signature{margin-top:28px;font-family:${SERIF};font-size:34px;color:#3c6c96;}
</style>
</head>
<body>
<div class="container" style="font-family:${SERIF};">
  <div class="header">
    <div class="monogram">${emailImage("rsvp-monogram.png", 166, 65, "R ♡ A", "font-family:" + SERIF + ";font-size:48px;color:#6085b6;text-align:center;")}</div>
    <div class="subtitle">RSVP RECEIVED</div>
    <div class="title">${emailImage("rsvp-title-declined.png", 427, 68, "Thank you for letting us know", "font-family:" + SERIF + ";font-size:30px;font-style:italic;color:#2d567d;text-align:center;")}</div>
  </div>
  <div class="body">
    <div class="greeting">Dear <strong>${name}</strong>,</div>
    <p class="text">We have received your RSVP and appreciate you letting us know that you will not be able to join our wedding celebration.</p>
    <p class="text">We will miss you on <span class="highlight">${weddingDate}</span>, and we are grateful for your love and support regardless.</p>
    <div class="details">
      <h3>Event Details</h3>
      <p><strong>Couple:</strong> ${groomName} &amp; ${brideName}</p>
      <p><strong>Date:</strong> ${weddingDate}</p>
      <p><strong>Location:</strong> Spacio Caliraya, Lumban, Laguna</p>
    </div>
    <p class="text">If your plans change, feel free to update your RSVP on our wedding website. Thank you again for letting us know.</p>
    <div class="signature">${emailImage("rsvp-signature.png", 440, 51, `With love, ${groomName} &amp; ${brideName}`, "font-family:" + SERIF + ";font-size:26px;font-style:italic;color:#3c6c96;text-align:center;")}</div>
  </div>
  <div class="footer">This is an automated acknowledgement email. Please do not reply to this message.</div>
</div>
</body>
</html>`;
}
