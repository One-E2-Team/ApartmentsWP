package services;

import java.util.Collection;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import beans.ApartmentDeal;

@Path("/search")
public class SearchService {

	@GET
	@Path("/apartments")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<ApartmentDeal> searchApartments(@QueryParam("dateFrom") String dateFrom,
			@QueryParam("dateTo") String dateTo, @QueryParam("location") String location,
			@QueryParam("latitude") String latitude, @QueryParam("longitude") String longitude,
			@QueryParam("priceFrom") String priceFrom, @QueryParam("priceTo") String priceTo,
			@QueryParam("roomsFrom") String roomsFrom, @QueryParam("roomsTo") String roomsTo,
			@QueryParam("personsFrom") String personsFrom, @QueryParam("personsTo") String personsTo) {
		return null;
	}
}
