import { Hono } from "hono";

const api = new Hono();

api.all("/*", (c) => {
  return c.notFound();
});

export default api;
