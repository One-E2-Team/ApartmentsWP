package beans.apartment;

import java.util.ArrayList;
import java.util.Date;

import beans.Reservation;
import beans.user.Host;

public class Apartment {

	private int id;
	private Status status = Status.INACTIVE;
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
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
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
