import type { IncomingMessage, ServerResponse } from "http";

type Callback = (req: IncomingMessage, res: ServerResponse) => void;
type Route = [pattern: RegExp, callback: Callback];
type Routes = Array<Route>;
export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
}
type RoutesByMethod = Record<Methods, Routes>;

const _app: RoutesByMethod = {
  [Methods.GET]: [],
  [Methods.POST]: [],
  [Methods.PUT]: [],
};

export const get = (pattern: string, callback: Callback): void => {
  _app.GET = [..._app.GET, [RegExp(pattern), callback]];
};
export const post = (pattern: string, callback: Callback): void => {
  _app.POST = [..._app.POST, [RegExp(pattern), callback]];
};
export const put = (pattern: string, callback: Callback): void => {
  _app.PUT = [..._app.PUT, [RegExp(pattern), callback]];
};

export const app = {
  get [Methods.GET](): Routes {
    return _app.GET;
  },
  get [Methods.POST](): Routes {
    return _app.POST;
  },
  get [Methods.PUT](): Routes {
    return _app.PUT;
  },
};
