/**
 * Represents the prediction of a city-search, based on previous user input.
 *
 * "Reg" -> {placeId: "0129", name: "Regensburg"};
 */
export interface CityPrediction {
  placeId: string;
  name: string;
}
