import { log } from "@brimble/utils";
import app from "../app";

const PORT = process.env.PORT || 9999;

// Make sure we are running node 12+
const [major, minor] = process.versions.node.split(".").map(parseFloat);
if (major < 12 || (major === 12 && minor <= 10)) {
  console.log(
    "🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou're on an older version of node. Kindly upgrade your node version. 👌\n ",
  );
  process.exit();
}

app.listen(PORT, () => {
  log.info(`Serving on http://localhost:${PORT} 🚀`);
});
