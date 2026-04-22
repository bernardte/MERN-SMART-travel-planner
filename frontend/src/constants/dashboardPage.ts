

interface Destination {
  country: string;
  location: string;
  description: string;
  href: string;
}

export const destination: Destination[] = [
  {
    country: "China",
    location: "Shang Hai",
    description: "The vibrant metropolis",
    href: "/shanghai",
  },
  {
    country: "Korea",
    location: "Seoul & Busan",
    description: "K-pop, food & culture",
    href: "/korea",
  },
  {
    country: "Japan",
    location: "Tokyo & Kyoto",
    description: "Tradition meets modern life",
    href: "/japan",
  },
  {
    country: "Thailand",
    location: "Bangkok & Phuket",
    description: "Beaches, nightlife & street food",
    href: "/thailand",
  },
];

interface CardListProps {
  title: string;
  dateRange: string;
  numFriend: string;
}

export const trips: CardListProps[] = [
  {
    title: "Japan Cherry Blossom Tour",
    dateRange: "Mar 25 - Apr 5, 2024",
    numFriend: "4 friends",
  },
  {
    title: "Thailand Summer Escape",
    dateRange: "Jun 10 - Jun 20, 2024",
    numFriend: "2 friends",
  },
  {
    title: " Europe Backpacking",
    dateRange: " Aug 5 - Aug 28",
    numFriend: "Solo trip",
  },
];