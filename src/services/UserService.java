package services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Reservation;
import beans.user.Administrator;
import beans.user.Guest;
import beans.user.Host;
import beans.user.Role;
import beans.user.User;
import repository.ReservationRepository;
import repository.UserRepository;

@Path("/user")
public class UserService {

	@POST
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User login(@Context HttpServletRequest request, Administrator userReq) {
		if ((User) request.getSession().getAttribute("user") != null)
			request.getSession().invalidate();
		User ret = UserRepository.getInstance().read(userReq.getUsername());
		if (ret != null && ret.getHashedPassword().equals(userReq.getHashedPassword()))
			request.getSession(true).setAttribute("user", ret);
		else
			ret = null;
		return ret;
	}

	@GET
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean logout(@Context HttpServletRequest request) {
		User user = (User) request.getSession().getAttribute("user");
		if (user != null)
			request.getSession().invalidate();
		return true;
	}

	@GET
	@Path("/me")
	@Produces(MediaType.APPLICATION_JSON)
	public User getMe(@Context HttpServletRequest request) {
		return (User) request.getSession().getAttribute("user");
	}

	@POST
	@Path("/register")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User register(@Context HttpServletRequest request, Guest newUser) {
		if ((User) request.getSession().getAttribute("user") != null)
			request.getSession().invalidate();
		User existing = UserRepository.getInstance().create(newUser);
		if (existing == null)
			return null;
		request.getSession(true).setAttribute("user", newUser);
		return newUser;
	}

	@PUT
	@Path("/editProfile")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User editUser(@Context HttpServletRequest request, Administrator editedUser) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getUsername() != editedUser.getUsername())
			return null;
		user.setName(editedUser.getName());
		user.setSurname(editedUser.getSurname());
		user.setSex(editedUser.getSex());
		user.setHashedPassword(editedUser.getHashedPassword());
		UserRepository.getInstance().update(user);
		request.getSession(true).setAttribute("user", user);
		return user;
	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> getAllUsers(@Context HttpServletRequest request) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.ADMINISTRATOR)
			return null;
		return UserRepository.getInstance().getAll();
	}

	@GET
	@Path("/getAllByHost")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> getAllByHost(@Context HttpServletRequest request) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null || user.getRole() != Role.HOST)
			return null;
		Collection<User> ret = new ArrayList<User>();
		Collection<String> usernames = new HashSet<String>();
		for (Reservation reservation : ReservationRepository.getInstance().getAll())
			if (((Host) user).getRentableApartmentIds().contains(reservation.getApartmentId()))
				usernames.add(reservation.getGuestId());
		for (String username : usernames)
			ret.add(UserRepository.getInstance().read(username));
		return ret;
	}

}
