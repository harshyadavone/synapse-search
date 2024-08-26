const ctx: Worker = self as any;

ctx.onmessage = async (event: MessageEvent) => {
  const url = event.data;
  try {
    const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
    ctx.postMessage({ valid: true });
  } catch (error) {
    ctx.postMessage({ valid: false });
  }
};

export {};