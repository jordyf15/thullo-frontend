import _ from "lodash";
import { NotLoggedInError } from "../error";
import ErrorResponse from "../models/error";

export const serializeResponse =
  <T>() =>
  (response: Response) => {
    if (!_.inRange(response.status, 200, 300)) {
      return response.text().then((text) => {
        switch (response.status) {
          case 403:
            throw NotLoggedInError;
          default: {
            const errorResponse = deepMapKeys(
              JSON.parse(idReviver(text)),
              (v, k) => _.camelCase(k)
            ) as ErrorResponse;

            if (errorResponse.errors) {
              throw errorResponse;
            } else {
              throw new Error(
                `Request rejected with status ${response.status} and message ${text}`
              );
            }
          }
        }
      });
    }

    return response
      .text()
      .then(
        (text) =>
          deepMapKeys(JSON.parse(idReviver(text)), (v, k) =>
            _.camelCase(k)
          ) as T
      );
  };

export const noContentResponse = () => (response: Response) => {
  if (response.status !== 204) {
    return response.text().then((text) => {
      switch (response.status) {
        case 403:
          throw NotLoggedInError;
        default: {
          const errorResponse = deepMapKeys(
            JSON.parse(idReviver(text)),
            (v, k) => _.camelCase(k)
          ) as ErrorResponse;

          if (errorResponse.errors) {
            throw errorResponse;
          } else {
            throw new Error(
              `Request rejected with status ${response.status} and message ${text}`
            );
          }
        }
      }
    });
  }

  return response;
};

const deepMapKeys = <T>(obj: T, fn: _.ObjectIterator<any, any>): any => {
  if (_.isArray(obj)) {
    return obj.map((innerObj) => deepMapKeys(innerObj, fn));
  } else if (_.isObject(obj)) {
    const x: any = {};

    Object.keys(obj).forEach((k) => {
      const currObj = Object(obj);
      x[_.camelCase(k)] = deepMapKeys(currObj[k], fn);
    });

    return x as T;
  }

  return obj as T;
};

const idReviver = (text: string) => text.replace(/"id":(\d+)/g, '"id":"$1"');
