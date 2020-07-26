package beans;

import java.util.Date;

import beans.apartment.Apartment;
import beans.user.Guest;

public class Reservation {

	private int id;
	private Apartment apartment;
	private Date startDate;
	private int stayNights = 1;
	private double totalCost;
	private String message;
	private Guest guest;
	private ReservationStatus status;
	
	public Reservation() {
		super();
		id = 0;
		apartment = null;
		startDate = new Date();
		totalCost = 0;
		message = "";
		guest = null;
		status = ReservationStatus.CREATED;
	}
	public Reservation(int id, Apartment apartment, Date startDate, int stayNights, double totalCost, String message,
			Guest guest, ReservationStatus status) {
		super();
		this.id = id;
		this.apartment = apartment;
		this.startDate = startDate;
		this.stayNights = stayNights;
		this.totalCost = totalCost;
		this.message = message;
		this.guest = guest;
		this.status = status;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Apartment getApartment() {
		return apartment;
	}
	public void setApartment(Apartment apartment) {
		this.apartment = apartment;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public int getStayNights() {
		return stayNights;
	}
	public void setStayNights(int stayNights) {
		this.stayNights = stayNights;
	}
	public double getTotalCost() {
		return totalCost;
	}
	public void setTotalCost(double totalCost) {
		this.totalCost = totalCost;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Guest getGuest() {
		return guest;
	}
	public void setGuest(Guest guest) {
		this.guest = guest;
	}
	public ReservationStatus getStatus() {
		return status;
	}
	public void setStatus(ReservationStatus status) {
		this.status = status;
	}
}
