import { ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router";

interface CardProps {
  country: string;
  location: string;
  description: string;
  href: string;
}

const Card = ({ country, location, description, href }: CardProps) => {
  const colors = [
    "from-red-500 to-orange-500",
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-indigo-500 to-violet-500",
    "from-amber-500 to-yellow-500",
  ];

  const getColor = (text: string) => {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
      hash += text.charCodeAt(i);
    }

    return colors[hash % colors.length];
  };

  const gradient = getColor(country + location);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl`}
    >
      <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/20 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span className="text-sm font-medium">{country}</span>
        </div>

        <h3 className="text-2xl font-bold">{location}</h3>

        <p className="mt-2 text-sm text-white/80">{description}</p>

        <Link
          to={href}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
        >
          Explore <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default Card;
