import { Geometry } from 'geojson';

export type DistrictType =
  | 'Kreis'
  | 'Kreisfreie Stadt'
  | 'Landkreis'
  | 'Regionalverbund'
  | 'Stadtkreis';

/**
 * Represents a german district.
 */
export interface District {
  code: string; // A unique identifier with 5 characters.
  name: string;
  type: DistrictType;
  crestUrl: string; // The url of the districts's crest as svg.
  state: string; // The name of the federal state containing the district.

  totalOffencesCount: number;
  relativeOffencesCount: number; // Number of offences per 100.000 inhabitants.
  commonOffences: { offenceName: string; offencesCount: number }[];
  totalSuspectsCount: number;
  nonGermanSuspectsCount: number;
  solvedCasesCount: number;

  geometry?: Geometry;
}
