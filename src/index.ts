import * as dotenv from "dotenv";
dotenv.config();

import Publisher from "./publisher";
import Pet from "./pet";

new Publisher(new Pet('sociablesteve', true), '76884091');

