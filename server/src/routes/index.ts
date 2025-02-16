import { Router } from 'express';
import GroupRoutes from './GroupRoutes';
import ScoreRoutes from './ScoreRoutes';
import PostRoutes from './PostRoutes'

const router = Router();

router.use('/groups', GroupRoutes);
router.use('/score', ScoreRoutes);
router.route('/').get((_, res) => {
  res.status(200).send('made by bookworms');
});
router.use('/posts', PostRoutes);

export default router;
