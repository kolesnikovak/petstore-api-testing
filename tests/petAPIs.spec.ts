import {test, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {z} from 'zod';
import { deleteAPI, getAPI, postAPI, putAPI } from '../utils/apiCallHelper';

test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    const addAPetRequestBody = {
        id: faker.number.int({min: 1000, max: 9999}),
        category: {
            id: faker.number.int({min: 1, max: 10}),
            name: faker.commerce.productName(),
        },
        name: faker.commerce.productName(),
        photoUrls: [
            faker.image.url(),
            faker.image.url()
        ],
        tags: [
            {
                id: faker.number.int({min: 1, max: 10}),
                name: faker.commerce.productName()
            }
        ],
        status: faker.commerce.productName()
    };

     const expectedAddPetResponseSchema = z.object({
            id: z.number(),
            category: z.object({
                id: z.number(),
                name: z.string(),
            }),
            name: z.string(),
            photoUrls: z.array(z.string().url()),
            tags: z.array(z.object({
                id: z.number(),
                name: z.string()
            })),
            status: z.string()
        });

    test('Add (POST) a pet', async ({request}) => {
        const response = await postAPI(
            request,
            `${BASE_URL}/pet`,
            addAPetRequestBody,
            200,
            expectedAddPetResponseSchema
        );
        expect(response.status()).toBe(200);
    });
});