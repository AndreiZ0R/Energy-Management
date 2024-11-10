import {ClientError} from "../models/transfer.ts";

export const extractErrorMessage = (errors: ClientError[]): string => errors.map(error => error.message).join("\n");