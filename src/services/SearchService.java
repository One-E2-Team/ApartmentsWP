package services;

import java.text.DateFormat;
import java.text.FieldPosition;
import java.text.ParsePosition;
import java.util.Collection;
import java.util.Date;
import java.util.LinkedList;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import beans.ApartmentDeal;
import beans.apartment.Apartment;
import repository.ApartmentRepository;

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
		LinkedList<Apartment> apartments = new LinkedList<Apartment>();
		Collection<Apartment> allApartments = ApartmentRepository.getInstance().getAll();
		double angleTenKm = 10.0 * 360 / 40075; // Approximation, this defines be trapezoid shape on globe, since
												// latitude changes horizontal circumference
		if (fromDate == null && toDate == null && locationString == null && latitude == null && longitude == null
				&& priceMin == null && priceMax == null && roomsMin == null && roomsMax == null && personsMin == null
				&& personsMax == null)
			for (Apartment apartment : allApartments)
				apartments.add(apartment); // in production return null here
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
								|| Math.abs(apartment.getLocation().getLongitude() - longitude) <= angleTenKm))
					if (true/* slobodan u date dane */)
						apartments.add(apartment);
			}
		}
		return null;
	}
}
