package repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import beans.apartment.Amenity;
import beans.apartment.Apartment;

public class ApartmentRepository {
	private static ApartmentRepository instance = null;
	private String path = "C:/WebContent/db/apartments.json";
	private LinkedList<Apartment> apartments = new LinkedList<Apartment>();
	private Persistence<Apartment> persistence = new Persistence<Apartment>();

	private ApartmentRepository() {
		apartments = persistence.read(path);
	}

	public static ApartmentRepository getInstance() {
		if (instance == null)
			instance = new ApartmentRepository();
		return instance;
	}

	@SuppressWarnings("unchecked")
	public synchronized Collection<Apartment> getAll() {
		try {
			return Persistence.repositoryMapper.readValue(Persistence.repositoryMapper.writeValueAsString(apartments),
					apartments.getClass());
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

	public synchronized Apartment read(int id) {
		for (Apartment apartment : apartments) {
			if (apartment.getId() == id)
				try {
					return Persistence.repositoryMapper.readValue(
							Persistence.repositoryMapper.writeValueAsString(apartment), apartment.getClass());
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

	public synchronized Apartment create(Apartment apartment) {
		apartment.setId(getAvailableId());
		try {
			apartments.add(Persistence.repositoryMapper
					.readValue(Persistence.repositoryMapper.writeValueAsString(apartment), apartment.getClass()));
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		persistence.save(apartments, path);
		return apartment;
	}

	public synchronized void update(Apartment apartment) {
		for (int i = 0; i < apartments.size(); i++)
			if (apartments.get(i).getId() == apartment.getId()) {
				apartments.set(i, apartment);
				persistence.save(apartments, path);
				return;
			}
	}

	public synchronized void delete(int id) {
		Apartment deleting = read(id);
		if (deleting != null) {
			deleting.setDeleted(true);
			update(deleting);
		}
	}

	synchronized void deleteAmenityInApartments(Amenity amenity) {
		boolean changed = false;
		for (int i = 0; i < apartments.size(); i++) {
			Apartment apartment = apartments.get(i);
			if (apartment.getAmenityIds().contains(amenity.getId())) {
				changed = true;
				ArrayList<Integer> newList = apartment.getAmenityIds();
				newList.remove((Integer) amenity.getId());
				apartment.setAmenityIds(newList);
				apartments.set(i, apartment);
			}
		}
		if (changed)
			persistence.save(apartments, path);
	}

	private synchronized int getAvailableId() {
		int id = (apartments.size() != 0) ? (apartments.get(0).getId()) : 0;
		for (Apartment apartment : apartments) {
			if (apartment.getId() > id)
				id = apartment.getId();
		}
		return id + 1;
	}
}
