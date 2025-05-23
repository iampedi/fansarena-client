// src/pages/admin/competitions/Winners.jsx
import { Button } from "@/components/ui/button";
import { AwardIcon } from "lucide-react";
import AddWinnerDialog from "./AddWinnerDialog";
import { useState } from "react";

/**
 * @param {string} cName - نام رقابت
 * @param {Array} winners - لیست برندگان (از والد می‌آید)
 * @param {function} onChange - تابع ست کردن winners (از والد می‌آید)
 * @param {function} [submitForm] - تابع سابمیت فرم اصلی (در صورت نیاز)
 */
export default function CompetitionWinners({
  cName,
  winners = [],
  onChange,
  submitForm,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  // افزودن Winner جدید و اگر خواستی، فرم اصلی رو هم سابمیت کن
  const handleAddWinner = (data) => {
    const newWinners = [...winners, data];
    onChange(newWinners); // والد رو با آرایه جدید آپدیت کن
    if (typeof submitForm === "function") submitForm(); // فقط اگر وجود داشت
  };

  return (
    <div className="col-span-4 mt-3 grid w-full grid-cols-4 gap-3 rounded-md border bg-gray-50 p-4">
      {winners.length === 0 ? (
        <p className="col-span-4 text-center">There is no Winners.</p>
      ) : (
        <div className="col-span-4">
          <ul>
            {winners.map((winner, i) => (
              <li
                key={`${winner.club}-${winner.year}-${winner.rank}-${i}`}
                className="flex items-center gap-2"
              >
                <AwardIcon className="h-4 w-4" />
                {winner.club} - {winner.year} - {winner.rank}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button
        type="button"
        onClick={() => setModalOpen(true)}
        variant="outline"
      >
        <AwardIcon />
        Add Winner
      </Button>

      <AddWinnerDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddWinner}
        cName={cName}
      />
    </div>
  );
}
