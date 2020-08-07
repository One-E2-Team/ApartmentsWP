package beans;

import beans.apartment.Apartment;

public class ApartmentDeal {
	private double deal;
	private Apartment appartment;
	public double getDeal() {
		return deal;
	}
	public void setDeal(double deal) {
		this.deal = deal;
	}
	public Apartment getAppartment() {
		return appartment;
	}
	public void setAppartment(Apartment appartment) {
		this.appartment = appartment;
	}
}
