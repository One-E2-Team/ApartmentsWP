package beans.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Sex {
	@JsonProperty("MALE")
	MALE, 
	@JsonProperty("FEMALE")
	FEMALE, 
	@JsonProperty("POTATO")
	POTATO
}
