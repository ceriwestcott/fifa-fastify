export interface MatchAttributes {
  home: {
    name: string;
    team: string;
  };
  away: {
    name: string;
    team: string;
  };
}

export interface UpdateMatchAttributes {
  id: string;
  home: {
    goals: number;
  };
  away: {
    goals: number;
  };
}

export interface MatchSearchParams {
  id: string;
}
