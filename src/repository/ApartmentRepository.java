package repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;

import beans.apartment.Amenity;
import beans.apartment.Apartment;

public class ApartmentRepository {
	private static ApartmentRepository instance = null;
	private String path = "WebContent/db/apartments.json";
	private LinkedList<Apartment> apartments = new LinkedList<Apartment>();
	private Persistence<Apartment> persistence = new Persistence<Apartment>();

	private ApartmentRepository() {
		apartments = (LinkedList<Apartment>) findAll();
	}

	public static ApartmentRepository getInstance() {
		if (instance == null)
			instance = new ApartmentRepository();
		return instance;
	}

	public synchronized Collection<Apartment> findAll() {
		return persistence.read(path);
	}

	public synchronized Apartment findById(int id) {
		for (Apartment apartment : apartments) {
			if (apartment.getId() == id)
				return apartment;
		}
		return null;
	}

	public synchronized Apartment create(Apartment apartment) {
		apartment.setId(getAvailableId());
		apartments.add(apartment);
		persistence.save(apartments, path);
		return apartment;
	}

	public synchronized void update(Apartment apartment) {
		Apartment old = findById(apartment.getId());
		if (old != null) {
			apartments.set(apartments.indexOf(old), apartment);
			persistence.save(apartments, path);
		}
	}

	public synchronized void delete(int id) {
		Apartment deleting = findById(id);
		if (deleting != null) {
			deleting.setDeleted(true);
			update(deleting);
		}
	}

	public synchronized void deleteAmenityInApartments(Amenity amenity) {
		boolean changed = false;
		for (int i = 0; i < apartments.size(); i++) {
			Apartment apartment = apartments.get(i);
			if (apartment.getAmenityIds().contains(amenity.getId())) {
				changed = true;
				ArrayList<Integer> newList = apartment.getAmenityIds();
				newList.remove((Integer)amenity.getId());
				apartment.setAmenityIds(newList);
				apartments.set(i, apartment);
			}
		}
		if (changed)
			persistence.save(apartments, path);
	}

	private synchronized int getAvailableId() {
		int id = (apartments.size() != 0) ? (apartments.get(0).getId()) : 1;
		for (Apartment apartment : apartments) {
			if (apartment.getId() > id)
				id = apartment.getId();
		}
		return id + 1;
	}
}
