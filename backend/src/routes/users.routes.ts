import { Router } from 'express';
const router = Router();
import { signUp, signIn } from '../controllers/users.controller';


router.post('/register', signUp);

router.post('/login', signIn);

export default router;