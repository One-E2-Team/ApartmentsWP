package beans;

import java.util.Date;

public class Reservation {

	private int id;
	private int apartmentId;
	private Date startDate;
	private int stayNights = 1;
	private double totalCost;
	private String message;
	private String guestId;
	private ReservationStatus status;

	public Reservation() {
		super();
		id = 0;
		apartmentId = 0;
		startDate = new Date();
		totalCost = 0;
		message = "";
		guestId = "";
		status = ReservationStatus.CREATED;
	}

	public Reservation(int id, int apartmentId, Date startDate, int stayNights, double totalCost, String message,
			String guestId, ReservationStatus status) {
		super();
		this.id = id;
		this.apartmentId = apartmentId;
		this.startDate = startDate;
		this.stayNights = stayNights;
		this.totalCost = totalCost;
		this.message = message;
		this.guestId = guestId;
		this.status = status;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getApartmentId() {
		return apartmentId;
	}

	public void setApartmentId(int apartmentId) {
		this.apartmentId = apartmentId;
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

	public String getGuestId() {
		return guestId;
	}

	public void setGuestId(String guestId) {
		this.guestId = guestId;
	}

	public ReservationStatus getStatus() {
		return status;
	}

	public void setStatus(ReservationStatus status) {
		this.status = status;
	}
}
