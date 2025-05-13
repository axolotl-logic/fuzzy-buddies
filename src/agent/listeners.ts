import type { Page } from "puppeteer";

export function addListeners(_page: Page) {
  /*
  page.on("requestfailed", (req) => {
    storage.addRequestFailedEvent?.({
      url: req.url(),
      frameUrl: req.frame()?.url(),
      method: req.method(),
      errorText: req.failure()?.errorText,
      createdAt: Date.now(),
    });
  });

  page.on("error", (err) => {
    storage.addErrorEvent?.({
      name: err.name,
      stack: err.stack,
      message: err.message,
    });
  });

  page.on("response", (resp) => {
    const time = resp.timing()?.requestTime;
    storage.addResponseEvent?.({
      requestTime: time,
      status: resp.status(),
      url: resp.url(),
      frameUrl: resp.frame()?.url(),
      method: resp.request().method(),
      createdAt: Date.now(),
    });
  });

  page.on("console", (msg) => {
    storage.addConsoleEvent?.({
      type: msg.type(),
      text: msg.text(),
    });
  });

  page.on("pageerror", (err) => {
    storage.addPageErrorEvent?.({
      name: err.name,
      stack: err.stack,
      message: err.message,
    });
  });

  page.on("framenavigated", (frame) => {
    const url = frame.url();
    if (url) {
      storage.addHistory?.(url);
    }
  });
*/
  //await page.coverage.startJSCoverage();
}