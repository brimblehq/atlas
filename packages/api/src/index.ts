import { log } from "@brimble/utils";
import app from "../app";

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => {
  log.info(`Serving on http://localhost:${PORT} 🚀`);
});
