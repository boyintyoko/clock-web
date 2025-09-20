import { useEffect, useState } from "react";
import { useTimeZone } from "@/app/context/timeZoneContext";

export default function TimeZoneContent() {
  const [supportTimeZone, setSupportTimeZone] = useState<string[]>([]);
  const { isNowTimeZone, setIsNowTimeZone } = useTimeZone();

  useEffect(() => {
    const timeZones = Intl.supportedValuesOf("timeZone");
    setSupportTimeZone(timeZones);
  }, []);

  const changeTimeZone = (supportTimeZone: string) => {
    if (supportTimeZone === isNowTimeZone) return;
    localStorage.setItem("timeZone", supportTimeZone);
    setIsNowTimeZone(supportTimeZone);
    setIsNowTimeZone(isNowTimeZone);
    window.location.reload();
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
        {supportTimeZone.map((supportTimeZone) => (
          <button
            onClick={() => changeTimeZone(supportTimeZone)}
            key={supportTimeZone}
            className={`${supportTimeZone === isNowTimeZone
              ? "border-red-500"
              : "border-gray-200 hover:shadow-md hover:bg-gray-50"
              } w-full text-left p-4 rounded-xl bg-white border shadow-sm transition-all font-medium text-gray-700`}
          >
            {supportTimeZone}
          </button>
        ))}
      </div>
    </div>
  );
}
