package beans.user;

import java.util.ArrayList;

import beans.apartment.Apartment;

public class Host extends User {

	private ArrayList<Apartment> rentableApartments;

	public ArrayList<Apartment> getRentableApartments() {
		return rentableApartments;
	}

	public void setRentableApartments(ArrayList<Apartment> rentableApartments) {
		this.rentableApartments = rentableApartments;
	}
}
