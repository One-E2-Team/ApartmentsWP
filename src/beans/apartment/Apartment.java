package beans.apartment;

import java.time.LocalTime;
import java.util.ArrayList;

import beans.Reservation;
import beans.user.Host;

public class Apartment {

	private Status status = Status.INACTIVE;
	private boolean deleted = false;
	private ApartmentType type;
	private int guestNum, roomNum;
	private Location location;
	private Host host;
	private ArrayList<Comment> comments;
	private double nightStayPrice;
	private LocalTime checkIn, checkOut;
	private ArrayList<Amenity> amenities;
	private ArrayList<Reservation> reservations;
	//datumi
	//datumi
	//slike
}
