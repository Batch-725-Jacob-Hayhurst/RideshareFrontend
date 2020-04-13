/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user-service/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Driver } from 'src/app/models/driver';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})

/**
 * Component that displays the map and driver table.
 */
export class DriverListComponent implements OnInit {
  /**
   * The current page for the pagination of the driver table.
   */
  page = 1; // default page for pagination of driver table

  // map properties
  /**
   * The current location of the user used to calculate the distance between drivers.
   */
  location: string = sessionStorage.getItem("haddress") + " " +
    sessionStorage.getItem("hcity") + "," + sessionStorage.getItem("hstate");

  /**
   * A list of map properties.
   */
  mapProperties: {};

  /**
   * The current pagesize for the number of items for 
   * the  pagination of the driver table.
   */
  pageSize = 5;

  // Declare Google Map Variables
  @ViewChild('map', null)
  mapElement: any;
  map: google.maps.Map;

  // list of drivers
  /**
   * The list of drivers loaded from the database to populate the table.
   */
  drivers: Driver[] = [];

  // driver modal properties
  /**
   * The Driver's name for use in populating the Model with Driver's information.
   */
  driverName: string;

  /**
   * The Driver's Address for use in populating the Model with Driver's information.
   */
  driverLocation: string;

  /**
   * The Driver's E-mail for use in populating the Model with Driver's information.
   */
  driverEmail: string;

  /**
   * The Driver's Phone Number for use in populating the Model with Driver's information.
   */
  driverPhoneNumber: string;

  // set sort properties
  /**
   * Determines whether the table will sort in ascending or decending order.
   */
  sortOrder: string; // ascending or decending

  /**
   * Determines which column the table will sort by.
   */
  orderedBy: string; // which column

  /**
   * Constructor.
   * @param HttpClient used to make http requests to the server.
   * @param userService used to retrieve driver data.
   */
  constructor(private http: HttpClient, private userService: UserService) {}

  /**
   * Initializer for the Driver-List Component.
   */

   ngOnInit() {
    // get google api key to compute distance and duration
    this.getGoogleApi();

    // sleep for 1 second while the google 
    // API key is grabbed and then initilize the drivers
    this.sleep(1000).then(() => {
      //this.userService.getRidersForBatch(1).subscribe(
      this.userService.getRidersForLocation1(this.location).subscribe(
        drivers => this.drivers = this.getDistanceAndDuration(this.location, drivers));
    })

    // wait 2000ms for api call to return drivers
    // then add driver locations and route to map
    this.sleep(2000).then(() => {
      // set map properties
      this.mapProperties = {
        center: new google.maps.LatLng(Number(sessionStorage.getItem('lat')), Number(sessionStorage.getItem('lng'))),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      // create map with specified properties
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapProperties);

      // get all routes
      // show drivers on map
      this.showDriversOnMap(this.location, this.drivers);
    });
  }


  /**
   * Calls a unique sorting method based off of the parameter given.
   * @param orderedBy which column to sort by.
   */
  sort(orderedBy: string) {
    this.changeSortOrder();
    switch (orderedBy) {
      case 'name': {
        this.orderedBy = 'name';
        this.sortByName();
        break;
      }
      case 'distance': {
        this.orderedBy = 'distance';
        this.sortByDistance();
        break;
      }
      case 'time': {
        this.orderedBy = 'time';
        this.sortByTime();
        break;
      }
      default: {
        return;
      }
    }
  }

  /**
   * Toggles whether sorting in ascending or decending order.
   */
  changeSortOrder() {
    if (this.sortOrder === 'low') {
      this.sortOrder = 'high';
    } else {
      this.sortOrder = 'low';
    }
  }

  /**
   * Function to print the driver table in order by name.
   */
  sortByName() {
    this.drivers.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      const orderIsLow = (this.sortOrder === 'low');
      if (nameA < nameB) {
        return (orderIsLow ? -1 : 1);
      }
      if (nameA > nameB) {
        return (orderIsLow ? 1 : -1);
      }
    }
  );
}


  /**
   * Function to return whether to sort in ascending or decending order.
   * @param orderedBy the column to order by, clicked by user
   */
  sortOrderIsLow(orderedBy: string): boolean {
    if (this.orderedBy === orderedBy && this.sortOrder === 'low') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Function to print the driver table in order by Distance.
   */
  sortByDistance() {
    const orderIsLow = (this.sortOrder === 'low');
    this.drivers.sort((a, b) => {
      if (orderIsLow) {
        return parseInt(a.distance) - parseInt(b.distance);
      } else {
        return parseInt(b.distance) - parseInt(a.distance);
      }
    });
  }



  /**
   * Function to print the driver table in order by Time.
   */
  sortByTime() {
    const orderIsLow = (this.sortOrder === 'low');
    this.drivers.sort((a, b) => {
      if (orderIsLow) {
        return this.getMinutes(a.duration) - this.getMinutes(b.duration);
      } else {
        return this.getMinutes(b.duration) - this.getMinutes(a.duration);
      }
    });
  }

  /**
   * Function to return the number of minutes
   */
  getMinutes(duration: string): number {
    const matches = duration.match(/\d+/g);
    const len = matches.length;
    if (len === 1) {
      return parseInt(matches[0]);
    } else {
      return parseInt(matches[0])*60 + parseInt(matches[1]);
    }
  }

  /**
   * Function which sets a timeout for a desired duration.
   * @param ms the number of milliseconds
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


  /**
   * getGoogleApi gets the API key 
   * to be able to leverage the Google API
   */
  getGoogleApi() {
    this.http
      .get(`${environment.loginUri}getGoogleApi`)
      .subscribe((response) => {
        if (response['googleMapAPIKey'] !== undefined) {
          new Promise((resolve) => {
            const script: HTMLScriptElement = document.createElement('script');
            script.addEventListener('load', () => resolve());
            script.src = `http://maps.googleapis.com/maps/api/js?key=${response['googleMapAPIKey'][0]}`;
            document.head.appendChild(script);
          });
        }
      });
  }

  /**
   * Function that renders Driver pins and routes on the Google Map.
   * @param origin rider's location
   * @param drivers available drivers
   */
  showDriversOnMap(origin, drivers) {
    drivers.forEach((element) => {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: false,
        map: this.map,
      });
      this.displayRoute(
        origin,
        element.location,
        directionsService,
        directionsRenderer
      );
    });
  }

  /**
   * Function called from ShowDriversOnMap to render Driver Routes.
   * @param origin rider's location
   * @param destination driver's location
   * @param service maps API directionsService
   * @param display maps API directionsRenderer
   */
  displayRoute(origin, destination, service, display) {
    service.route(
      {
        origin,
        destination,
        travelMode: 'DRIVING',
        // avoidTolls: true
      },
      (response, status) => {
        if (status === 'OK') {
          display.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      }
    );
  }

  /**
   * addToModal responds to a click on a list item in the driver list
   * It then sets component properties - driverName and driverOrigin
   * @param driver available driver
   */
  addToModal(driver: Driver) {
    this.driverName = driver.name;
    this.driverLocation = driver.location;
    this.driverEmail = driver.email;
    this.driverPhoneNumber = driver.phoneNumber;
  }

  /**
   * getDistanceAndDuration computes the distance and driving duration
   * between the current rider and each available driver.
   * It then populates the drivers property with
   * driver information and the computed distance and duration
   * for each driver
   * @param origin rider's location
   * @param drivers available drivers
   */
  getDistanceAndDuration(origin, drivers): Driver[] {
    const origins = [];
    // set origin to rider's location
    origins.push(origin);

    // initialize newDrivers to empty array
    // newDrivers will take information from
    // drivers and add distance and duration
    const newDrivers: Driver[] = [];

    drivers.forEach((element) => {
      const location =
        element.hAddress + ' ' + element.hCity + ',' + element.hState;
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins,
          destinations: [location],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false,
        },
        (response, status) => {
          if (status !== 'OK') {
            console.log('Error was: ' + status);
          } else if (sessionStorage.getItem("userid") == element.userId) {

          } else {
            const results = response.rows[0].elements;
            const distance = results[0].distance.text;
            const duration = results[0].duration.text;
            const id = element.userId;
            const name = element.firstName + ' ' + element.lastName;
            const email = element.email;
            const phoneNumber = element.phoneNumber;
            const newDriver = new Driver({
              id,
              name,
              location,
              email,
              phoneNumber,
              distance,
              duration,
            });
            newDrivers.push(newDriver);
          }
        }
      );
    });
    return newDrivers;
  }
}
