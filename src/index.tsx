import { Hono } from "hono";
import { raw } from "hono/html";
import { serve } from "@hono/node-server";
import open from "open";
import api from "@/lib/api";
import Page from "@/components/Page";

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
  return c.html(
    <>
      {raw("<!DOCTYPE html>")}
      <Page site={site} page={page} args={args} />
    </>,
  );
});

serve({ fetch: app.fetch, port: 2521 }, (info) => {
  const url = `http://localhost:${info.port}/`;
  console.log(`Server running at ${url}`);
  if (process.env.NODE_ENV !== "development") open(url);
});
