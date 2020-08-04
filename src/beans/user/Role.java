package beans.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Role {
	@JsonProperty("ADMINISTRATOR")
	ADMINISTRATOR, 
	@JsonProperty("HOST")
	HOST, 
	@JsonProperty("GUEST")
	GUEST
}
