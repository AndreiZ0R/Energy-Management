import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import {Constants, Endpoints, HeaderUtils, HttpMethods} from "../utils/constants.ts";
import Cookies from "js-cookie";
import {createApi} from "@reduxjs/toolkit/query/react";
import {AuthenticationResponse, Device, User} from "../models/entities.ts";
import {AuthenticationRequest, CreateDeviceRequest, CreateUserRequest, Response, UpdateDeviceRequest, UpdateUserRequest} from "../models/transfer.ts";


const customBaseQuery = fetchBaseQuery({
   baseUrl: Endpoints.base,
   prepareHeaders: (headers: Headers, /*{getState}*/) => {
      const token = Cookies.get(Constants.TOKEN) ?? "";
      // const sessionId = Cookies.get(Constants.SESSION_ID) ?? "";

      if (token) {
         headers.set(HeaderUtils.AUTHORIZATION_HEADER, HeaderUtils.BUILD_AUTHORIZATION_HEADER(token));
      }
      //
      // if (sessionId) {
      //    headers.set(HeaderUtils.SESSION_HEADER, sessionId);
      // }

      return headers;
   },
});

// Todo: TAGS TO INVALIDATE CACHE!
export const api = createApi({
   reducerPath: "api",
   baseQuery: customBaseQuery,
   tagTypes: ["Users", "Devices"],
   endpoints: (builder) => ({

      login: builder.mutation<Response<AuthenticationResponse>, AuthenticationRequest>({
         query: (request: AuthenticationRequest) => ({
            url: `${Endpoints.auth}/authenticate`,
            method: HttpMethods.POST,
            body: request
         })
      }),

      register: builder.mutation<Response<AuthenticationResponse>, CreateUserRequest>({
         query: (request: AuthenticationRequest) => ({
            url: `${Endpoints.auth}/register`,
            method: HttpMethods.POST,
            body: request
         }),
      }),

      // --------------- Devices Queries ---------------
      getDevicesByIds: builder.query<Response<Device[]>, string[]>({
         query: (deviceIds) => ({
            url: `${Endpoints.devices}/ids`,
            method: HttpMethods.POST,
            body: {ids: deviceIds}
         })
      }),

      getAllDevices: builder.query<Response<Device[]>, void>({
         query: () => Endpoints.devices,
         providesTags: ["Devices"]
      }),

      createDevice: builder.mutation<Response<Device>, CreateDeviceRequest>({
         query: (request: CreateDeviceRequest) => ({
            url: Endpoints.devices,
            method: HttpMethods.POST,
            body: request
         }),
         invalidatesTags: ["Devices"]
      }),

      updateDevice: builder.mutation<Response<Device>, UpdateDeviceRequest>({
         query: (request: UpdateDeviceRequest) => ({
            url: Endpoints.devices,
            method: HttpMethods.PATCH,
            body: request
         }),
         invalidatesTags: ["Devices"]
      }),

      deleteDevice: builder.mutation<Response<Device>, string>({
         query: (deviceId) => ({
            url: `${Endpoints.devices}/${deviceId}`,
            method: HttpMethods.DELETE,
         }),
         invalidatesTags: ["Devices"]
      }),

      // --------------- Users Queries ---------------
      getAllUsers: builder.query<Response<User[]>, void>({
         query: () => Endpoints.users,
         providesTags: ["Users"]
      }),

      createUser: builder.mutation<Response<User>, CreateUserRequest>({
         query: (request: CreateUserRequest) => ({
            url: Endpoints.users,
            method: HttpMethods.POST,
            body: request
         }),
         invalidatesTags: ["Users"]
      }),

      updateUser: builder.mutation<Response<Device>, UpdateUserRequest>({
         query: (request: UpdateUserRequest) => ({
            url: Endpoints.users,
            method: HttpMethods.PATCH,
            body: request
         }),
         invalidatesTags: ["Users"]
      }),

      deleteUser: builder.mutation<Response<Device>, string>({
         query: (userId) => ({
            url: `${Endpoints.users}/${userId}`,
            method: HttpMethods.DELETE,
         }),
         invalidatesTags: ["Users"]
      }),

   })
});

export const {
   useLoginMutation,
   useRegisterMutation,
   useGetDevicesByIdsQuery,
   useGetAllDevicesQuery,
   useCreateDeviceMutation,
   useUpdateDeviceMutation,
   useDeleteDeviceMutation,
   useGetAllUsersQuery,
   useCreateUserMutation,
   useUpdateUserMutation,
   useDeleteUserMutation
} = api;