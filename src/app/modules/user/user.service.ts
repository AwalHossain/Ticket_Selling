import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import { IChangePassword, ILoginUser, ILoginUserResponse, IRefreshTokenResponse } from './user.interface';

import { User } from '@prisma/client';


const registrationUser = async (payload: User): Promise<ILoginUserResponse> => {
    const { name, email, password, imageURL, role, } = payload;
    // creating instance of User
    // const user = new User();
    //  // access to our instance methods
    //   const isUserExist = await user.isUserExist(id);

    // const isUserExist = await User.isUserExist(id);
    const isUserExist = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User already exist');
    }

    // hash password before saving
    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bycrypt_salt_rounds)
    );


    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            role: role,
            password: hashedPassword,
            imageURL: imageURL
        }
    });




    const accessToken = jwtHelpers.createToken(
        {
            role: user?.role,
            userId: user?.userId
        },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
        {
            role: user?.role,
            userId: user?.userId
        },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
    };
}


const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { email, password } = payload;
    // creating instance of User
    // const user = new User();
    //  // access to our instance methods
    //   const isUserExist = await user.isUserExist(id);

    // const isUserExist = await User.isUserExist(id);
    const isUserExist = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    if (
        isUserExist.password &&
        !(await bcrypt.compare(password, isUserExist.password)
        )) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    //create access token & refresh token

    const { userId, role } = isUserExist;

    console.log(config.jwt, 'config.jwt');

    const accessToken = jwtHelpers.createToken(
        { userId, role },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
        { userId, role },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
    };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.refresh_secret as Secret
        );
    } catch (err) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
    }

    const { userId } = verifiedToken;

    // tumi delete hye gso  kintu tumar refresh token ase
    // checking deleted user's refresh token

    const isUserExist = await prisma.user.findFirst({
        where: {
            userId: userId
        }
    });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }
    //generate new token

    const newAccessToken = jwtHelpers.createToken(
        {
            id: isUserExist.userId,
            role: isUserExist.role,
        },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken: newAccessToken,
    };
};

const changePassword = async (
    user: JwtPayload | null,
    payload: IChangePassword
): Promise<User> => {
    const { oldPassword, newPassword } = payload;

    // // checking is user exist
    // const isUserExist = await User.isUserExist(user?.userId);

    //alternative way
    const isUserExist = await prisma.user.findFirst({
        where: {
            userId: user?.userId
        }
    })

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    // checking old password
    if (
        isUserExist.password &&
        !(await bcrypt.compare(oldPassword, isUserExist.password))
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
    }

    // // hash password before saving
    const newHashedPassword = await bcrypt.hash(
        newPassword,
        Number(config.bycrypt_salt_rounds)
    );

    // const query = { id: user?.userId };
    // const updatedData = {
    //   password: newHashedPassword,  //
    //   needsPasswordChange: false,
    //   passwordChangedAt: new Date(), //
    // };

    // await User.findOneAndUpdate(query, updatedData);
    // data update
    isUserExist.password = newPassword;

    // updating using save()
    const updatedUser = await prisma.user.update({
        where: {
            userId: user?.userId
        },
        data: {
            password: newHashedPassword
        }
    })

    return updatedUser;
};

export const AuthService = {
    registrationUser,
    loginUser,
    refreshToken,
    changePassword,
};