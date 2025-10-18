import {test, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {z} from 'zod';
import { deleteAPI, getAPI, postAPI, putAPI } from '../utils/apiCallHelper';

test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;
    const userName = process.env.USERNAME || "TestUserNameKatya";
    const password = process.env.PASSWORD || "Test1234!";

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


        const expectedPutUserResponseSchema = z.object ({
            code: z.number(),
            type: z.string(),
            message: z.string()
        });

        const updateUserRequestBody = {
            id: 345238,
            username: userName,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: password,
            phone: faker.phone.number(),
            userStatus: 0
        }


        const expectedDeleteUserResponseSchema = z.object ({
        code: z.number(),
        type: z.string(),
        message: z.string()
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