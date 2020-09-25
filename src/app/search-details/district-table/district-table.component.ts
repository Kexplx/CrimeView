import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { District } from '../../district/interfaces/district';

@Component({
  selector: 'app-district-table',
  templateUrl: './district-table.component.html',
  styleUrls: ['./district-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DistrictTableComponent {
  _districts: District[] | undefined;

  @Input() set districts(districts: District[]) {
    this._districts = districts.sort((a, b) => b.relativeOffencesCount - a.relativeOffencesCount);
    this.expandedDistrict = districts[0];
  }

  displayedColumns: string[] = ['name', 'stateName', 'relativeOffencesCount'];

  expandedDistrict: District | undefined;
}
