package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Reservation;
import beans.ReservationStatus;
import beans.user.Host;
import beans.user.Role;
import beans.user.User;
import repository.ReservationRepository;

@Path("/reservation")
public class ReservationService {

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getAllReservations(@Context HttpServletRequest request) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.ADMINISTRATOR)
			return null;
		return ReservationRepository.getInstance().getAll();
	}

	@GET
	@Path("/getAllByHost")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getAllByHost(@Context HttpServletRequest request) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.HOST)
			return null;
		Collection<Reservation> ret = new ArrayList<Reservation>();
		for (Reservation reservation : ReservationRepository.getInstance().getAll())
			if (((Host) user).getRentableApartmentIds().contains(reservation.getApartmentId())) {
				ret.add(reservation);
			}
		return ret;
	}

	@GET
	@Path("/getAllByGuest")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getAllByGuest(@Context HttpServletRequest request) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.GUEST)
			return null;
		Collection<Reservation> ret = new ArrayList<Reservation>();
		for (Reservation reservation : ReservationRepository.getInstance().getAll())
			if (reservation.getGuestId().equals(user.getUsername())) {
				ret.add(reservation);
			}
		return ret;
	}

	@PUT
	@Path("acceptReservation")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Boolean acceptReservation(@Context HttpServletRequest request, int id) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.HOST)
			return null;
		Reservation reservation = ReservationRepository.getInstance().read(id);
		reservation.setStatus(ReservationStatus.ACCEPTED);
		ReservationRepository.getInstance().update(reservation);
		return true;
	}

}
