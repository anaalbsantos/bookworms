import { Router } from 'express';
import GroupRoutes from './GroupRoutes';

const router = Router();

router.use('/groups', GroupRoutes);
router.route('/').get((_, res) => {
  res.status(200).send('made by bookworms');
});

export default router;
