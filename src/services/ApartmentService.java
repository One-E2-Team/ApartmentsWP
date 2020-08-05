package services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.apartment.Amenity;
import beans.apartment.Apartment;
import beans.apartment.Comment;
import beans.user.Role;
import beans.user.User;
import repository.AmenityRepository;
import repository.ApartmentRepository;

@Path("/apartment")
public class ApartmentService {

	@GET
	@Path("/getAllAmenities")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenity> getAllAmenities(@Context HttpServletRequest request) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() == Role.GUEST)
			return null;
		Collection<Amenity> ret = new ArrayList<Amenity>();
		for (Amenity amenity : AmenityRepository.getInstance().getAll()) {
			if (!amenity.isDeleted())
				ret.add(amenity);
		}
		return ret;
	}

	@POST
	@Path("/addApartment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Apartment addApartment(@Context HttpServletRequest request, Apartment apartment) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.HOST)
			return null;
		apartment.setHostId(user.getUsername());
		apartment.setComments(new ArrayList<Comment>());
		apartment.setAmenityIds(new ArrayList<Integer>());
		apartment.setReservationIds(new ArrayList<Integer>());
		apartment.setPicturePaths(new ArrayList<String>());
		apartment.setRentableDates(new ArrayList<Date>());
		apartment.setAvailableDates(new ArrayList<Date>());
		return ApartmentRepository.getInstance().create(apartment);
	}

}
