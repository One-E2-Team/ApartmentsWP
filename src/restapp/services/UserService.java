package restapp.services;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.user.Guest;
import beans.user.Role;
import beans.user.User;
import repository.UserRepository;

@Path("/user")
public class UserService {

	@POST
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User login(@Context HttpServletRequest request, User userReq) {
		System.out.println("sdas");
		if ((User) request.getSession().getAttribute("user") != null)
			request.getSession().invalidate();
		User ret = UserRepository.getInstance().read(userReq.getUsername());
		if (ret != null)
			request.getSession(true).setAttribute("user", ret);
		return ret;
	}

	@POST
	@Path("/register")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User register(@Context HttpServletRequest request, Guest newUser) {
		if ((User) request.getSession().getAttribute("user") != null)
			request.getSession().invalidate();
		User existing = UserRepository.getInstance().create(newUser);
		if (existing != null)
			return null;
		newUser.setRole(Role.GUEST);
		newUser.setRentedApartmentIds(new ArrayList<Integer>());
		newUser.setReservationIds(new ArrayList<Integer>());
		User ret = UserRepository.getInstance().create(newUser);
		request.getSession(true).setAttribute("user", ret);
		return ret;
	}

}
