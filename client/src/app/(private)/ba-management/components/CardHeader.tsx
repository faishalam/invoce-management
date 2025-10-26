import ArticleIcon from "@mui/icons-material/Article";
import DensitySmallIcon from "@mui/icons-material/DensitySmall";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import { useMemo } from "react";
import useBeritaAcara from "../hooks";

export default function CardHeader() {
  const { dataBeritaAcaraList } = useBeritaAcara();
  const cards = useMemo(() => {
    return [
      {
        label: "Trade",
        color: "bg-green-700",
        textColor: "text-green-800",
        icon: (
          <ArticleIcon className="text-white" style={{ fontSize: "3rem" }} />
        ),
        count: dataBeritaAcaraList?.filter(
          (item) => item.tipe_transaksi === "trade"
        ).length,
      },
      {
        label: "Non Trade",
        color: "bg-blue-800",
        textColor: "text-blue-800",
        icon: (
          <FilterNoneIcon className="text-white" style={{ fontSize: "3rem" }} />
        ),
        count: dataBeritaAcaraList?.filter(
          (item) => item.tipe_transaksi === "nontrade"
        ).length,
      },
      {
        label: "BA Fuel",
        color: "bg-red-800",
        textColor: "text-red-800",
        icon: (
          <LocalGasStationIcon
            className="text-white"
            style={{ fontSize: "3rem" }}
          />
        ),
        count: dataBeritaAcaraList?.filter(
          (item) => item.jenis_berita_acara === "fuel"
        ).length,
      },
      {
        label: "BA Non Fuel",
        color: "bg-orange-600",
        textColor: "text-orange-600",
        icon: (
          <DensitySmallIcon
            className="text-white"
            style={{ fontSize: "3rem" }}
          />
        ),
        count: dataBeritaAcaraList?.filter(
          (item) => item.jenis_berita_acara === "nonfuel"
        ).length,
      },
    ];
  }, [dataBeritaAcaraList]);
  return (
    <>
      <div className="grid grid-cols-4 space-x-4">
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
