// Week 7 — Message routes
const router = require('express').Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');

router.get('/',           protect, getConversations);
router.get('/:userId',    protect, getMessages);
router.post('/', protect, [
  body('receiverId').notEmpty().withMessage('Receiver required'),
  body('text').trim().notEmpty().isLength({ max: 2000 }).withMessage('Message text required'),
], validate, sendMessage);

module.exports = router;
