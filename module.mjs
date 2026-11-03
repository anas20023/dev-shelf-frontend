// @ts-check
import { module } from "@prisma/composer";
import devShelfService from "./service.mjs";

export default module("dev-shelf", ({ provision }) => {
  provision(devShelfService, { id: "devshelf" });
});
