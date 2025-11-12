import { validate as uuidValidate } from 'uuid';
import { UserWithoutId } from '../types/user';

export const isValidUUID = (id: string): boolean => {
    return uuidValidate(id);
};

export const isValidUserData = (data: any): data is UserWithoutId => {
    return (
        data &&
        typeof data.username === 'string' &&
        data.username.trim() !== '' &&
        typeof data.age === 'number' &&
        data.age > 0 &&
        Array.isArray(data.hobbies) &&
        data.hobbies.every((hobby: any) => typeof hobby === 'string')
    );
};

export const getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : 'Unknown error occurred';
};