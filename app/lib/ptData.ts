export type Service = {
  id: string;
  title: string;
  durationMin: number;
  priceSek: number;
};

export type PT = {
  id: string;
  name: string;
  city: string;
  bio: string;
  photoUrl: string;
  rating: number;
  services: Service[];
  slots: string[]; // ISO-strängar i framtiden
};

export const pts: PT[] = [
  {
    id: "alex",
    name: "Alex PT",
    city: "Stockholm",
    bio: "Lic. PT, styrka & rörlighet. Enkel att boka.",
    photoUrl:
      "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?q=80&w=900&auto=format&fit=crop",
    rating: 4.9,
    services: [
      { id: "s60", title: "PT 60 min", durationMin: 60, priceSek: 850 },
      { id: "s30", title: "PT 30 min", durationMin: 30, priceSek: 500 }
    ],
    slots: [
      "2025-09-02T10:00:00",
      "2025-09-02T11:30:00",
      "2025-09-03T17:00:00",
      "2025-09-04T08:30:00"
    ]
  }
];
