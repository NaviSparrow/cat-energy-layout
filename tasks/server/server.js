import browser from "browser-sync";

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
    port: 3000,
  });
  done();
}
