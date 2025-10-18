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


        const getPetResponseSchema = z.object({
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

        const updatePetRequestBody = {
            id: addAPetRequestBody.id,
            category: {
                id: faker.number.int({min: 1, max: 10}),
                name: faker.commerce.productName(),
            },
            name: "UpdatedPetName",
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
            status: "sold"
        };


        const expectedDeletePetResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(addAPetRequestBody.id.toString())
        });

        const expectedFindPetResponseSchema = z.array(z.object({
            id: z.number(),
            category: z.object({
                id: z.number(),
                name: z.string().optional()
            }).optional(),
            name: z.string(),
            photoUrls: z.array(z.string()),
            tags: z.array(z.object({
                id: z.number(),
                name: z.string()
            })),
            status: z.string()
        }));

        const expectedInventoryResponseSchema = z.record(z.string(), 
            z.number()).refine((data) => Object.keys(data).length === 14, {
            message: "Response must have exactly 14 keys",
        });


    test('End to end test with POST, GET, PUT and DELETE a pet', async ({request}) => {
        await postAPI(
            request,
            `${BASE_URL}/pet`,
            addAPetRequestBody,
            200,
            expectedAddPetResponseSchema
        );

        await getAPI(
            request,
            `${BASE_URL}/pet/${addAPetRequestBody.id}`,
            200,
            getPetResponseSchema
        );

        await putAPI(
            request,
            `${BASE_URL}/pet`,
            updatePetRequestBody,
            200,
            expectedAddPetResponseSchema
        );

        await deleteAPI(
            request,
            `${BASE_URL}/pet/${addAPetRequestBody.id}`,
            200,
            expectedDeletePetResponseSchema
        );
    }); 

    test ('Find pet by status', async ({request}) => {
    
        await getAPI(
            request,
            `${BASE_URL}/pet/findByStatus`,
            200,
            expectedFindPetResponseSchema,
            { status: 'available' }
        );
    }); 

    test ('Find pet by tags', async ({request}) => {
    
        await getAPI(
            request,
            `${BASE_URL}/pet/findByTags`,
            200,
            expectedFindPetResponseSchema,
            { tags: 'tag1,tag2' }
        );

    });

    test ('Validate length of keys and values for pet inventory', async ({request}) => {
    
        const response = await getAPI(
            request,
            `${BASE_URL}/store/inventory`,
            200,
            expectedInventoryResponseSchema
        );
    });
});