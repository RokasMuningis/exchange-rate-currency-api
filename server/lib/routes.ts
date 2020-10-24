import type { IncomingMessage, ServerResponse } from "http";

type Callback = (req: IncomingMessage, res: ServerResponse) => void;
type Route = [pattern: RegExp, callback: Callback];
type Routes = Array<Route>;
enum Methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
}
type RoutesByMethod = Record<Methods, Routes>;

const App: RoutesByMethod = {
    [Methods.GET]: [],
    [Methods.POST]: [],
    [Methods.PUT]: [],
}

export const get = (pattern: string, callback: Callback) => {
    App.GET = [...App.GET, [RegExp(pattern), callback]];
}
export const post = (pattern: string, callback: Callback) => {
    App.POST = [...App.POST, [RegExp(pattern), callback]];
}
export const put = (pattern: string, callback: Callback) => {
    App.PUT = [...App.PUT, [RegExp(pattern), callback]];
}




