package repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;

import beans.apartment.Amenity;
import repository.persistence.Persistence;

public class AmenityRepository {
	private HashMap<Integer, Amenity> amenities = new HashMap<Integer, Amenity>();
	private String path = "WebContent/db/amenities.json";
	
	public AmenityRepository() {
		LinkedList<Amenity> allAmenities = (new Persistence<Amenity>()).read(path);
		for (Amenity amenity : allAmenities) {
			amenities.put(amenity.getId(), amenity);
		}
	}
	
	public Collection<Amenity> findAll(){
		return amenities.values();
	}
}
