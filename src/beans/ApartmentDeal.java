package beans;

import beans.apartment.Apartment;

public class ApartmentDeal {
	private Double deal = null;;
	private Apartment apartment;
	public Double getDeal() {
		return deal;
	}
	public void setDeal(Double deal) {
		this.deal = deal;
	}
	public Apartment getApartment() {
		return apartment;
	}
	public void setApartment(Apartment apartment) {
		this.apartment = apartment;
	}
}
