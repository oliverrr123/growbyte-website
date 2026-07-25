export type MyFriendEvent = {
  id: string;
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
  /** Optional display date, e.g. "March 12, 2026" */
  date?: string;
};

/** Add MyFriend events here — each shows as image + title (+ optional description) on /events. */
export const EVENTS: MyFriendEvent[] = [
  {
    id: "buena-vista-manor-house",
    title: "MyFriend showcase at a senior care home in San Francisco",
    image: "/images/robo-companion/buena-vista-manor-house.jpg",
    imageAlt: "Buena Vista Manor House event",
    date: "Jun 25, 2026",
  },
  {
    id: "zygmunt-arendt-house",
    title: "MyFriend event at a senior care home in San Francisco",
    image: "/images/robo-companion/zygmunt-arendt-house.jpg",
    imageAlt: "Zygmunt Arendt House event",
    date: "Jun 24, 2026",
  },
  {
    id: "komunitni-centrum-louka",
    title: "MyFriend showcase at a senior community center in Prague",
    image: "/images/robo-companion/komunitni-centrum-louka.jpg",
    imageAlt: "MyFriend showcase at a senior community center in Prague",
    date: "Jun 11, 2026",
  },
  {
    id: "digipritel-domov-senioru",
    title: "MyFriend event at a senior care home in Prague",
    image: "/images/robo-companion/digipritel-domov-senioru.jpg",
    imageAlt: "MyFriend event at a senior care home in Prague",
    date: "Jun 8, 2026",
  },
  {
    id: "moudra-sit-senior-event",
    title: "MyFriend showcase at a nonprofit senior event in Prague",
    image: "/images/robo-companion/moudra-sit-senior-event.jpg",
    imageAlt: "MyFriend showcase at a Moudrá síť senior event in Prague",
    date: "Jun 3, 2026",
  },
  {
    id: "maker-fair-digipritel",
    title: "MyFriend showcase at Maker Faire Prague",
    image: "/images/robo-companion/maker-faire-digipritel.jpg",
    imageAlt: "MyFriend / DigiPřítel booth at Maker Faire Prague",
    date: "May 9–10, 2026",
  },
];
