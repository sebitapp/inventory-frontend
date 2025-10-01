export function handleApiError(error, defaultMessage = "Ha ocurrido un error!") {
    if (!error) return defaultMessage;

    // Strapi formato de error
    if (error?.response?.data?.error?.message) {
        return error.response.data.error.message;
    }

    //Strapi nuevo formato de error
    if (error?.error?.message) {
        return error.error.message;
    }

    //Axios error
    if (error?.message) {
        return error.message;
    }
    return defaultMessage;
}