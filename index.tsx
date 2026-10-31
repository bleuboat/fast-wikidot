import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import Page from "@/components/Page";
import api from "./lib/api";

const app = new Hono();

app.route("/__api__", api);

app.get("/*", (c) => {
  let site = "__sandbox__";
  let page = "start";
  let args: Record<string, string> = {};
  const path = c.req.path.split("/").filter((value) => value);
  if (path[0]?.startsWith("@")) {
    site = path.shift()!.slice(1);
  }
  const originPage = path.shift();
  if (originPage) {
    const pageArray: string[] = [];
    let sep = false;
    for (const char of originPage) {
      if (/^[A-Za-z0-9]$/.test(char)) {
        pageArray.push(char.toLocaleLowerCase());
        sep = false;
      } else if (!sep && /^[-_ ]$/.test(char)) {
        pageArray.push("-");
        sep = true;
      }
    }
    page = pageArray.join("");
  }
  let key: string | undefined;
  for (const value of path) {
    if (key) {
      args[key] = value;
      key = undefined;
    } else {
      key = value;
    }
  }
  const html = renderToString(
    <StrictMode>
      <Page site={site} page={page} args={args} />
    </StrictMode>,
  );
  return c.html(`<!DOCTYPE html>\n${html}`);
});

serve({ fetch: app.fetch, port: 2521 }, (info) => {
  console.log(`Server running at http://localhost:${info.port}/`);
});
