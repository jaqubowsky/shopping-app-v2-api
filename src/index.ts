import * as dotenv from "dotenv";
import config from "./config/index";

import app from "./server.js";

dotenv.config();

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}/`);
});
