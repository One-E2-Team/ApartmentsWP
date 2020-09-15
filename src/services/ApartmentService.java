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
	public Apartment getApartment(@QueryParam("id") String id) {
		Integer apartmentId = null;
		try {
			apartmentId = Integer.parseInt(id);
		} catch (Exception e) {
			return null;
		}
		if (apartmentId != null) {
			Apartment ret = ApartmentRepository.getInstance().read(apartmentId);
			if (ret != null)
				return ret;
		}
		return null;
	}

	@PUT
	@Path("/editApartment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Apartment editApartment(@Context HttpServletRequest request, Apartment apartment) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null)
			return null;
		ApartmentRepository.getInstance().update(apartment);
		return apartment;
	}

	@GET
	@Path("/getAllComments")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Comment> getAllComments(@Context HttpServletRequest request, @QueryParam("id") String id) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.ADMINISTRATOR)
			return null;
		Integer apartmentId = null;
		try {
			apartmentId = Integer.parseInt(id);
		} catch (Exception e) {
			return null;
		}
		if (apartmentId != null) {
			Apartment apartment = ApartmentRepository.getInstance().read(apartmentId);
			if (apartment != null) {
				return apartment.getComments();
			}
		}
		return null;
	}

	@GET
	@Path("/getAllCommentsByHost")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Comment> getAllCommentsByHost(@Context HttpServletRequest request, @QueryParam("id") String id) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.HOST)
			return null;
		Integer apartmentId = null;
		try {
			apartmentId = Integer.parseInt(id);
		} catch (Exception e) {
			return null;
		}
		if (apartmentId != null) {
			Apartment apartment = ApartmentRepository.getInstance().read(apartmentId);
			if (apartment != null) {
				Collection<Comment> ret = new ArrayList<Comment>();
				if (((Host) user).getRentableApartmentIds().contains(apartment.getId())) {
					ret.addAll(apartment.getComments());
					return ret;
				}
			}
		}
		return null;
	}
	
	@GET
	@Path("/getAllApprovedComments")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Comment> getAllApprovedComments(@QueryParam("id") String id) {
		Integer apartmentId = null;
		try {
			apartmentId = Integer.parseInt(id);
		} catch (Exception e) {
			return null;
		}
		if (apartmentId != null) {
			Apartment apartment = ApartmentRepository.getInstance().read(apartmentId);
			if (apartment != null) {
				Collection<Comment> ret = new ArrayList<Comment>();
				for (Comment comment : apartment.getComments()) {
					if(comment.getStatus() == CommentStatus.APPROVED)
						ret.add(comment);
				}
				return ret;
			}
		}
		return null;
	}

}
