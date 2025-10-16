import {test, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {z} from 'zod';
import { deleteAPI, getAPI, postAPI, putAPI } from '../utils/apiCallHelper';

test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;
    const userName = "TestUserNameKatya";

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


        const expectedCreateUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(newCreateUserRequestBody.id.toString()),
        });


         const expectedGetUserResponseSchema = z.object({
            id: z.number(),
            username: z.literal(userName),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            password: z.string(),
            phone: z.string(),
            userStatus: z.number(),
        });


        const expectedPutUserResponseSchema = z.object ({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(newCreateUserRequestBody.id.toString())
        });

        const updateUserRequestBody = {
            id: 345238,
            username: "TestUserNameKatya",
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: "Test1234!",
            phone: faker.phone.number(),
            userStatus: 0
        }


        const expectedDeleteUserResponseSchema = z.object ({
        code: z.literal(200),
        type: z.literal("unknown"),
        message: z.literal(userName)
    });



    test ('End-to-End User API Tests - Post, Get, Put, Delete', async ({request}) => {
        
      await postAPI(
            request,
            `${BASE_URL}/user`,
            newCreateUserRequestBody,
            200, 
            expectedCreateUserResponseSchema
        );


        await getAPI(
            request,
            `${BASE_URL}/user/${userName}`,
            200, 
            expectedGetUserResponseSchema
        );

        await putAPI(
            request,
            `${BASE_URL}/user/${userName}`,
            updateUserRequestBody,
            200, 
            expectedPutUserResponseSchema
        );

        await deleteAPI(
            request,
            `${BASE_URL}/user/${userName}`,
            200, 
            expectedDeleteUserResponseSchema
        );

    });
});