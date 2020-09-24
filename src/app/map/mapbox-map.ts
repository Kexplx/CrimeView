import { Injectable } from '@angular/core';
import { District } from '../district/interfaces/district';
import { MAPBOX_CREDENTIALS } from './mapbox-credentials';
import { Map, Layer, Popup, LngLatBounds } from 'mapbox-gl';

const { accessToken, styleLight } = MAPBOX_CREDENTIALS;

/**
 * Wrapper for mapbox's Map class.
 *
 * Used to initizalize a map and add or remove layers based on district coordinates.
 */
@Injectable()
export class MapboxMap {
  private _clickedLayer: Layer | undefined;
  private _layers: Layer[] = [];
  private _map: Map | undefined;

  private get map(): Map {
    if (this._map) {
      return this._map;
    } else {
      throw new Error('Map was used while undefined. Call #init first.');
    }
  }

  private set map(map: Map) {
    this._map = map;
  }

  /**
   * Initalizes a new map.
   *
   * @param id The id of the html element to contain the map.
   */
  init(id: string): void {
    this.map = new Map({
      accessToken,
      style: styleLight,
      center: [11.0767, 49.4521], // Nuremberg's coordinates
      container: id,
      maxZoom: 9,
      minZoom: 6.5,
      pitch: 30, // Degrees
      zoom: 8,
    });
  }

  /**
   * Removes all layers from the map.
   */
  removeLayers(): void {
    for (const { id } of this._layers) {
      this.map.removeLayer(id);
    }

    this._layers = [];
  }

  /**
   * Adds a layer to the map for every passed district.
   *
   * @param districts The districts to create the layers from.
   */
  addLayers(districts: District[]): void {
    for (const district of districts) {
      this.addLayer(district);
    }

    this.fitBounds(districts);
  }

  private addLayer(district: District): void {
    const { geometry, crimeRate } = district;
    const id = Math.random().toString();

    const layer: Layer = {
      id,
      type: 'fill',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: district,
          geometry,
        },
      },
      maxzoom: 11,
      paint: {
        'fill-color': this.getColorByCrimeRate(crimeRate),
        'fill-opacity': 0.2,
        'fill-outline-color': 'gray',
        'fill-opacity-transition': { delay: 0, duration: 0 },
      },
    };

    this.map.addLayer(layer);
    this.handleLayerClicks(layer);
    this._layers.push(layer);
  }

  private handleLayerClicks(layer: Layer): void {
    this.map.on('click', layer.id, ({ features, lngLat }) => {
      if (this._clickedLayer) {
        this.map.setPaintProperty(this._clickedLayer.id, 'fill-opacity', 0.2);
      }
      this.map.setPaintProperty(layer.id, 'fill-opacity', 0.5);
      this._clickedLayer = layer;

      if (features) {
        const html = this.getPopupHtml(features[0].properties as District);
        new Popup().setLngLat(lngLat).setHTML(html).addTo(this.map);
      }
    });
  }

  private fitBounds(districts: District[]): void {
    const bounds = new LngLatBounds();

    for (const { geometry } of districts) {
      let lng;
      let lat;

      if (geometry.type === 'Polygon') {
        [lng, lat] = geometry.coordinates[0][0];
      } else if (geometry.type === 'MultiPolygon') {
        [lng, lat] = geometry.coordinates[0][0][0];
      }

      if (lat && lng) {
        bounds.extend([lng, lat]);
      }
    }

    this.map.fitBounds(bounds);
  }

  private getPopupHtml({ name, state, type, crimeRate }: District): string {
    return `
    <h4>${name}</h4>
    <p>${type} in ${state}</p>
    <p>
      <span style="color: ${this.getColorByCrimeRate(crimeRate)}">
      ${crimeRate ? crimeRate : '--'}
      </span>
      Straftaten pro 100.000 Einwohner (Stand 2019)
    </p>`;
  }

  private getColorByCrimeRate(crimeRate: number | undefined): string {
    if (!crimeRate) {
      return 'gray';
    }

    return crimeRate / 100000 <= 0.04 ? 'green' : crimeRate / 100000 <= 0.07 ? 'orange' : 'red';
  }
}
