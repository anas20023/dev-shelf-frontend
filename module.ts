import { module } from "@prisma/composer";
import app from "./service.ts";

export default module("dev-shelf-frontend", ({ provision }) => {
  provision(app);
});
