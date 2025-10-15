import {test, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {z} from 'zod';

test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test ('Create User', async ({request}) => {
        const newCreateUserRequestBody = {
            id: 345238,
            username: "TestUserNameKatya",
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: "Test1234!",
            phone: faker.phone.number(),
            userStatus: 0
        }
        const createUserResponse = await request.post(`${BASE_URL}/user`, {
            data: newCreateUserRequestBody
        });
        expect(createUserResponse.status()).toBe(200);
        

        const expectedResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(newCreateUserRequestBody.id.toString()),
        });
        
        const actualUserResponseBody = await createUserResponse.json();
        expectedResponseSchema.parse(actualUserResponseBody);

    });
    test ('Get User by Username', async ({request}) => {
        const username = "TestUserNameKatya";
        const getUserResponse = await request.get(`${BASE_URL}/user/${username}`);
        expect(getUserResponse.status()).toBe(200);

        const expectedGetUserResponseSchema = z.object({
            id: z.number(),
            username: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            password: z.string(),
            phone: z.string(),
            userStatus: z.number(),
        });

        const actualGetUserResponseBody = await getUserResponse.json();
        expectedGetUserResponseSchema.parse(actualGetUserResponseBody);
    });
});