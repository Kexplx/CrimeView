import { of } from 'rxjs';
import { City } from '../interfaces/city';
import { CityPrediction } from '../interfaces/city-prediction';
import { CityInputComponent } from '../city-input/city-input.component';
import { CityService } from '../city-input/city.service';

let cityServiceSpy: { getCityPredictions: jest.Mock; getCity: jest.Mock };
const cityPredictions: CityPrediction[] = [
  { name: 'A', placeId: 'B' },
  { name: 'c', placeId: 'D' },
];

const city: City = { placeId: '123', name: 'K', position: { lat: 1, lng: 0 } };

let component: CityInputComponent;

beforeEach(() => {
  cityServiceSpy = {
    getCity: jest.fn(() => of(city)),
    getCityPredictions: jest.fn(() => of(cityPredictions)),
  };

  component = new CityInputComponent((cityServiceSpy as unknown) as CityService);
});

describe('#onInput', () => {
  it('should trigger a value emitted by #predictions', done => {
    component.predictions$.subscribe(cp => {
      expect(cp).toEqual(cityPredictions);
      done();
    });

    component.onInput('input');
  });
});

describe('#onPredictionSelected', () => {
  it('should call #getCity', () => {
    component.onPredictionSelected({ name: 'c', placeId: 'D' });
    expect(cityServiceSpy.getCity.mock.calls).toHaveLength(1);
  });

  it('should emit the returned city-search', done => {
    component.citySelected.subscribe((c: City) => {
      expect(c).toEqual(city);
      done();
    });

    component.onPredictionSelected({ placeId: '123' } as City);
  });
});
