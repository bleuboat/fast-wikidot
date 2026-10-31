export default function Page({
  site,
  page,
  args,
}: {
  site: string;
  page: string;
  args: Record<string, string>;
}) {
  return (
    <html lang="cn">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <h1>{`${site} ${page} ${JSON.stringify(args)}`}</h1>
      </body>
    </html>
  );
}
