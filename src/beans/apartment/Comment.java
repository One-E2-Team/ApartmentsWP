package beans.apartment;

import beans.user.Guest;

public class Comment {

	private Guest guest;
	private int apartmentId;
	private int mark;
	private String text;
	
	public Comment() {
		super();
		guest = null;
		apartmentId = 0;
		mark = 0;
		text = "";
	}
	public Comment(Guest guest, int apartmentId, int mark, String text) {
		super();
		this.guest = guest;
		this.apartmentId = apartmentId;
		this.mark = mark;
		this.text = text;
	}
	public Guest getGuest() {
		return guest;
	}
	public void setGuest(Guest guest) {
		this.guest = guest;
	}
	public int getMark() {
		return mark;
	}
	public void setMark(int mark) {
		this.mark = mark;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public int getApartmentId() {
		return apartmentId;
	}
	public void setApartmentId(int apartmentId) {
		this.apartmentId = apartmentId;
	}
	
	
}
