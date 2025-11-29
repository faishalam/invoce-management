// helpers/generateNoBA.js
function generateNoBA(lastNumberTrade, lastNumberNonTrade, tipe_transaksi) {
  const siteCode = "Y";
  const now = new Date();
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
  const kodeBulan = monthCodes[now.getMonth()];
  const tahun = String(now.getFullYear()).slice(-2);

  // Tentukan nomor berdasarkan tipe transaksi
  const lastNumber =
    tipe_transaksi === "trade" ? lastNumberTrade : lastNumberNonTrade;
  const newNumber = String((lastNumber || 0) + 1).padStart(4, "0");
  const baType = tipe_transaksi === "trade" ? "BA-I" : "BA-II";

  return `${siteCode}/${newNumber}/${kodeBulan}-${tahun}/${baType}`;
}

module.exports = { generateNoBA };
