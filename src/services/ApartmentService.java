package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import beans.apartment.Amenity;
import repository.AmenityRepository;

@Path("/apartment")
public class ApartmentService {

	@GET
	@Path("/getAllAmenities")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenity> getAllAmenities() {
		Collection<Amenity> ret = new ArrayList<Amenity>();
		for (Amenity amenity : AmenityRepository.getInstance().getAll()) {
			if (!amenity.isDeleted())
				ret.add(amenity);
		}
		return ret;
	}

}
