import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controller';
import { userValidationSchema } from './user.validation';
const router = express.Router();

router.post('/signup',
    validateRequest(userValidationSchema.userRegValidation),
    userController.registrationUser
);

router.post('/login',
    validateRequest(userValidationSchema.userLoginValidation),
    userController.loginUser
);

router.post('/refresh-token',
    validateRequest(userValidationSchema.userRefreshTokenValidation),
    userController.refreshToken
);

router.patch('/change-password',
    auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequest(userValidationSchema.userChangePasswordValidation),
    userController.changePassword
);




export const userRoutes = router;