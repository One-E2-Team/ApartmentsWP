package services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.ApartmentDeal;
import beans.Reservation;
import beans.ReservationStatus;
import beans.apartment.Amenity;
import beans.apartment.Apartment;
import beans.apartment.Comment;
import beans.apartment.CommentStatus;
import beans.user.Host;
import beans.user.Role;
import beans.user.User;
import repository.AmenityRepository;
import repository.ApartmentRepository;
import repository.ReservationRepository;
import repository.UserRepository;

@Path("/apartment")
public class ApartmentService {

	@GET
	@Path("/getAllVisibleAmenities")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenity> getAllVisibleAmenities(@Context HttpServletRequest request, @Context HttpServletResponse response, @HeaderParam("Referer") String referer) throws IOException {
		Object obj = request.getSession().getAttribute("user");
		if(referer.contains("addApartment.html") && (obj==null || !((User) obj).getRole().equals(Role.HOST)))
			response.sendError(403, "{\"message\":\"ZABRANJENO JE RADOSE!\"}");
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

	@PUT
	@Path("editApartment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Apartment editApartment(@Context HttpServletRequest request, Apartment apartment) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() == Role.GUEST)
			return null;
		apartment.setHostId(user.getUsername());
		ApartmentRepository.getInstance().update(apartment);
		return apartment;
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

	@GET
	@Path("/{id}/getDeal/{dateFrom}/{nights}")
	@Produces(MediaType.APPLICATION_JSON)
	public ApartmentDeal getDeal(@PathParam("id") int id, @PathParam("dateFrom") long dateFrom, @PathParam("nights") int nights) {
		Reservation reservation = new Reservation();
		reservation.setApartmentId(id);
		reservation.setStartDate(new Date(dateFrom));
		reservation.setStayNights(nights);
		ApartmentDeal ad = new ApartmentDeal();
		ad.setApartment(ApartmentRepository.getInstance().read(reservation.getApartmentId()));
		ad.setDeal(0.0);
		Date toDate = new Date(
				reservation.getStartDate().getTime() + reservation.getStayNights() * 60 * 60 * 24 * 1000);
		if (SearchService.apartmentFreeForDateSpan(ad.getApartment(), reservation.getStartDate(), toDate))
			ad.setDeal(SearchService.getCostFactorForDates(reservation.getStartDate(), toDate)
					* ad.getApartment().getNightStayPrice());
		return ad;
	}

	@POST
	@Path("/{id}/makeReservation/{dateFrom}/{nights}/{message}")
	@Produces(MediaType.APPLICATION_JSON)
	public Reservation makeReservation(@Context HttpServletRequest request, @PathParam("id") int id, @PathParam("dateFrom") long dateFrom, @PathParam("nights") int nights, @PathParam("message") String message) {
		Reservation reservation = new Reservation();
		reservation.setApartmentId(id);
		reservation.setStartDate(new Date(dateFrom));
		reservation.setStayNights(nights);
		reservation.setMessage(message);
		Date toDate = new Date(reservation.getStartDate().getTime() + reservation.getStayNights() * 60 * 60 * 24 * 1000);
		if(SearchService.apartmentFreeForDateSpan(ApartmentRepository.getInstance().read(reservation.getApartmentId()), reservation.getStartDate(), toDate)) {
			reservation.setTotalCost(SearchService.getCostFactorForDates(reservation.getStartDate(), toDate) * ApartmentRepository.getInstance().read(reservation.getApartmentId()).getNightStayPrice());
			reservation.setStatus(ReservationStatus.CREATED);
			reservation.setGuestId(((User)request.getSession().getAttribute("user")).getUsername());
			Apartment a = ApartmentRepository.getInstance().read(id);
			reservation = ReservationRepository.getInstance().create(reservation);
			a.getReservationIds().add(reservation.getId());
			ApartmentRepository.getInstance().update(a);
			return reservation;
		}
		return null;
	}

	@SuppressWarnings("deprecation")
	@GET
	@Path("/{id}/getUnavailabeDates")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Date> getUnavailabeDates(@PathParam("id") int id) {
		ArrayList<Date> ret = new ArrayList<Date>();
		for (Date date = new Date(); date.before(new Date(Calendar.getInstance().get(Calendar.YEAR), 1,
				1)); date = new Date(date.getTime() + 60 * 60 * 24 * 1000)) {
			if (!SearchService.apartmentFreeForDateSpan(ApartmentRepository.getInstance().read(id), date,
					new Date(date.getTime() + 60 * 60 * 24 * 1000)))
				ret.add(date);
		}
		return ret;
	}
	/*
	 * @POST
	 * 
	 * @Path("/{id}/addPicture")
	 * 
	 * @Produces(MediaType.APPLICATION_JSON) public String addPicture(@Context
	 * HttpServletRequest request, @PathParam("id") int id, @FormParam("img")
	 * InputStream uploadedInputStream) { ArrayList<String> l =
	 * ApartmentRepository.getInstance().read(id).getPicturePaths(); int num = 0;
	 * if(l.size()!=0) { int last =
	 * Integer.parseInt(l.get(l.size()-1).split("-")[1].split("\\.")[0]);
	 * 
	 * } return null; }
	 */
}
