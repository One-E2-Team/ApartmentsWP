package beans.apartment;

public class Comment {

	private String guestId;
	private int apartmentId;
	private int mark;
	private String text;
	private CommentStatus status = CommentStatus.WAIT;

	public Comment() {
		super();
		guestId = "";
		apartmentId = 0;
		mark = 0;
		text = "";
	}

	public Comment(String guestId, int apartmentId, int mark, String text, CommentStatus status) {
		super();
		this.guestId = guestId;
		this.apartmentId = apartmentId;
		this.mark = mark;
		this.text = text;
		this.status = status;
	}

	public String getGuestId() {
		return guestId;
	}

	public void setGuestId(String guestId) {
		this.guestId = guestId;
	}

	public int getMark() {
		return mark;
	}

	public void setMark(int mark) {
		this.mark = mark;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getApartmentId() {
		return apartmentId;
	}

	public void setApartmentId(int apartmentId) {
		this.apartmentId = apartmentId;
	}

	public CommentStatus getStatus() {
		return status;
	}

	public void setStatus(CommentStatus status) {
		this.status = status;
	}

}
