interface IItem {
  id: number;
  name: string;
}

interface IAgeGroup {
  id: number;
  ageGroupName: string;
}

interface IDiscipline {
  id: number;
  name: string;
  gender: "MENS" | "WOMENS" | "MIXED";
  resultType: "TIME" | "DISTANCE" | "POINTS";
}

interface IClub {
  id: number;
  name: string;
  city: string;
}

interface IAthlete {
  id: number;
  name: string;
  gender: string;
  age: number;
  imageUrl: string;
  club: IClub;
  ageGroup: IAgeGroup;
  disciplines: IDiscipline[];
}

interface ITrackMeet {
  id: number;
  name: string;
}

interface IResultType {
  id: number;
  trackMeet: ITrackMeet;
  date: string; // ISO 8601 date string
  athlete: IAthlete;
  discipline: IDiscipline;
  resultType: "TIME" | "DISTANCE" | "POINTS";
  time?: number;
  distance?: number;
  points?: number;
}

interface IResultTime extends IResultType {
  time: number; // Time in seconds or appropriate unit
}

interface IResultPoints extends IResultType {
  points: number;
}

interface IResultDistance extends IResultType {
  distance: number; // Distance in meters or appropriate unit
}

export type { 
  IItem,
  IAgeGroup,
  IDiscipline,
  IClub,
  IAthlete,
  ITrackMeet,
  IResultType,
  IResultTime,
  IResultPoints,
  IResultDistance
};