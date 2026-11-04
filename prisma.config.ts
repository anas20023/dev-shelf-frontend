import "dotenv/config";
import { definePrismaConfig } from "@prisma/cli-engine";

export default definePrismaConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
