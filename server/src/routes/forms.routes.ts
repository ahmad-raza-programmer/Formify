import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as formsController from '../controllers/forms.controller';

const router = Router();

router.post('/', requireAuth, formsController.createForm);
router.get('/', requireAuth, formsController.getForms);
router.get('/:id', requireAuth, formsController.getForm);
router.put('/:id', requireAuth, formsController.updateForm);
router.delete('/:id', requireAuth, formsController.deleteForm);
router.get('/public/:slug', formsController.getPublicForm);

export default router;
