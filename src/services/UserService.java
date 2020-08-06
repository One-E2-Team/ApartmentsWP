package services;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.user.Administrator;
import beans.user.Guest;
import beans.user.User;
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
		newUser.setRentedApartmentIds(new ArrayList<Integer>());
		newUser.setReservationIds(new ArrayList<Integer>());
		User existing = UserRepository.getInstance().create(newUser);
		if (existing == null)
			return null; // TODO: proper error message
		request.getSession(true).setAttribute("user", newUser);
		return newUser;
	}

	@PUT
	@Path("/editProfile")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User editUser(@Context HttpServletRequest request, Administrator editedUser) {
		User user = (User) request.getSession().getAttribute("user");
		if (user == null)
			return null;
		user.setName(editedUser.getName());
		user.setSurname(editedUser.getSurname());
		user.setSex(editedUser.getSex());
		user.setHashedPassword(editedUser.getHashedPassword());
		UserRepository.getInstance().update(user);
		request.getSession(true).setAttribute("user", user);
		return user;
	}

}
