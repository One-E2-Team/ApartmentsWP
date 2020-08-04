package beans.apartment;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum CommentStatus {
	@JsonProperty("WAIT")
	WAIT, 
	@JsonProperty("APPROVED")
	APPROVED, 
	@JsonProperty("HIDDEN")
	HIDDEN
}
