const nodemailer = require("nodemailer");

async function sendReminderRutinity(emailList) {
  if (!emailList || emailList.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beritaacaramanagement@gmail.com",
      pass: "khwe slyw yubj jyfk",
    },
  });

  await Promise.all(
    emailList.map(async (email) => {
      try {
        await transporter.sendMail({
          from: '"BA Management KPP" <beritaacaramanagement@gmail.com>',
          to: email,
          subject: "Reminder End of Period: Pembuatan Berita Acara Backcharge",
          html: `
          <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Template Email Reminder Backcharge</title>
            </head>
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9fafb;">
              <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
                <div style="text-align:center;">
                  <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" alt="logoKPP" style="max-width:100px; height:auto;"/>
                </div>
                <h2 style="color:#111827; text-align:center;">Reminder End of Period: Pembuatan Berita Acara Backcharge</h2>
                <p style="color:#374151; line-height:1.6;">Dear Rekan-rekan PIC Cost,</p>
                <p style="color:#374151; line-height:1.6;">Sebagai pengingat rutin di setiap akhir periode, mohon untuk segera melakukan pembuatan dan pengumpulan <strong>Berita Acara (BA)</strong> atas seluruh aktivitas yang berpotensi menimbulkan backcharge kepada vendor/supplier dan customer.</p>
                <p style="color:#374151; line-height:1.6;">Dokumen BA ini menjadi dasar penagihan backcharge oleh Finance, sehingga diharapkan dapat dikirimkan paling lambat N+5 akhir periode setiap bulan menggunakan format standar.</p>
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
      } catch (err) {
        console.error(`⚠️ Gagal kirim email ke ${email}:`, err.message);
      }
    })
  );
}

async function sendReminderRutinityForFuel(emailList) {
  if (!emailList || emailList.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beritaacaramanagement@gmail.com",
      pass: "khwe slyw yubj jyfk",
    },
  });

  await Promise.all(
    emailList.map(async (email) => {
      try {
        await transporter.sendMail({
          from: '"BA Management KPP" <beritaacaramanagement@gmail.com>',
          to: email,
          subject: "Reminder End of Period: Pembuatan Berita Acara Backcharge",
          html: `
         <html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Template Email Reminder Backcharge</title>
  </head>
  <body
    style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9fafb;"
  >
    <div
      style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.05);"
    >
      <div style="text-align:center;">
        <img
          src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png"
          alt="logoKPP"
          style="max-width:100px; height:auto;"
        />
      </div>

      <h2 style="color:#111827; text-align:center;">
        Reminder End of Period: Pembuatan Berita Acara Backcharge
      </h2>

      <p style="color:#374151; line-height:1.6;">
        Dear Rekan-rekan PIC Cost,
      </p>

      <p style="color:#374151; line-height:1.6;">
        Sebagai pengingat rutin di setiap akhir periode, mohon untuk segera
        melakukan pembuatan dan pengumpulan
        <strong>Berita Acara (BA)</strong> atas seluruh aktivitas yang berpotensi
        menimbulkan backcharge kepada vendor/supplier dan customer.
      </p>

      <p style="color:#374151; line-height:1.6;">
        Dokumen BA ini menjadi dasar penagihan backcharge oleh Finance,
        sehingga diharapkan dapat dikirimkan paling lambat N+5 akhir periode
        setiap bulan menggunakan format standar.
      </p>

      <div
        style="background-color:#f3f4f6; padding:15px; border-radius:8px; margin:20px 0;"
      >
        <p style="color:#1f2937; line-height:1.6; margin:0;">
          Selain itu, mohon perhatian khusus untuk segera melakukan
          <strong>pembuatan Berita Acara (BA) Fuel</strong> dengan vendor berikut:
        </p>
        <ul style="color:#1f2937; line-height:1.6; margin-top:10px;">
          <li><strong>PT STARGATE PASIFIC RESOURCE</strong></li>
          <li><strong>PT FEROS BINTANG MOROWALI</strong></li>
        </ul>
        <p style="color:#1f2937; line-height:1.6;">
          Mohon agar proses BA untuk kedua vendor tersebut dapat diselesaikan
          tepat waktu agar mendukung kelancaran proses penagihan dan
          rekonsiliasi biaya bahan bakar.
        </p>
      </div>

      <div style="text-align:center; margin:20px 0;">
        <a
          href="https://ba-management.vercel.app/login"
          style="display:inline-block; background-color:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;"
        >
          Akses Aplikasi BA DN
        </a>
      </div>

      <p style="color:#374151; line-height:1.6;">
        Atas kerja sama dan perhatian rekan-rekan, kami ucapkan terima kasih.
      </p>

      <br />

      <p style="color:#374151;">
        Salam,<br />
        <strong>Finance & Tax Departemen</strong><br />
        PT. Kalimantan Prima Persada - Site SPRL
      </p>
    </div>
  </body>
</html>

        `,
        });
      } catch (err) {
        console.error(`⚠️ Gagal kirim email ke ${email}:`, err.message);
      }
    })
  );
}

async function sendReminderWaitingBA(email, data, cc) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "beritaacaramanagement@gmail.com",
      pass: "khwe slyw yubj jyfk",
    },
  });

  const htmlBAList = data
    .map(
      (ba, index) => `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #E5E7EB; text-align: center;">
            ${index + 1}
          </td>
          <td style="padding: 8px 12px; border: 1px solid #E5E7EB;">
            ${ba.number || "-"}
          </td>
        </tr>`
    )
    .join("");

  const html = `<html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reminder Waiting Signed - Berita Acara</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F9FAFB;">
      <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        
        <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" alt="logoKPP" style="max-width: 100px; height: auto; margin-bottom: 20px;" />

        <h1 style="font-size: 24px; font-weight: bold; color: #1F2937; text-align: start; margin-bottom: 10px;">
          Reminder: Berita Acara Menunggu Tanda Tangan
        </h1>
        <p style="text-align: start; color: #4B5563; line-height: 1.6; margin-bottom: 24px;">
          Dear Rekan-rekan PIC Cost,<br/>
         Harap segera mengirimkan Berita Acara (BA) Backcharge Full Sign ke Departemen Finance & Tax sebelum [N+5 Cut Off Period].	
        </p>

        <table role="presentation" width="100%" style="border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #2563EB; color: #ffffff;">
              <th style="padding: 8px 12px; text-align: center;">No</th>
              <th style="padding: 8px 12px; text-align: left;">Nomor Berita Acara</th>
            </tr>
          </thead>
          <tbody>
            ${htmlBAList}
          </tbody>
        </table>

        <p style="text-align: start; color: #4B5563; line-height: 1.6;">
          Mohon segera lakukan tanda tangan agar proses selanjutnya dapat berjalan tepat waktu.
          <br/><br/>
          Akses aplikasi melalui link berikut:
        </p>

        <div style="margin-top: 20px; text-align: start;">
          <a href="https://ba-management.vercel.app/login" 
            style="display: inline-block; background-color: #2563EB; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Buka Aplikasi BA Management
          </a>
        </div>

        <p style="text-align: start; color: #4B5563; line-height: 1.6; margin-top: 30px;">
          Terima kasih atas perhatian dan kerja samanya.
        </p>

        <p style="text-align: start; margin-top: 20px; color: #111827;">
          Salam,<br/>
          <strong>Finance & Tax Department</strong><br/>
          PT. Kalimantan Prima Persada - Site SPRL
        </p>

      </div>
    </body>
  </html>
  `;

  await transporter.sendMail({
    from: "BA Management KPP",
    cc: cc.length ? cc : undefined,
    to: email,
    subject: "Reminder End of Period: Pembuatan Berita Acara Backcharge",
    html,
  });
}

module.exports = {
  sendReminderRutinity,
  sendReminderWaitingBA,
  sendReminderRutinityForFuel,
};
