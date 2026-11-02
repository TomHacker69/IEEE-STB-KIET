import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Event } from '../models/Event';
import { logAudit } from '../utils/auditLogger';

export const getPublicEvents = async (req: Request, res: Response) => {
  try {
    const { status, limit } = req.query;
    const filter: any = { isPublished: true };
    if (status) filter.status = status;

    const query = Event.find(filter).sort({ eventDate: status === 'past' ? -1 : 1 });
    if (limit) query.limit(Number(limit));

    const events = await query.exec();
    return res.status(200).json({ success: true, data: events });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEvents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter).sort({ eventDate: -1 });
    return res.status(200).json({ success: true, data: events });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      description,
      coverImage,
      eventDate,
      endDate,
      venue,
      mode,
      registrationLink,
      status,
      isPublished,
    } = req.body;

    if (!title || !description || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and eventDate are required',
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description,
      coverImage: coverImage || '',
      eventDate: new Date(eventDate),
      endDate: endDate ? new Date(endDate) : undefined,
      venue: venue || 'Campus Auditorium',
      mode: mode || 'offline',
      registrationLink: registrationLink || '',
      status: status || 'upcoming',
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    await logAudit(req, 'CREATE', 'events', (event._id as any).toString(), { title });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      coverImage,
      eventDate,
      endDate,
      venue,
      mode,
      registrationLink,
      status,
      isPublished,
    } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (title) event.title = title.trim();
    if (description) event.description = description;
    if (coverImage !== undefined) event.coverImage = coverImage;
    if (eventDate) event.eventDate = new Date(eventDate);
    if (endDate !== undefined) event.endDate = endDate ? new Date(endDate) : undefined;
    if (venue !== undefined) event.venue = venue;
    if (mode !== undefined) event.mode = mode;
    if (registrationLink !== undefined) event.registrationLink = registrationLink;
    if (status !== undefined) event.status = status;
    if (isPublished !== undefined) event.isPublished = isPublished;

    await event.save();
    await logAudit(req, 'UPDATE', 'events', id, { title: event.title });

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await Event.findByIdAndDelete(id);
    await logAudit(req, 'DELETE', 'events', id, { title: event.title });

    return res.status(200).json({
      success: true,
      message: 'Event deleted',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

