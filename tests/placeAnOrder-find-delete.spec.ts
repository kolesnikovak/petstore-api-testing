import {test, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {z} from 'zod';
import { deleteAPI, getAPI, postAPI, putAPI } from '../utils/apiCallHelper';

test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    const placeAnOrderRequestBody = {
        id: faker.number.int({min: 1, max: 10_000}),
        petId: faker.number.int({min: 1, max: 10_000}),
        quantity: faker.number.int({min: 1, max: 100}),
        shipDate: faker.date.future().toISOString(),
        status: faker.helpers.arrayElement(['placed', 'approved', 'delivered']),
        complete: faker.datatype.boolean()
    };

    const orderId = placeAnOrderRequestBody.id;


    const expectedPlaceAnOrderAndFindResponseSchema = z.object({
        id: z.number(),
        petId: z.number(),
        quantity: z.number(),
        shipDate: z.string(),
        status: z.literal('placed').or(z.literal('approved')).or(z.literal('delivered')),
        complete: z.literal(true).or(z.literal(false)),
    });


    const expectedDeleteOrderResponseSchema = z.object ({
        code: z.literal(200),
        type: z.literal("unknown"),
        message: z.string()
    });

    test('Place, Find and Delete an Order', async ({ request }) => {

        const placeOrderResponse = await postAPI(
            request,
            `${BASE_URL}/store/order`,
            placeAnOrderRequestBody,
            200,
            expectedPlaceAnOrderAndFindResponseSchema
        );

        await getAPI(
            request,
            `${BASE_URL}/store/order/${orderId}`,
            200,
            expectedPlaceAnOrderAndFindResponseSchema
        );

        await deleteAPI(
            request,
            `${BASE_URL}/store/order/${orderId}`,
            200,
            expectedDeleteOrderResponseSchema
        );
    });
});