package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.apartment.Amenity;
import beans.apartment.Apartment;
import beans.apartment.Comment;
import beans.apartment.CommentStatus;
import beans.user.Host;
import beans.user.Role;
import beans.user.User;
import repository.AmenityRepository;
import repository.ApartmentRepository;
import repository.UserRepository;

@Path("/apartment")
public class ApartmentService {

	@GET
	@Path("/getAllVisibleAmenities")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenity> getAllVisibleAmenities(@Context HttpServletRequest request) {
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
		Apartment ret = ApartmentRepository.getInstance().create(apartment);
		((Host) user).getRentableApartmentIds().add(ret.getId());
		UserRepository.getInstance().update(user);
		return ret;
	}

	@GET
	@Path("/getApartment")
	@Produces(MediaType.APPLICATION_JSON)
	public Apartment getApartment(@Context HttpServletRequest request, @QueryParam("id") String id) {
		Integer apartmentId = null;
		User user = (User) request.getSession().getAttribute("user");
		try {
			apartmentId = Integer.parseInt(id);
		} catch (Exception e) {
			return null;
		}
		if (apartmentId != null) {
			Apartment ret = ApartmentRepository.getInstance().read(apartmentId);
			if (ret != null) {
				if (user != null && ((user.getRole() == Role.HOST
						&& ((Host) user).getRentableApartmentIds().contains(ret.getId()))
						|| user.getRole() == Role.ADMINISTRATOR)) {
					return ret;
				} else {
					ArrayList<Comment> availableComments = new ArrayList<Comment>();
					for (Comment comment : ret.getComments()) {
						if (comment.getStatus() == CommentStatus.APPROVED)
							availableComments.add(comment);
					}
					ret.setComments(availableComments);
				}
				return ret;
			}
		}
		return null;
	}

	@PUT
	@Path("/addComment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Apartment addComment(@Context HttpServletRequest request, Apartment apartment) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.GUEST)
			return null;
		Apartment newApartment = ApartmentRepository.getInstance().read(apartment.getId());
		if (newApartment != null) {
			newApartment.getComments().addAll(apartment.getComments());
			ApartmentRepository.getInstance().update(newApartment);
		}
		return apartment;
	}

	@PUT
	@Path("/editComments")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Apartment editComments(@Context HttpServletRequest request, Apartment apartment) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.HOST)
			return null;
		ApartmentRepository.getInstance().update(apartment);
		return apartment;
	}

	@PUT
	@Path("/deleteAmenity")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Amenity deleteAmenity(@Context HttpServletRequest request, int id) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.ADMINISTRATOR)
			return null;
		AmenityRepository.getInstance().delete(id);
		return AmenityRepository.getInstance().read(id);
	}
	
	@PUT
	@Path("/editAmenity")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Amenity editAmenity(@Context HttpServletRequest request, Amenity amenity) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.ADMINISTRATOR)
			return null;
		AmenityRepository.getInstance().update(amenity);
		return amenity;
	}
	
	@POST
	@Path("/addAmenity")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Amenity addAmenity(@Context HttpServletRequest request, Amenity amenity) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.ADMINISTRATOR)
			return null;
		return AmenityRepository.getInstance().create(amenity);
	}
}
