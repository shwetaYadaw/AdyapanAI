import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { CertificateService } from '../services/certificate.service';
import { sendSuccess } from '../utils/response.utils';

const router = Router();
const certService = new CertificateService();

// GET /certificates/my-certificates
router.get('/my-certificates', authenticate, async (req, res, next) => {
  try {
    const certs = await certService.getStudentCertificates(req.user!.userId);
    sendSuccess({ res, data: certs });
  } catch (err) { next(err); }
});

// GET /certificates/verify/:certificateId — Public verification
router.get('/verify/:certificateId', async (req, res, next) => {
  try {
    const result = await certService.verifyCertificate(req.params.certificateId);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

// POST /certificates/generate — Auto-generate on completion
router.post('/generate', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const cert = await certService.generateCertificate(req.user!.userId, courseId);
    sendSuccess({ res, statusCode: 201, data: cert, message: 'Certificate generated' });
  } catch (err) { next(err); }
});

export default router;
