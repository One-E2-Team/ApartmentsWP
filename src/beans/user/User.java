package beans.user;

public abstract class User {

	private String username;
	private String hashedPassword;
	private String name, surname;
	private Sex sex;
	private Role role;
	private boolean blocked = false;

	public User() {
		super();
		username = "";
		hashedPassword = "";
		name = "";
		surname = "";
		sex = Sex.POTATO;
		role = Role.GUEST;
	}

	public User(String username, String hashedPassword, String name, String surname, Sex sex, Role role,
			boolean blocked) {
		super();
		this.username = username;
		this.hashedPassword = hashedPassword;
		this.name = name;
		this.surname = surname;
		this.sex = sex;
		this.role = role;
		this.blocked = blocked;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getHashedPassword() {
		return hashedPassword;
	}

	public void setHashedPassword(String hashedPassword) {
		this.hashedPassword = hashedPassword;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public boolean isBlocked() {
		return blocked;
	}

	public void setBlocked(boolean blocked) {
		this.blocked = blocked;
	}

	public Sex getSex() {
		return sex;
	}

	public void setSex(Sex sex) {
		this.sex = sex;
	}
}
