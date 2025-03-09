// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  let count = 0;

  const interval = setInterval(async () => {
    if (writer.desiredSize === null) {
      // await writer.close();
      clearInterval(interval);
      return;
    }
    writer.write(`data: ${count}\n\n`);
    count++;
    if (count === 5) {
      await writer.close();
      clearInterval(interval);
    }
  }, 1000);

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
