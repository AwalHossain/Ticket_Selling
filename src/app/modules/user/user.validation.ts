// user validation wiht zod

import { z } from 'zod';

const userRegValidation = z.object({
    body: z.object({
        name: z.string().min(3).max(255),
        email: z.string().email(),
        password: z.string().min(6).max(255),
        role: z.enum(['customer', 'admin', 'super-admin']).optional(),
        imageURL: z.string().url().optional()
    })
})


const userLoginValidation = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6).max(255),
    })
})

const userRefreshTokenValidation = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required'
        })
    })
})


const userChangePasswordValidation = z.object({
    body: z.object({
        oldPassword: z.string().min(6).max(255),
        newPassword: z.string().min(6).max(255),
    })
})

const userUpdateProfileValidation = z.object({
    body: z.object({
        name: z.string().min(3).max(255),
        email: z.string().email(),
        imageURL: z.string().url().optional(),
        role: z.enum(['customer', 'admin', 'super-admin']).optional()
    })
})




export const userValidationSchema = {
    userRegValidation,
    userLoginValidation,
    userChangePasswordValidation,
    userUpdateProfileValidation,
    userRefreshTokenValidation
};