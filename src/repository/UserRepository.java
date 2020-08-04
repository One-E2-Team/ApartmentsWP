package repository;

import java.io.IOException;
import java.util.Collection;
import java.util.LinkedList;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import beans.user.User;

public class UserRepository {

	private static UserRepository instance = null;
	private String path = "C:/WebContent/db/users.json";
	private LinkedList<User> list = null;
	private Persistence<User> persistence = null;

	private UserRepository() {
		persistence = new Persistence<User>();
		list = persistence.read(path);
	}

	public static UserRepository getInstance() {
		if (instance == null)
			instance = new UserRepository();
		return instance;
	}

	@SuppressWarnings("unchecked")
	public synchronized Collection<User> getAll() {
		try {
			return Persistence.repositoryMapper.readValue(Persistence.repositoryMapper.writeValueAsString(list),
					list.getClass());
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return persistence.read(path);
	}

	public synchronized User create(User user) {
		for (User u : list)
			if (u.getUsername().equals(user.getUsername()))
				return null;
		try {
			list.add(Persistence.repositoryMapper.readValue(Persistence.repositoryMapper.writeValueAsString(user),
					user.getClass()));
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		persistence.save(list, path);
		return user;
	}

	public synchronized User read(String username) {
		for (User user : list)
			if (user.getUsername().equals(username))
				try {
					return Persistence.repositoryMapper.readValue(Persistence.repositoryMapper.writeValueAsString(user),
							user.getClass());
				} catch (JsonParseException e) {
					e.printStackTrace();
					break;
				} catch (JsonMappingException e) {
					e.printStackTrace();
					break;
				} catch (JsonProcessingException e) {
					e.printStackTrace();
					break;
				} catch (IOException e) {
					e.printStackTrace();
					break;
				}
		return null;
	}

	public synchronized void update(User user) {
		for (int i = 0; i < list.size(); i++)
			if (list.get(i).getUsername().equals(user.getUsername())) {
				list.set(i, user);
				persistence.save(list, path);
				return;
			}
	}

	public synchronized void delete(String username) {
		for (User user : list)
			if (user.getUsername().equals(username)) {
				user.setBlocked(true);
				break;
			}
		persistence.save(list, path);
	}
}
