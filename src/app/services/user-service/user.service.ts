import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { LogService } from "../log.service"
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class UserService {

	/**
	 * This is an user service
	 */
	@Output() fireIsLoggedIn: EventEmitter<any> = new EventEmitter<any>();

	// http headers
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

	/**
	 * Set up the url string to the env var
	 * Creates a new user object
	 */
	url: string = environment.userUri;
	user: User = new User();

	/**
	 * Constructor
	 * @param http An HTTP client object
	 * @param router A router
	 * @param log A log service
	 * @param authService An authorization service
	 */
	constructor(private http: HttpClient, private router: Router, private log: LogService, private authService: AuthService) { }

	/**
	 * The getAllUsers returns an array of all Users
	 * @returns User[] an array of users
	 */
	getAllUsers() {
		return this.http.get<User[]>(this.url);
	}

	/**
	 * The getUserById gets the user by the id
	 * @param idParam 
	 * @returns User returns the user that has the 
	 * corresponding id
	 */
	getUserById(idParam: number) {
		return this.http.get<User>(this.url + idParam).toPromise();
	}

	/**
	 * The getUserById2 gets the user by the id
	 * @param idParam2 
	 * @returns User returns the user that has the 
	 * corresponding id
	 */
	getUserById2(idParam2: String): Observable<User> {
		return this.http.get<User>(this.url + idParam2);
	}

	/**
	 * The createDriver is a POST method that switchs a Rider to a Driver
	 * @param user takes in the user information
	 * @param role takes in the new role to be set
	 */
	createDriver(user: User, role) {

		user.active = true;
		user.isDriver = false;
		user.isAcceptingRides = false;
		console.log(user);

		this.http.post(this.url, user, { observe: 'response' }).subscribe(
			(response) => {
				this.authService.user = response.body;
				this.fireIsLoggedIn.emit(response.body);

				if (role === 'driver') {
					this.router.navigate(['new/car']);
				} else {
					this.router.navigate(['home/drivers']);
				}
			},
			(error) => {
				this.log.error(error)
			}
		);

	}

	/**
	 * The addUser creates a new user
	 * @param User takes in the new user information
	 * @returns User that was created
	 */
	addUser(user: User): Observable<User> {
		return this.http.post<User>(this.url, user, { headers: this.headers });
	}

	/**
	 * The getEmitter returns the fireIsLoggedIn variable
	 * @returns fireIsLoggedIn
	 * 
	 */
	getEmitter() {
		return this.fireIsLoggedIn;
	}

	/**
	 * A PUT method that updates the user information
	 * @param isDriver 
	 * @param userId 
	 */
	updateIsDriver(isDriver, userId) {
		this.getUserById(userId)
			.then((response) => {
				this.user = response;
				this.user.isDriver = isDriver;
				this.user.isAcceptingRides = (this.user.active && isDriver);

				this.http.put(this.url + userId, this.user).subscribe(
					(response) => {
						this.authService.user = response;
						this.log.info(JSON.stringify(response));
					},
					(error) => this.log.error(error)
				);
			})
			.catch(e => {
				this.log.error(e)
			})
	}

	/**
	 * A PUT method that updates the preference of the user
	 * @param property 
	 * @param bool 
	 * @param userId 
	 */
	updatePreference(property, bool, userId) {
		this.getUserById(userId)
			.then((response) => {
				this.user = response;
				this.user[property] = bool;
				if (property === 'active' && bool === false) {
					this.user.isAcceptingRides = false;
				}

				this.http.put(this.url + userId, this.user).subscribe(
					(response) => {
						this.authService.user = response;
					},
					(error) => console.warn(error)
				);
			})
			.catch(e => {
				this.log.error(e);
			})
	}

	/**
	 * A PUT method that updates user's information
	 * @param user 
	 */
	updateUserInfo(user: User) {
		//console.log(user);
		return this.http.put(this.url, user).toPromise();
	}
	/**
	 * A GET method that retrieves a driver by Id
	 * @param id 
	 */
	getDriverById(id: number): Observable<any> {
		return this.http.get(this.url + id);
	}

	/**
	 * A PUT method that changes the isAcceptingRide variable
	 * @param data 
	 */
	changeDriverIsAccepting(data) {
		let id = data.userId;
		return this.http.put(this.url + id, data).toPromise()

	}
    /**
     * A GET method that shows all users
     */
	getRidersForLocation(location: string): Observable<any> {
		return this.http.get(this.url + '?is-driver=false&location=' + location)
	}
    /**
     * A GET method that shows all users
     */
	showAllUser(): Observable<any> {
		return this.http.get(this.url);
	}

    /**
     * body to send update data
     */
	private body: string;

	private httpOptions = {
		headers: new HttpHeaders({ "Content-Type": "application/json" }),
		observe: "response" as "body"
	}

    /**
     * A function that bans users.
     */
	banUser(user: User) {
		this.body = JSON.stringify(user);
		this.http.put(`${this.url + user.userId}`, this.body, this.httpOptions).subscribe();
	}
    /**
     * A function that gets the top 5 drivers based on distance
     */
	getRidersForLocation1(location: string): Observable<any> {
		return this.http.get(this.url + 'driver/' + location)
	}
    /**
     * The getRidersForBatch gets all drivers that are available,
	 * that are accepting rides, and have available seats.
	 * @returns list of Users
     */
	getRidersForBatch(batch: number): Observable<any> {
		return this.http.get(this.url + '?batch-num=' + batch)
	}
}