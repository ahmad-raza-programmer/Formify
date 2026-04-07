import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as responsesController from '../controllers/responses.controller';

const router = Router();

router.post('/:formId', responsesController.submitResponse);
router.get('/:formId', requireAuth, responsesController.getResponses);
router.get('/:formId/export', requireAuth, responsesController.exportResponses);

export default router;
