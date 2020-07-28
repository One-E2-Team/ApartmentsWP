package repository;

import java.util.Collection;
import java.util.LinkedList;

import beans.apartment.Amenity;

public class AmenityRepository {
	private static AmenityRepository instance = null;
	private String path = "WebContent/db/amenities.json";
	private LinkedList<Amenity> amenities = new LinkedList<Amenity>();
	private Persistence<Amenity> persistance = new Persistence<Amenity>();

	private AmenityRepository() {
		amenities = (LinkedList<Amenity>) findAll();
	}

	public static AmenityRepository getInstance() {
		if (instance == null)
			instance = new AmenityRepository();
		return instance;
	}

	public synchronized Collection<Amenity> findAll() {
		LinkedList<Amenity> available = new LinkedList<Amenity>();
		LinkedList<Amenity> allAmenities = persistance.read(path);
		for (Amenity amenity : allAmenities) {
			if (!amenity.isDeleted())
				available.add(amenity);
		}
		return available;
	}

	public synchronized Amenity findById(int id) {
		for (Amenity amenity : amenities) {
			if (amenity.getId() == id)
				return amenity;
		}
		return null;
	}

	public synchronized Amenity create(Amenity amenity) {
		amenity.setId(getAvailableId());
		amenities.add(amenity);
		persistance.save(amenities, path);
		return amenity;
	}

	public synchronized void update(Amenity amenity) {
		Amenity old = findById(amenity.getId());
		if (old != null) {
			amenities.set(amenities.indexOf(old), amenity);
			persistance.save(amenities, path);
		}
	}

	public synchronized void delete(int id) {
		Amenity deleting = findById(id);
		if (deleting != null) {
			ApartmentRepository.getInstance().deleteAmenityInApartments(deleting);
			deleting.setDeleted(true);
			update(deleting);
		}
	}

	private synchronized int getAvailableId() {
		int id = (amenities.size() != 0) ? (amenities.get(0).getId()) : 1;
		for (Amenity amenity : amenities) {
			if (amenity.getId() > id)
				id = amenity.getId();
		}
		return id + 1;
	}
}
