import {Router} from 'express';

import ping from './handlers/ping';
import info from './handlers/info';
// import getConversations from './handlers/getConversations';
// import deleteConversations from './handlers/deleteConversations';
import postMutations from './handlers/postMutations';


const router = Router()



router.get('/ping', ping)
router.get('/info', info)
router.post('/mutations', postMutations)
// router.get('/conversations', getConversations)
// router.delete('/conversations', deleteConversations)

router.all('*', (req, res) => res.sendStatus(400))

export default router
