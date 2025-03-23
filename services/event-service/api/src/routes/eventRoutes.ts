import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { TypeController } from '../controllers/typeController';

const router = Router();
const eventController = new EventController();
const typeController = new TypeController();

// Event routes
router.get('/events', eventController.getAllEvents.bind(eventController));
router.get('/events/:slug', eventController.getEventBySlug.bind(eventController));
router.post('/events', eventController.createEvent.bind(eventController));
router.put('/events/:id', eventController.updateEvent.bind(eventController));
router.delete('/events/:id', eventController.deleteEvent.bind(eventController));

// Type routes
router.get('/types', typeController.getAllTypes.bind(typeController));
router.get('/types/:id', typeController.getTypeById.bind(typeController));
router.post('/types', typeController.createType.bind(typeController));
router.put('/types/:id', typeController.updateType.bind(typeController));
router.delete('/types/:id', typeController.deleteType.bind(typeController));

export default router;
