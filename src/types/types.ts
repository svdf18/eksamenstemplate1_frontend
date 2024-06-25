interface IItem {
  id: number;
  name: string;
}

// interface IAgeGroup {
//   id: number;
//   ageGroupName: string;
// }

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
  athleteAgeGroupEnum: string;
  club: IClub;
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
  time?: string;
  distance?: number;
  points?: number;
}

interface IResultTime extends IResultType {
  time: string; // Time in seconds or appropriate unit
}

interface IResultPoints extends IResultType {
  points: number;
}

interface IResultDistance extends IResultType {
  distance: number; // Distance in meters or appropriate unit
}

export type { 
  IItem,
  IDiscipline,
  IClub,
  IAthlete,
  ITrackMeet,
  IResultType,
  IResultTime,
  IResultPoints,
  IResultDistance
};