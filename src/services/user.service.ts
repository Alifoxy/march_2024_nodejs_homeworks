import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import {ITokenPayload} from "../interfaces/token.interface";
import {UploadedFile} from "express-fileupload";
import {s3Service} from "./s3.service";
import {FileItemTypeEnum} from "../enums/file-item-type.enum";

class UserService {
    public async getList(): Promise<IUser[]> {
        return await userRepository.getList();
    }

    public async create(dto: Partial<IUser>): Promise<IUser> {
        if (!dto.name || dto.name.length < 3) {
            throw new ApiError(
                "Name is required and should be at least 3 characters long",
                400,
            );
        }
        if (!dto.email || !dto.email.includes("@")) {
            throw new ApiError("Email is required and should be valid", 400);
        }
        if (!dto.password || dto.password.length < 6) {
            throw new ApiError(
                "Password is required and should be at least 6 characters long",
                400,
            );
        }
        return await userRepository.create(dto);
    }

    public async getById(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        return user;
    }

    public async getMe(jwtPayload: ITokenPayload): Promise<IUser> {
        const user = await userRepository.getById(jwtPayload.userId);
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        return user;
    }

    public async updateMe(jwtPayload: ITokenPayload, dto: IUser): Promise<IUser> {
        return await userRepository.updateById(jwtPayload.userId, dto);
    }

    public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
        return await userRepository.deleteById(jwtPayload.userId);
    }

    public async uploadAvatar(
        jwtPayload: ITokenPayload,
        file: UploadedFile,
    ): Promise<IUser> {
        const user = await userRepository.getById(jwtPayload.userId);

        const avatar = await s3Service.uploadFile(
            file,
            FileItemTypeEnum.USER,
            user._id,
        );
        const updatedUser = await userRepository.updateById(user._id, { avatar });
        if (user.avatar) {
            await s3Service.deleteFile(user.avatar);
        }
        return updatedUser;
    }

    public async deleteAvatar(jwtPayload: ITokenPayload): Promise<IUser> {
        const user = await userRepository.getById(jwtPayload.userId);

        if (user.avatar) {
            await s3Service.deleteFile(user.avatar);
        }
        return await userRepository.updateById(user._id, { avatar: null });
    }
}

export const userService = new UserService();