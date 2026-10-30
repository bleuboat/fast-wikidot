import home from "@/lib/home";

export default function Page({ site, page }: { site: string; page: string }) {
  console.log(site, page);
  return (
    <html lang="cn">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <h1>{home}</h1>
      </body>
    </html>
  );
}
