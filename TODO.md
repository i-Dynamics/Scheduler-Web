# TODO

- [ ] Solve problem of multiple references to the same object in the graph. Just put ids and determine the truth of these objects in the graph put a getter and setter on the objects with id references which will fetch the objects based on id (this may require back references in the object graph).
- [ ] Add pagination to bookings and jobs.
- [ ] Keep surrogates in sync. e.g. when getting booking.resource try: store.user.cal.resources.find(id==id) else return surrogate if resource is deleted from all resources the server should emit update_booking to keep any bookings with references to that resource in sync.
- [ ] Public calendars.
- [ ] Also add a role permission of 'approved' to a booking and a role between view and collaborator to describe this role. Users with roles should also have this role added to their current roles API should handle it as approve_booking(id) and it should be on booking as approved so it can't be updated via update. Maybe update_booking should call approve_booking if 'approved' key exists. So approve_booking can handle the logic of who can approve.
- [ ] Service home page for visitors that are not logged in.
- [x] External images.
- [x] Add Normalize CDN.
- [ ] Add constants file to JS root.
- [ ] Get control from server.
