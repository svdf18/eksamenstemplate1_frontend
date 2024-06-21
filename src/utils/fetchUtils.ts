/**
 * Utility Method to create options for a fetch call
 * @param method GET, POST, PUT, DELETE
 * @param body The request body (only relevant for POST and PUT)
 * @returns
 */
function makeOptions(
  method: string,
  body: object | null
): RequestInit {
  const opts: RequestInit = {
      method: method,
      headers: {
          "Content-type": "application/json",
          Accept: "application/json"
      }
  };
  if (body) {
      opts.body = JSON.stringify(body);
  }
  return opts;
}

/**
 * Utility Method to handle http-errors returned as a JSON-response with fetch
 * Meant to be used in the first .then() clause after a fetch-call
 */

class HttpException extends Error {
  public status: number;
  constructor(message: string, status?: number) {
      super(message);
      this.status = status || 500;
  }
}

async function handleHttpErrors(res: Response) {
  if (!res.ok) {
      const errorResponse = await res.json();
      let msg = errorResponse.message
          ? errorResponse.message
          : "An unexpected error occurred";
      if (res.status === 400) {
          msg = "There was an error in your request. Please try again.";
      }
      if (res.status === 401) {
        msg = "Unauthorized access. You do not have permission to view this resource.";
      }
      if (res.status === 403) {
          msg = "You do not have access to this resource.";
      }
      if (res.status === 404) {
          msg = "The resource was not found.";
      }
      if (res.status >= 500) {
          msg = "There was an error on the server. Please try again later.";
      }
        throw new HttpException(msg, res.status);
    }
    if (res.status === 204) {
        return res;
    }
    return res.json();
}

export { makeOptions, handleHttpErrors, HttpException };