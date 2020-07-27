package beans.user;

import java.util.ArrayList;

public class Guest extends User {

	private ArrayList<Integer> rentedApartmentIds;
	private ArrayList<Integer> reservationIds;

	public Guest() {
		super();
		rentedApartmentIds = new ArrayList<Integer>();
		reservationIds = new ArrayList<Integer>();
	}

	public Guest(String username, String hashedPassword, String name, String surname, Sex sex, Role role,
			boolean blocked, ArrayList<Integer> rentedApartmentIds, ArrayList<Integer> reservationIds) {
		super(username, hashedPassword, name, surname, sex, role, blocked);
		this.rentedApartmentIds = rentedApartmentIds;
		this.reservationIds = reservationIds;
	}

	public ArrayList<Integer> getRentedApartmentIds() {
		return rentedApartmentIds;
	}

	public void setRentedApartmentIds(ArrayList<Integer> rentedApartmentIds) {
		this.rentedApartmentIds = rentedApartmentIds;
	}

	public ArrayList<Integer> getReservationIds() {
		return reservationIds;
	}

	public void setReservationIds(ArrayList<Integer> reservationIds) {
		this.reservationIds = reservationIds;
	}
}
