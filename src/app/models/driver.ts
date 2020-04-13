interface DriverProps {
    id: number;
    name: string;
    location: string;
    email: string;
    phoneNumber: string;
    distance: string;
    duration: string;
}

export class Driver {

    private driverProps: DriverProps;

    constructor(driverProps: DriverProps) {
        this.driverProps = driverProps;
    }

    get id(): number {
        return this.driverProps.id;
    }

    set id(id: number) {
        this.driverProps.id = id;
    }

    get name(): string {
        return this.driverProps.name;
    }

    set name(name: string) {
        this.driverProps.name = name;
    }

    get location(): string {
        return this.driverProps.location;
    }

    set location(location: string) {
        this.driverProps.location = location;
    }

    get email(): string {
        return this.driverProps.email;
    }

    set email(email: string) {
        this.driverProps.email = email;
    }

    get phoneNumber(): string {
        return this.driverProps.phoneNumber;
    }

    set phoneNumber(phoneNumber: string) {
        this.driverProps.phoneNumber = phoneNumber;
    }

    get distance(): string {
        return this.driverProps.distance;
    }

    set distance(distance: string) {
        this.driverProps.distance = distance;
    }

    get duration(): string {
        return this.driverProps.duration;
    }

    set duration(duration: string) {
        this.driverProps.duration = duration;
    }

}
