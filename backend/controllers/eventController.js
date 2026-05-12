const EventModel = require("../models/eventModel");
const TicketTypeModel = require("../models/ticketTypeModel");

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await EventModel.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.getAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get event by id
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventModel.getById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ticket types for an event
exports.getTicketTypesByEventId = async (req, res) => {
  try {
    const { id } = req.params;
    const ticketTypes = await TicketTypeModel.getByEventId(id);

    if (!ticketTypes || ticketTypes.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this event" });
    }

    res.json(ticketTypes);
  } catch (err) {
    res.status(500).json({ error: "Backend Error: " + err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      event_date,
      image_url,
      category_id,
      organizer_id,
    } = req.body;

    const existingEvent = await EventModel.getById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const success = await EventModel.updateById(id, {
      title,
      description,
      location,
      event_date,
      image_url,
      category_id,
      organizer_id,
    });

    if (!success) {
      return res.status(400).json({ message: "Failed to update event" });
    }

    const updatedEvent = await EventModel.getById(id);
    return res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to update event", error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existingEvent = await EventModel.getById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const success = await EventModel.deleteById(id);
    if (!success) {
      return res.status(400).json({ message: "Failed to delete event" });
    }

    return res.json({ message: "Event deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete event", error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      event_date,
      image_url,
      category_id,
      organizer_id,
    } = req.body;

    if (!title || !location || !event_date) {
      return res.status(400).json({
        message: "Title, location, and event_date are required",
      });
    }

    const eventId = await EventModel.create({
      title,
      description,
      location,
      event_date,
      image_url,
      category_id,
      organizer_id,
    });

    const newEvent = await EventModel.getById(eventId);

    return res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create event",
      error: err.message,
    });
  }
};
