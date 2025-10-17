import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { deleteAPI, getAPI, postAPI, putAPI } from '../utils/apiCallHelper';

test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    const newCreateUsersRequestBody = Array.from({ length: 5 }, () => ({
            id: faker.number.int({min: 1000, max: 9999}),
            username: faker.internet.username(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            phone: faker.phone.number(),
            userStatus: faker.number.int({min: 0, max: 1})
        }));

        const expectedCreateUsersResponseSchema = z.object({
            code: z.number(),
            type: z.string(),
            message: z.string(),
        });

        test('Create List of Users', async ({ request }) => {
        await postAPI(
            request,
            `${BASE_URL}/user/createWithList`,
            newCreateUsersRequestBody,
            200,
            expectedCreateUsersResponseSchema
        );
        });
});

