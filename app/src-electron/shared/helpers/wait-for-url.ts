const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_INTERVAL_MS = 400;

/**
 * Polls until `url` accepts connections, or throws after `timeoutMs`.
 */
export async function waitForUrl(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  intervalMs = DEFAULT_INTERVAL_MS,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let loggedWaiting = false;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status < 500) {
        return;
      }
    } catch {
      if (!loggedWaiting) {
        console.log(`[Electron] Waiting for ${url}...`);
        loggedWaiting = true;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Timed out after ${timeoutMs}ms waiting for ${url}`);
}
