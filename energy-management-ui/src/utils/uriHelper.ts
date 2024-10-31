import {AppRoutes} from "./constants.ts";

export const getRedirectedPath = (URI: string) => {
    if (URI && URI.length > 5)
        return URI.replace("?from=", "");
    return AppRoutes.HOME;
}