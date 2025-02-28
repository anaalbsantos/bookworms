import { Router } from 'express';
import GroupRoutes from './GroupRoutes';
import UserRoutes from './userRoutes';
import CommentRoutes from './CommentRoutes';
import ScoreRoutes from './ScoreRoutes';
import FeedRoutes from './FeedRoutes';
import AuthRouter from './AuthRoutes';

const router = Router();

router.use('/feed', FeedRoutes);
router.use('/groups', GroupRoutes);
router.use('/comments', CommentRoutes);
router.use('/score', ScoreRoutes);
router.use('/users', UserRoutes);
router.use('/sessions', AuthRouter);
router.route('/').get((_, res) => {
  res.status(200).send('made by bookworms');
});

export default router;
