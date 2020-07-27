package beans.user;

public class Administrator extends User {

	public Administrator() {
		super();
	}

	public Administrator(String username, String hashedPassword, String name, String surname, Sex sex, Role role,
			boolean blocked) {
		super(username, hashedPassword, name, surname, sex, role, blocked);
	}

}
