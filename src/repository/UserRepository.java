package repository;

import java.util.Collection;
import java.util.LinkedList;

import beans.user.User;
import repository.persistence.Persistence;

public class UserRepository {

	private static UserRepository instance = null;
	private String path = "WebContent/db/users.json";
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

	public synchronized Collection<User> getAll() {
		return persistence.read(path);
	}

	public synchronized User create(User user) {
		for (User u : list)
			if (u.getUsername().equals(user.getUsername()))
				return null;
		list.add(user);
		persistence.save(list, path);
		return user;
	}

	public synchronized User read(String username) {
		for (User user : list)
			if (user.getUsername().equals(username))
				return user;
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
		read(username).setBlocked(true);
		persistence.save(list, path);
	}
}
