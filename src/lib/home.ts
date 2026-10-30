import { homedir } from "node:os";
import { join } from "node:path";
const home = process.env.FASTWD_HOME ?? join(homedir(), ".fastwd");
export default home;
