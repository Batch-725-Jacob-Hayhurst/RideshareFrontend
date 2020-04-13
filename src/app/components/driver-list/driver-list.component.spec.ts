import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverListComponent } from './driver-list.component';

/**
 * Test the efficacy of sorting algorithms in driver-list.component.ts
 * List of algorithms that are tested:
 * sort(orderedBy: string): void; uses:
 *    changeSortOrder();
 *    sortByName(): void;
 *    sortByDistance(): void;
 *    sortByTime(): void; uses:
 *      getMinutes(duration: string): number;
 *    sortOrderIsLow(orderedBy: string): boolean;
 * sleep(ms): Promise; //used by many functions
 * getGoogleApi(): void;  Unable to test because async()'s dependency called Zone cannot be detected by Protractor
 * addToModal(driver: Driver);
 * getDistanceAndDuration(origin, drivers): Driver[];
 * 
 * 
 * 
*/
describe('Test Sorting Algorithms', () => {
  let dlc: DriverListComponent;

  /**
   * Mock the object to be sorted.
  */
  beforeAll(() => {

  });

  // let fixture: ComponentFixture<DriverListComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ DriverListComponent ]
  //   })
  //   .compileComponents();
  // }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(DriverListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
