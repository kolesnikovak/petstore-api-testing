import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { deleteAPI, getAPI, postAPI, putAPI } from '../utils/apiCallHelper';

test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;
    const userName = process.env.USERNAME!;
    const password = process.env.PASSWORD!;

    const newCreateUserRequestBody = {
        id: 345238,
        username: userName,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: password,
        phone: faker.phone.number(),
        userStatus: 0
    }
    const expectedCreateUserResponseSchema = z.object({
        code: z.number(),
        type: z.string(),
        message: z.string(),
    });

    const expectedLoginResponseSchema = z.object({
        code: z.number(),
        type: z.string(),
        message: z.string().regex(/^logged in user session:\d+$/) // regex to match session ID format
    });

    const expectedLogoutResponseSchema = z.object({
        code: z.number(),
        type: z.string(),
        message: z.string()
    });

    const deleteUserResponseSchema = z.object({
        code: z.number(),
        type: z.string(),
        message: z.string()
    });

    test('User Creation, Login, Logout and Delete', async ({ request }) => {

        await postAPI(
            request,
            `${BASE_URL}/user`,
            newCreateUserRequestBody,
            200,
            expectedCreateUserResponseSchema
        );

        await getAPI(
            request,
            `${BASE_URL}/user/login`,
            200,
            expectedLoginResponseSchema,
            { username: userName, password: password }
        );

        // User Logout
        await getAPI(
            request,
            `${BASE_URL}/user/logout`,
            200,
            expectedLogoutResponseSchema
        );


        await deleteAPI(
            request,
            `${BASE_URL}/user/${encodeURIComponent(userName)}`,
            200,
            deleteUserResponseSchema
        );
    });
});