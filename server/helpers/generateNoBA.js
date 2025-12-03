const { Berita_Acara } = require("../models");

function extractNumber(noBA) {
  if (!noBA) return null;

  const parts = noBA.split("/");
  if (parts.length < 2) return null;

  const num = parseInt(parts[1], 10); // ambil angka ke-2 (0046)
  return isNaN(num) ? null : num;
}

// ====== GET LAST NUMBER TRADE ======
async function getLastNumberTrade() {
  const last = await Berita_Acara.findOne({
    where: { tipe_transaksi: "trade" },
    order: [["createdAt", "DESC"]],
  });

  if (!last) return 33; // supaya mulai dari 34

  const number = extractNumber(last.number);
  return number ?? 33;
}

// ====== GET LAST NUMBER NONTRADE ======
async function getLastNumberNonTrade() {
  const last = await Berita_Acara.findOne({
    where: { tipe_transaksi: "nontrade" },
    order: [["createdAt", "DESC"]],
  });

  if (!last) return 45; // supaya mulai dari 46

  const number = extractNumber(last.number);
  return number ?? 45;
}

// ====== GENERATE NOMOR BA ======
// function generateNoBA(lastTrade, lastNonTrade, tipeTransaksi, periode) {
//   const siteCode = "Y";
//   const now = new Date();
//   const monthCodes = [
//     "AA",
//     "AB",
//     "AC",
//     "AD",
//     "AE",
//     "AF",
//     "AG",
//     "AH",
//     "AI",
//     "AJ",
//     "AK",
//     "AL",
//   ];
//   const kodeBulan = monthCodes[now.getMonth()];
//   const tahun = String(now.getFullYear()).slice(-2);

//   let baseNumber;

//   if (tipeTransaksi === "trade") {
//     baseNumber = lastTrade ?? 33;
//   } else {
//     baseNumber = lastNonTrade ?? 45;
//   }

//   const newNumber = String(baseNumber + 1).padStart(4, "0");
//   const baType = tipeTransaksi === "trade" ? "BA-I" : "BA-II";

//   return `${siteCode}/${newNumber}/${kodeBulan}-${tahun}/${baType}`;
// }

function generateNoBA(lastTrade, lastNonTrade, tipeTransaksi, periode) {
  const siteCode = "Y";

  const bulan = periode?.slice(0, 2);
  const bulanIndex = parseInt(bulan, 10) - 1;

  const monthCodes = [
    "AA",
    "AB",
    "AC",
    "AD",
    "AE",
    "AF",
    "AG",
    "AH",
    "AI",
    "AJ",
    "AK",
    "AL",
  ];

  const kodeBulan = monthCodes[bulanIndex] ?? "AA";

  const tahun = periode?.slice(2, 4);

  let baseNumber;
  if (tipeTransaksi === "trade") {
    baseNumber = lastTrade ?? 33;
  } else {
    baseNumber = lastNonTrade ?? 45;
  }

  const newNumber = String(baseNumber + 1).padStart(4, "0");
  const baType = tipeTransaksi === "trade" ? "BA-I" : "BA-II";

  return `${siteCode}/${newNumber}/${kodeBulan}-${tahun}/${baType}`;
}

module.exports = {
  generateNoBA,
  getLastNumberTrade,
  getLastNumberNonTrade,
};
