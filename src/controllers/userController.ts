import { v4 as uuidv4 } from 'uuid';
import { User, UserWithoutId } from '../types/user';
import { isValidUUID, isValidUserData } from '../utils/validation';

// In-memory database
let users: User[] = [];

export const getAllUsers = (): User[] => {
    return users;
};

export const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
};

export const createUser = (userData: UserWithoutId): User => {
    const newUser: User = {
        id: uuidv4(),
        ...userData,
    };
    users.push(newUser);
    return newUser;
};

export const updateUser = (id: string, userData: UserWithoutId): User | undefined => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;

    const updatedUser: User = {
        id,
        ...userData,
    };
    users[userIndex] = updatedUser;
    return updatedUser;
};

export const deleteUser = (id: string): boolean => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    return true;
};

// Validation methods for the controller
export const validateUserId = (id: string): { isValid: boolean; message?: string } => {
    if (!isValidUUID(id)) {
        return { isValid: false, message: 'Invalid user ID format' };
    }
    return { isValid: true };
};

export const validateUserData = (data: any): { isValid: boolean; message?: string; userData?: UserWithoutId } => {
    if (!isValidUserData(data)) {
        return {
            isValid: false,
            message: 'Invalid user data. Required fields: username (string), age (number), hobbies (array of strings)'
        };
    }
    return { isValid: true, userData: data };
};