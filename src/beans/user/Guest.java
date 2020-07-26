package beans.user;

import java.util.ArrayList;

import beans.Reservation;
import beans.apartment.Apartment;

public class Guest extends User {

	private ArrayList<Apartment> rentedApartments;
	private ArrayList<Reservation> reservations;
	
	public ArrayList<Apartment> getRentedApartments() {
		return rentedApartments;
	}
	public void setRentedApartments(ArrayList<Apartment> rentedApartments) {
		this.rentedApartments = rentedApartments;
	}
	public ArrayList<Reservation> getReservations() {
		return reservations;
	}
	public void setReservations(ArrayList<Reservation> reservations) {
		this.reservations = reservations;
	}
}
