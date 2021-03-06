import { Geometry } from 'geojson';

/**
 * The structure of a district object returned by opendatasoft's `georef-germany-kreis` dataset.
 */
export interface OpendatasoftDistrict {
  krs_code: string; // district code
  geo_shape: Geometry;
}
