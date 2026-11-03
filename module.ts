import { module } from "@prisma/composer";
import app from "./service";

export default module("dev-shelf-frontend", ({ provision }) => {
  provision(app);
});
