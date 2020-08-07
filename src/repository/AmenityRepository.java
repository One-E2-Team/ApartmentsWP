package repository;

import java.io.IOException;
import java.util.Collection;
import java.util.LinkedList;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import beans.apartment.Amenity;

public class AmenityRepository {
	private static AmenityRepository instance = null;
	private String path = "C:/WebContent/db/amenities.json";
	private LinkedList<Amenity> amenities = new LinkedList<Amenity>();
	private Persistence<Amenity> persistence = new Persistence<Amenity>();

	private AmenityRepository() {
		amenities = persistence.read(path);
	}

	public static AmenityRepository getInstance() {
		if (instance == null)
			instance = new AmenityRepository();
		return instance;
	}

	@SuppressWarnings("unchecked")
	public synchronized Collection<Amenity> getAll() {
		try {
			return Persistence.repositoryMapper.readValue(Persistence.repositoryMapper.writeValueAsString(amenities),
					amenities.getClass());
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

	public synchronized Amenity read(int id) {
		for (Amenity amenity : amenities) {
			if (amenity.getId() == id)
				try {
					return Persistence.repositoryMapper
							.readValue(Persistence.repositoryMapper.writeValueAsString(amenity), amenity.getClass());
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
		}
		return null;
	}

	public synchronized Amenity create(Amenity amenity) {
		amenity.setId(getAvailableId());
		try {
			amenities.add(Persistence.repositoryMapper
					.readValue(Persistence.repositoryMapper.writeValueAsString(amenity), amenity.getClass()));
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		persistence.save(amenities, path);
		return amenity;
	}

	public synchronized void update(Amenity amenity) {
		for (int i = 0; i < amenities.size(); i++)
			if (amenities.get(i).getId() == amenity.getId()) {
				amenities.set(i, amenity);
				persistence.save(amenities, path);
				return;
			}
	}

	public synchronized void delete(int id) {
		Amenity deleting = read(id);
		if (deleting != null) {
			ApartmentRepository.getInstance().deleteAmenityInApartments(deleting);
			deleting.setDeleted(true);
			update(deleting);
		}
	}

	private synchronized int getAvailableId() {
		int id = (amenities.size() != 0) ? (amenities.get(0).getId()) : 0;
		for (Amenity amenity : amenities) {
			if (amenity.getId() > id)
				id = amenity.getId();
		}
		return id + 1;
	}
}
