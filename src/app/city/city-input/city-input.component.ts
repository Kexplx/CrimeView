import { Component, Output, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CityService, CityPrediction, City } from '../city.service';

const DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-city-input',
  templateUrl: './city-input.component.html',
  styleUrls: ['./city-input.component.scss'],
})
export class CityInputComponent {
  @Output() readonly citySelected = new EventEmitter<City>();

  private readonly onInput$ = new Subject<string>();

  readonly predictions$: Observable<CityPrediction[]> = this.onInput$.pipe(
    debounceTime(DEBOUNCE_TIME),
    distinctUntilChanged(),
    switchMap(input => this.cityService.getCityPredictions(input)),
  );

  constructor(private cityService: CityService) {}

  onInput(input: string): void {
    this.onInput$.next(input);
  }

  onPredictionSelected({ placeId }: CityPrediction): void {
    this.cityService.getCity(placeId).subscribe(city => this.citySelected.emit(city));
  }

  displayFn({ name }: CityPrediction): string {
    return name;
  }
}
