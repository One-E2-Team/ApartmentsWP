package beans.user;

import java.util.ArrayList;

import beans.Reservation;
import beans.apartment.Apartment;

public class Guest extends User {

	private ArrayList<Apartment> rentedApartments;
	private ArrayList<Reservation> reservations;
	
	public Guest() {
		super();
		rentedApartments = new ArrayList<Apartment>();
		reservations = new ArrayList<Reservation>();
	}
	public Guest(String username, String hashedPassword, String name, String surname, Sex sex, Role role,
			boolean blocked, ArrayList<Apartment> rentedApartments, ArrayList<Reservation> reservations) {
		super(username, hashedPassword, name, surname, sex, role, blocked);
		this.rentedApartments = rentedApartments;
		this.reservations = reservations;
	}
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
