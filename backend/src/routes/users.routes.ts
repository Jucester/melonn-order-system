import { Router } from 'express';
const router = Router();
import { register, login } from '../controllers/users.controller';


router.post('/register', register);

router.post('/login', login);

export default router;