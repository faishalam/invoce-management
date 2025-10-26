import PersonIcon from '@mui/icons-material/Person';
import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';
import { useMemo } from "react";
import useGlobal from "../../hooks";
import useUserManagement from "../hooks";

export default function CardHeader() {
  const { dataUser } = useUserManagement();
  const { dataDepartment } = useGlobal();

  const cards = useMemo(() => {
    return [
      {
        label: "Total User",
        color: "bg-red-900",
        textColor: "text-red-900",
        icon: (
          <PersonIcon
            className="text-white"
            style={{ fontSize: "3rem" }}
          />
        ),
        count: dataUser?.data?.length,
      },
      {
        label: "Total Department",
        color: "bg-amber-800",
        textColor: "text-amber-800",
        icon: (
          <SafetyDividerIcon
            className="text-white"
            style={{ fontSize: "3rem" }}
          />
        ),
        count: dataDepartment?.data?.length ?? 0,
      },
    ];
  }, [dataUser?.data, dataDepartment?.data]);
  return (
    <>
      <div className="grid grid-cols-2 space-x-4">
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
