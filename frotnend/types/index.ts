export interface TVSeries {
  id: string;
  title: string;
  description: string;
  seasons: Season[];
}

export interface Season {
  id: string;
  title: string;
  tvSeriesId: string;
  userIds: string[];
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  seasonId: string;
}

export interface Payment {
  id: string;
  userId: string;
  season : Season
  amount: number;
  date: string;
}
