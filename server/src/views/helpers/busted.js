export default (file) => (
  process.env.WEBPACK_DEVSERVER_URL
    ? process.env.WEBPACK_DEVSERVER_URL
    : `static/${file}`
);
