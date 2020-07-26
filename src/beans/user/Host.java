package beans.user;

import java.util.ArrayList;

import beans.apartment.Apartment;

public class Host extends User {

	private ArrayList<Apartment> rentableApartments;

	public Host() {
		super();
		this.rentableApartments = new ArrayList<Apartment>();
	}

	public Host(String username, String hashedPassword, String name, String surname, Sex sex, Role role,
			boolean blocked, ArrayList<Apartment> rentableApartments) {
		super(username, hashedPassword, name, surname, sex, role, blocked);
		this.rentableApartments = rentableApartments;
	}

	public ArrayList<Apartment> getRentableApartments() {
		return rentableApartments;
	}

	public void setRentableApartments(ArrayList<Apartment> rentableApartments) {
		this.rentableApartments = rentableApartments;
	}
}
