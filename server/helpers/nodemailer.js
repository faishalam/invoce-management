const nodemailer = require("nodemailer");

async function sendEmailCaseOne(email, findCustomerReguler, cc = []) {
  if (!email || email.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beritaacaramanagement@gmail.com",
      pass: "khwe slyw yubj jyfk",
    },
  });

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const now = new Date();
  const periodeText = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  await transporter.sendMail({
    from: '"BA Management KPP" <beritaacaramanagement@gmail.com>',
    to: email,
    cc: cc.length > 0 ? cc.join(", ") : undefined,
    subject: "Reminder End of Period: Pembuatan Berita Acara Backcharge",
    html: `
          <html lang="id">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Email Reminder Backcharge</title>
            </head>
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9fafb;">
              <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
                
                <div style="text-align:center;">
                  <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" 
                     alt="logoKPP" style="max-width:100px; height:auto;"/>
                </div>

                <h2 style="color:#111827; text-align:center;">Reminder End of Period: Pembuatan Berita Acara Backcharge</h2>

                <p style="color:#374151; line-height:1.6;">Dear Rekan-rekan PIC Cost,</p>

                <p style="color:#374151; line-height:1.6;">
                  Sebagai pengingat akhir Cut Off Period, mohon untuk segera melakukan pembuatan dan pengumpulan 
                  <strong>Berita Acara (BA)</strong> atas:
                  <br/>
                 <strong>${findCustomerReguler
                   ?.map((c) => c.name)
                   .join(", ")}</strong> 
periode <strong>${periodeText}</strong>

                </p>

                <p style="color:#374151; line-height:1.6;">Dokumen BA ini menjadi dasar penagihan backcharge oleh Finance, sehingga diharapkan dapat dikirimkan paling lambat N+5 dari cut off pekerjaan.</p>

                  <p style="color:#374151; line-height:1.6;">No BA dan form BA dapat diakses melalui link berikut:</p>
                <div style="text-align:center; margin:20px 0;">
                  <a href="https://ba-management.vercel.app/login"
                     style="display:inline-block; background-color:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">
                    Akses Aplikasi BA DN
                  </a>
                </div>

                <p style="color:#374151; line-height:1.6;">Atas kerja sama dan perhatian rekan-rekan, kami ucapkan terima kasih.</p>

                <br/>

                <p style="color:#374151;">
                  Salam,<br/>
                  <strong>Finance & Tax Departemen</strong><br/>
                  PT. Kalimantan Prima Persada - Site SPRL
                </p>

              </div>
            </body>
          </html>
        `,
  });
}

async function sendEmailCaseTwo(email, findBeritaAcara, cc = []) {
  if (!email || email.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beritaacaramanagement@gmail.com",
      pass: "khwe slyw yubj jyfk",
    },
  });

  // Mapping list nomor BA
  const listBA = findBeritaAcara
    ?.map((item) => `<li>${item.number}</li>`)
    .join("");

  await transporter.sendMail({
    from: '"BA Management KPP" <beritaacaramanagement@gmail.com>',
    to: email,
    cc: cc.length > 0 ? cc.join(", ") : undefined,
    subject: "Kirim BA Full Sign ke Department Finance & Tax",
    html: `
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Reminder BA Full Sign</title>
        </head>
        <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9fafb;">
          <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
            
            <div style="text-align:center;">
              <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" 
                alt="logoKPP" style="max-width:100px; height:auto;"/>
            </div>

            <h2 style="color:#111827; text-align:center;">System Notification</h2>

            <p style="color:#374151; line-height:1.6;">Dear Rekan-rekan PIC Cost,</p>

            <p style="color:#374151; line-height:1.6;">
              Harap segera mengirimkan Berita Acara (BA) Backcharge <strong>Full Sign</strong> ke Departemen Finance & Tax.
            </p>

            <p style="color:#374151; line-height:1.6;">
              Berikut adalah daftar nomor BA yang perlu segera dikirimkan:
            </p>

            <ul style="color:#374151; line-height:1.6; margin-left:20px;">
              ${listBA}
            </ul>

            <p style="color:#374151; line-height:1.6;">
              No BA dan form BA dapat diakses melalui link berikut:
            </p>

            <div style="text-align:center; margin:20px 0;">
              <a href="https://ba-management.vercel.app/login"
                style="display:inline-block; background-color:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">
                Akses Aplikasi BA DN
              </a>
            </div>

            <p style="color:#374151; line-height:1.6;">
              Atas kerja sama dan perhatian rekan-rekan, kami ucapkan terima kasih.
            </p>

            <br/>

            <p style="color:#374151;">
              Salam,<br/>
              <strong>Finance & Tax Departemen</strong><br/>
              PT. Kalimantan Prima Persada - Site SPRL
            </p>

          </div>
        </body>
      </html>
    `,
  });
}

async function sendEmailCaseThree(emailList, cc) {
  if (!emailList || emailList.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beritaacaramanagement@gmail.com",
      pass: "khwe slyw yubj jyfk",
    },
  });

  await transporter.sendMail({
    from: '"BA Management KPP" <beritaacaramanagement@gmail.com>',
    to: email,
    cc: cc.length > 0 ? cc.join(", ") : undefined,
    subject: "Reminder End of Period: Pembuatan Berita Acara Backcharge",
    html: `
          <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Reminder Backcharge</title>
            </head>
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9fafb;">
              <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
                <div style="text-align:center;">
                  <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" alt="logoKPP" style="max-width:100px; height:auto;"/>
                </div>
                <h2 style="color:#111827; text-align:center;">Reminder End of Period: Pembuatan Berita Acara Backcharge</h2>
                <p style="color:#374151; line-height:1.6;">Dear Rekan-rekan PIC Cost,</p>
                <p style="color:#374151; line-height:1.6;">Sebagai pengingat rutin mingguan, mohon untuk segera melakukan pembuatan dan pengumpulan <strong>Berita Acara (BA)</strong> atas seluruh aktivitas yang berpotensi menimbulkan backcharge kepada vendor/supplier dan customer.</p>
                <p style="color:#374151; line-height:1.6;">Dokumen BA dan form BA dapat rekan-rekan isi pada link berikut :</p>
                <div style="text-align:center; margin:20px 0;">
                  <a href="https://ba-management.vercel.app/login"
                     style="display:inline-block; background-color:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">
                    Akses Aplikasi BA DN
                  </a>
                </div>
                <p style="color:#374151; line-height:1.6;">Atas kerja sama dan perhatian rekan-rekan, kami ucapkan terima kasih.</p>
                <br/>
                <p style="color:#374151;">
                  Salam,<br/>
                  <strong>Finance & Tax Departemen</strong><br/>
                  PT. Kalimantan Prima Persada - Site SPRL
                </p>
              </div>
            </body>
          </html>
        `,
  });
}

async function sendEmailCaseFour(email, beritaAcara, cc = []) {
  if (!email || email.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beritaacaramanagement@gmail.com",
      pass: "khwe slyw yubj jyfk",
    },
  });

  await transporter.sendMail({
    from: '"BA Management KPP" <beritaacaramanagement@gmail.com>',
    to: email,
    cc: cc.length > 0 ? cc.join(", ") : undefined,
    subject: "Kirim BA Full Sign ke Department Finance & Tax",
    html: `
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Reminder BA Full Sign</title>
        </head>
        <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9fafb;">
          <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
            
            <div style="text-align:center;">
              <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" 
                alt="logoKPP" style="max-width:100px; height:auto;"/>
            </div>

            <h2 style="color:#111827; text-align:center;">System Notification</h2>

            <p style="color:#374151; line-height:1.6;">Dear Rekan-rekan PIC Cost,</p>

            <p style="color:#374151; line-height:1.6;">
              Harap segera mengirimkan Berita Acara (BA) Backcharge <strong>Full Sign</strong> ke Departemen Finance & Tax.
            </p>

            <p style="color:#374151; line-height:1.6;">
              Berikut adalah daftar nomor BA yang perlu segera dikirimkan:
            </p>

            <ul style="color:#374151; line-height:1.6; margin-left:20px;">
              ${beritaAcara?.number}
            </ul>

            <p style="color:#374151; line-height:1.6;">
              No BA dan form BA dapat diakses melalui link berikut:
            </p>

            <div style="text-align:center; margin:20px 0;">
              <a href="https://ba-management.vercel.app/login"
                style="display:inline-block; background-color:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">
                Akses Aplikasi BA DN
              </a>
            </div>

            <p style="color:#374151; line-height:1.6;">
              Atas kerja sama dan perhatian rekan-rekan, kami ucapkan terima kasih.
            </p>

            <br/>

            <p style="color:#374151;">
              Salam,<br/>
              <strong>Finance & Tax Departemen</strong><br/>
              PT. Kalimantan Prima Persada - Site SPRL
            </p>

          </div>
        </body>
      </html>
    `,
  });
}

async function sendEmailCaseFive(email, customers, cc = []) {
  if (!email || email.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beritaacaramanagement@gmail.com",
      pass: "khwe slyw yubj jyfk",
    },
  });

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const now = new Date();
  const periodeText = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  await transporter.sendMail({
    from: '"BA Management KPP" <beritaacaramanagement@gmail.com>',
    to: email,
    cc: cc.length > 0 ? cc.join(", ") : undefined,
    subject: "Reminder End of Period: Pembuatan Berita Acara Backcharge",
    html: `
          <html lang="id">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Email Reminder Backcharge</title>
            </head>
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9fafb;">
              <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
                
                <div style="text-align:center;">
                  <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" 
                     alt="logoKPP" style="max-width:100px; height:auto;"/>
                </div>

                <h2 style="color:#111827; text-align:center;">Reminder End of Period: Pembuatan Berita Acara Backcharge</h2>

                <p style="color:#374151; line-height:1.6;">Dear Rekan-rekan PIC Cost,</p>

                <p style="color:#374151; line-height:1.6;">
                  Sebagai pengingat akhir Cut Off Period, mohon untuk segera melakukan pembuatan dan pengumpulan 
                  <strong>Berita Acara (BA)</strong> atas:
                  <br/>
                 <strong>${customers?.map((c) => c.name).join(", ")}</strong> 
periode <strong>${periodeText}</strong>

                </p>

                <p style="color:#374151; line-height:1.6;">Dokumen BA ini menjadi dasar penagihan backcharge oleh Finance, sehingga diharapkan dapat dikirimkan paling lambat N+5 dari cut off pekerjaan.</p>

                  <p style="color:#374151; line-height:1.6;">No BA dan form BA dapat diakses melalui link berikut:</p>
                <div style="text-align:center; margin:20px 0;">
                  <a href="https://ba-management.vercel.app/login"
                     style="display:inline-block; background-color:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">
                    Akses Aplikasi BA DN
                  </a>
                </div>

                <p style="color:#374151; line-height:1.6;">Atas kerja sama dan perhatian rekan-rekan, kami ucapkan terima kasih.</p>

                <br/>

                <p style="color:#374151;">
                  Salam,<br/>
                  <strong>Finance & Tax Departemen</strong><br/>
                  PT. Kalimantan Prima Persada - Site SPRL
                </p>

              </div>
            </body>
          </html>
        `,
  });
}

async function sendEmailCaseSix(email, beritaAcara, cc) {
  if (!email || email.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beritaacaramanagement@gmail.com",
      pass: "khwe slyw yubj jyfk",
    },
  });

  const listBA = beritaAcara?.map((item) => `<li>${item.number}</li>`).join("");

  await transporter.sendMail({
    from: '"BA Management KPP" <beritaacaramanagement@gmail.com>',
    to: email,
    cc: cc.length > 0 ? cc.join(", ") : undefined,
    subject: "Permintaan Pembuatan Debit Note",
    html: `
          <html lang="id">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Permintaan Pembuatan Debit Note</title>
            </head>
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9fafb;">
              <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
                
                <div style="text-align:center;">
                  <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" 
                     alt="logoKPP" style="max-width:100px; height:auto;"/>
                </div>

                <h2 style="color:#111827; text-align:center;">Permintaan Pembuatan Debit Note</h2>

                <p style="color:#374151; line-height:1.6;">Yth. Tim Finance,</p>

                <p style="color:#374151; line-height:1.6;">
                Berita Acara telah dibuat dan disetujui. Mohon segera melakukan pembuatan Debit Note di sistem atas BA : 
                </p>

            <ul style="color:#374151; line-height:1.6; margin-left:20px;">
              ${listBA}
            </ul>

                  <p style="color:#374151; line-height:1.6;">No BA dan form BA dapat diakses melalui link berikut:</p>
                <div style="text-align:center; margin:20px 0;">
                  <a href="https://ba-management.vercel.app/login"
                     style="display:inline-block; background-color:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">
                    Akses Aplikasi BA DN
                  </a>
                </div>

                <p style="color:#374151; line-height:1.6;">Atas kerja sama dan perhatian rekan-rekan, kami ucapkan terima kasih.</p>

                <br/>

                <p style="color:#374151;">
                  Salam,<br/>
                  <strong>Finance & Tax Departemen</strong><br/>
                  PT. Kalimantan Prima Persada - Site SPRL
                </p>

              </div>
            </body>
          </html>
        `,
  });
}

module.exports = {
  sendEmailCaseOne,
  sendEmailCaseTwo,
  sendEmailCaseThree,
  sendEmailCaseFour,
  sendEmailCaseFive,
  sendEmailCaseSix,
};
