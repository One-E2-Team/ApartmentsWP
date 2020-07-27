package beans.user;

import java.util.ArrayList;

public class Host extends User {

	private ArrayList<Integer> rentableApartmentIds;

	public Host() {
		super();
		this.rentableApartmentIds = new ArrayList<Integer>();
	}

	public Host(String username, String hashedPassword, String name, String surname, Sex sex, Role role,
			boolean blocked, ArrayList<Integer> rentableApartmentIds) {
		super(username, hashedPassword, name, surname, sex, role, blocked);
		this.rentableApartmentIds = rentableApartmentIds;
	}

	public ArrayList<Integer> getRentableApartmentIds() {
		return rentableApartmentIds;
	}

	public void setRentableApartmentIds(ArrayList<Integer> rentableApartmentIds) {
		this.rentableApartmentIds = rentableApartmentIds;
	}
}
