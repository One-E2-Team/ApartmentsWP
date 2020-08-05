package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.apartment.Amenity;
import beans.user.Role;
import beans.user.User;
import repository.AmenityRepository;

@Path("/apartment")
public class ApartmentService {

	@GET
	@Path("/getAllAmenities")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenity> getAllAmenities(@Context HttpServletRequest request) {
		User user = (User) request.getSession().getAttribute("user");
		if(user == null || user.getRole()==Role.GUEST) return null;
		Collection<Amenity> ret = new ArrayList<Amenity>();
		for (Amenity amenity : AmenityRepository.getInstance().getAll()) {
			if (!amenity.isDeleted())
				ret.add(amenity);
		}
		return ret;
	}

}
