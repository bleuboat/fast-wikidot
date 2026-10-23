#!/usr/bin/env node
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

const app = new Hono();

app.get("/*", (c) => {
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return c.html(`<!DOCTYPE html>\n${html}`);
});

serve({ fetch: app.fetch, port: 2521 }, (info) => {
  console.log(`🚀 Server running at http://localhost:${info.port}/`);
});
