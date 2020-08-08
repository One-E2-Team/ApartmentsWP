package services;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.LinkedList;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import beans.ApartmentDeal;
import beans.Reservation;
import beans.apartment.Apartment;
import repository.ApartmentRepository;
import repository.NonWorkingDaysRepository;
import repository.ReservationRepository;

@Path("/search")
public class SearchService {

	@SuppressWarnings("deprecation")
	@GET
	@Path("/apartments")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<ApartmentDeal> searchApartments(@QueryParam("dateFrom") String dateF,
			@QueryParam("dateTo") String dateT, @QueryParam("location") String loc,
			@QueryParam("latitude") String latMap, @QueryParam("longitude") String longMap,
			@QueryParam("priceFrom") String priceF, @QueryParam("priceTo") String priceT,
			@QueryParam("roomsFrom") String roomsF, @QueryParam("roomsTo") String roomsT,
			@QueryParam("personsFrom") String personsF, @QueryParam("personsTo") String personsT) {
		Date fromDate = null;
		Date toDate = null;
		String locationString = null;
		Double latitude = null;
		Double longitude = null;
		Double priceMin = null;
		Double priceMax = null;
		Integer roomsMin = null;
		Integer roomsMax = null;
		Integer personsMin = null;
		Integer personsMax = null;
		try {
			fromDate = new Date(dateF);
		} catch (Exception e) {
		}
		try {
			toDate = new Date(dateT);
		} catch (Exception e) {
		}
		locationString = loc.toLowerCase();
		if (locationString.equals(""))
			locationString = null;
		try {
			latitude = Double.parseDouble(latMap);
		} catch (Exception e) {
		}
		try {
			longitude = Double.parseDouble(longMap);
		} catch (Exception e) {
		}
		try {
			priceMin = Double.parseDouble(priceF);
		} catch (Exception e) {
		}
		try {
			priceMax = Double.parseDouble(priceT);
		} catch (Exception e) {
		}
		try {
			roomsMin = Integer.parseInt(roomsF);
		} catch (Exception e) {
		}
		try {
			roomsMax = Integer.parseInt(roomsT);
		} catch (Exception e) {
		}
		try {
			personsMin = Integer.parseInt(personsF);
		} catch (Exception e) {
		}
		try {
			personsMax = Integer.parseInt(personsT);
		} catch (Exception e) {
		}
		LinkedList<ApartmentDeal> deals = new LinkedList<ApartmentDeal>();
		Collection<Apartment> allApartments = ApartmentRepository.getInstance().getAll();
		double angleTenKm = 10.0 * 360 / 40075; // Approximation, this defines be trapezoid shape on globe, since
												// latitude changes horizontal circumference
		if (fromDate == null && toDate == null && locationString == null && latitude == null && longitude == null
				&& priceMin == null && priceMax == null && roomsMin == null && roomsMax == null && personsMin == null
				&& personsMax == null) // in production return null here
			for (Apartment apartment : allApartments) {
				ApartmentDeal deal = new ApartmentDeal();
				deal.setApartment(apartment);
				deals.add(deal);
			}
		else {
			for (Apartment apartment : allApartments) {
				if ((personsMin == null || apartment.getGuestNum() >= personsMin)
						&& (personsMax == null || apartment.getGuestNum() <= personsMax)
						&& (roomsMin == null || apartment.getRoomNum() >= roomsMin)
						&& (roomsMax == null || apartment.getRoomNum() <= roomsMax)
						&& (locationString == null
								|| apartment.getLocation().getAddress().getCity().toLowerCase().contains(locationString)
								|| apartment.getLocation().getAddress().getCountry().toLowerCase()
										.contains(locationString))
						&& (latitude == null
								|| Math.abs(apartment.getLocation().getLatitude() - latitude) <= angleTenKm)
						&& (longitude == null
								|| Math.abs(apartment.getLocation().getLongitude() - longitude) <= angleTenKm)
						&& ((fromDate == null && toDate == null)
								|| apartmentFreeForDateSpan(apartment, fromDate, toDate))) {
					ApartmentDeal deal = new ApartmentDeal();
					deal.setApartment(apartment);
					deals.add(deal);
				}
			}
		}
		if (fromDate != null && toDate != null) {
			int duration = (int) ((toDate.getTime() - fromDate.getTime()) / (60 * 60 * 24 * 1000));
			double costFactor = 0;
			LinkedList<Date> nwd = NonWorkingDaysRepository.get(Calendar.getInstance().get(Calendar.YEAR)); // TODO
			for (int i = 0; i < duration; i++) {
				Date date = new Date(fromDate.getTime() + i * 60 * 60 * 24 * 1000);
				boolean foundHoliday = false;
				for (Date d : nwd) {
					if (d.getTime() == date.getTime()) {
						foundHoliday = true;
						break;
					}
				}
				if (foundHoliday)
					costFactor += 1.05;
				else
					costFactor += 1;
			}
			Calendar cal = Calendar.getInstance();
			cal.setTime(fromDate);
			if (costFactor == (double) duration && duration >= 2 && duration <= 3
					&& cal.get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY)
				costFactor *= 0.9;
			for (ApartmentDeal ad : deals)
				ad.setDeal(costFactor * ad.getApartment().getNightStayPrice());
		}
		return deals.size() == 0 ? null : deals;
	}

	private boolean apartmentFreeForDateSpan(Apartment apartment, Date from, Date to) {
		for (int resId : apartment.getReservationIds()) {
			Reservation reservation = ReservationRepository.getInstance().read(resId);
			if (!(to.before(reservation.getStartDate()) || (from.after(reservation.getStartDate())
					&& from.after(new Date(reservation.getStartDate().getTime()
							+ reservation.getStayNights() * 60 * 60 * 24 * 1000)))))
				return false;
		}
		return true;
	}
}
