import { Router } from 'express';

const router = Router();

router.route('/').get((_, res) => {
  res.status(200).send('Made with 💚 and &lt; &#x0002F; &gt; by bookworms');
});

export default router;
