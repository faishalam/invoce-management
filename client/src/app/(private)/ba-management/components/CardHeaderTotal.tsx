import DescriptionIcon from "@mui/icons-material/Description"; // Berita Acara
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Debit Note
import RequestQuoteIcon from "@mui/icons-material/RequestQuote"; // Faktur
import { useMemo } from "react";
import useGlobal from "../../hooks";

export default function CardHeaderTotal() {
  const { dataTotalList } = useGlobal();

  const cards = useMemo(() => {
    return [
      {
        label: "Total Berita Acara",
        color: "bg-gray-900",
        textColor: "text-gray-900",
        icon: (
          <DescriptionIcon
            className="text-white"
            style={{ fontSize: "3rem" }}
          />
        ),
        count: dataTotalList?.data?.totalBeritaAcara,
      },
      {
        label: "Total Debit Note",
        color: "bg-amber-800",
        textColor: "text-amber-800",
        icon: (
          <ReceiptLongIcon
            className="text-white"
            style={{ fontSize: "3rem" }}
          />
        ),
        count: dataTotalList?.data?.totalDebitNote,
      },
      {
        label: "Total Faktur",
        color: "bg-purple-900",
        textColor: "text-purple-900",
        icon: (
          <RequestQuoteIcon
            className="text-white"
            style={{ fontSize: "3rem" }}
          />
        ),
        count: dataTotalList?.data?.totalFaktur,
      },
    ];
  }, [dataTotalList]);
  return (
    <>
      <div className="grid grid-cols-3 space-x-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-md flex gap-3 px-4 py-4"
          >
            <div
              className={`${card.color} p-2 rounded-md inline-flex items-center justify-center`}
            >
              {card.icon}
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-md font-medium">{card.label}</p>
              <p className={`text-3xl font-semibold ${card.textColor}`}>
                {card.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
