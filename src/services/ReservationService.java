package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Reservation;
import beans.user.Guest;
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
		if (user == null || user.getRole() == Role.ADMINISTRATOR)
			return null;
		return ReservationRepository.getInstance().getAll();
	}

	@GET
	@Path("/getAllByHost")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getAllByHost(@Context HttpServletRequest request, Host host) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() == Role.HOST)
			return null;
		Collection<Reservation> ret = new ArrayList<Reservation>();
		for (Reservation reservation : ReservationRepository.getInstance().getAll())
			if (host.getRentableApartmentIds().contains(reservation.getApartmentId())) {
				ret.add(reservation);
			}
		return ret;
	}
	
	@GET
	@Path("/getAllByGuest")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getAllByGuest(@Context HttpServletRequest request, Guest guest) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() == Role.GUEST)
			return null;
		Collection<Reservation> ret = new ArrayList<Reservation>();
		for (Reservation reservation : ReservationRepository.getInstance().getAll())
			if (reservation.getGuestId().equals(guest.getUsername())) {
				ret.add(reservation);
			}
		return ret;
	}

}
