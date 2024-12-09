import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getuserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser
} from '../controllers/userController.js';
import { protect,admin } from '../middleware/authMiddleware.js';


router.post('/login',authUser);
router.post('/',registerUser);
router.post('/logout',protect,logoutUser);
router.get('/profile',protect,getuserProfile);
router.put('/profile',protect,updateUserProfile);
router.get('/',protect,admin,getUsers);
router.get('/:id',protect,admin,getUserById);
router.delete('/:id',protect,admin,deleteUser);
router.put('/:id',protect,admin,updateUser);


export default router;