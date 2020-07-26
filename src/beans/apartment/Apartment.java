package beans.apartment;

import java.util.ArrayList;
import java.util.Date;

import beans.Reservation;
import beans.user.Host;

public class Apartment {

	private int id;
	private ApartmentStatus status = ApartmentStatus.INACTIVE;
	private boolean deleted = false;
	private ApartmentType type;
	private int guestNum, roomNum;
	private Location location;
	private Host host;
	private ArrayList<Comment> comments;
	private double nightStayPrice;
	private int checkIn = 2, checkOut = 10;
	private Meridiem checkInMeridiem = Meridiem.PM, checkOutMeridiem = Meridiem.AM;
	private ArrayList<Amenity> amenities;
	private ArrayList<Reservation> reservations;
	private ArrayList<String> picturePaths;
	private ArrayList<Date> rentableDates;
	private ArrayList<Date> availableDates;
	
	public Apartment() {
		super();
		this.id = 0;
		this.type = ApartmentType.APARTMENT;
		this.guestNum = 0;
		this.roomNum = 1;
		this.location = new Location();
		this.host = null;
		this.comments = new ArrayList<Comment>();
		this.nightStayPrice = 0;
		this.amenities = new ArrayList<Amenity>();
		this.reservations = new ArrayList<Reservation>();
		this.picturePaths = new ArrayList<String>();
		this.rentableDates = new ArrayList<Date>();
		this.availableDates = new ArrayList<Date>();
	}
	public Apartment(int id, ApartmentStatus status, boolean deleted, ApartmentType type, int guestNum, int roomNum,
			Location location, Host host, ArrayList<Comment> comments, double nightStayPrice, int checkIn, int checkOut,
			Meridiem checkInMeridiem, Meridiem checkOutMeridiem, ArrayList<Amenity> amenities,
			ArrayList<Reservation> reservations, ArrayList<String> picturePaths, ArrayList<Date> rentableDates,
			ArrayList<Date> availableDates) {
		super();
		this.id = id;
		this.status = status;
		this.deleted = deleted;
		this.type = type;
		this.guestNum = guestNum;
		this.roomNum = roomNum;
		this.location = location;
		this.host = host;
		this.comments = comments;
		this.nightStayPrice = nightStayPrice;
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.checkInMeridiem = checkInMeridiem;
		this.checkOutMeridiem = checkOutMeridiem;
		this.amenities = amenities;
		this.reservations = reservations;
		this.picturePaths = picturePaths;
		this.rentableDates = rentableDates;
		this.availableDates = availableDates;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public ApartmentStatus getStatus() {
		return status;
	}
	public void setStatus(ApartmentStatus status) {
		this.status = status;
	}
	public boolean isDeleted() {
		return deleted;
	}
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	public ApartmentType getType() {
		return type;
	}
	public void setType(ApartmentType type) {
		this.type = type;
	}
	public int getGuestNum() {
		return guestNum;
	}
	public void setGuestNum(int guestNum) {
		this.guestNum = guestNum;
	}
	public int getRoomNum() {
		return roomNum;
	}
	public void setRoomNum(int roomNum) {
		this.roomNum = roomNum;
	}
	public Location getLocation() {
		return location;
	}
	public void setLocation(Location location) {
		this.location = location;
	}
	public Host getHost() {
		return host;
	}
	public void setHost(Host host) {
		this.host = host;
	}
	public ArrayList<Comment> getComments() {
		return comments;
	}
	public void setComments(ArrayList<Comment> comments) {
		this.comments = comments;
	}
	public double getNightStayPrice() {
		return nightStayPrice;
	}
	public void setNightStayPrice(double nightStayPrice) {
		this.nightStayPrice = nightStayPrice;
	}
	public int getCheckIn() {
		return checkIn;
	}
	public void setCheckIn(int checkIn) {
		this.checkIn = checkIn;
	}
	public int getCheckOut() {
		return checkOut;
	}
	public void setCheckOut(int checkOut) {
		this.checkOut = checkOut;
	}
	public Meridiem getCheckInMeridiem() {
		return checkInMeridiem;
	}
	public void setCheckInMeridiem(Meridiem checkInMeridiem) {
		this.checkInMeridiem = checkInMeridiem;
	}
	public Meridiem getCheckOutMeridiem() {
		return checkOutMeridiem;
	}
	public void setCheckOutMeridiem(Meridiem checkOutMeridiem) {
		this.checkOutMeridiem = checkOutMeridiem;
	}
	public ArrayList<Amenity> getAmenities() {
		return amenities;
	}
	public void setAmenities(ArrayList<Amenity> amenities) {
		this.amenities = amenities;
	}
	public ArrayList<Reservation> getReservations() {
		return reservations;
	}
	public void setReservations(ArrayList<Reservation> reservations) {
		this.reservations = reservations;
	}
	public ArrayList<String> getPicturePaths() {
		return picturePaths;
	}
	public void setPicturePaths(ArrayList<String> picturePaths) {
		this.picturePaths = picturePaths;
	}
	public ArrayList<Date> getRentableDates() {
		return rentableDates;
	}
	public void setRentableDates(ArrayList<Date> rentableDates) {
		this.rentableDates = rentableDates;
	}
	public ArrayList<Date> getAvailableDates() {
		return availableDates;
	}
	public void setAvailableDates(ArrayList<Date> availableDates) {
		this.availableDates = availableDates;
	}
}
