import { EllipsisVertical } from "lucide-react";

type CardListProps = {
  title: string;
  dateRange: string;
  numFriend: string;
};

const CardList = ({ title, dateRange, numFriend }: CardListProps) => {
  return (
    <div className="flex items-center gap-4 rounded-xl p-3 transition-all hover:bg-gray-50">
      {/* Image change */}
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400" />
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">
          {dateRange} • {numFriend}
        </p>
      </div>
      <EllipsisVertical className="h-5 w-5 text-gray-400" />
    </div>
  );
};

export default CardList;
