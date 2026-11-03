import { INITIAL_RESOURCES } from "@/lib/data";
import { DevShelfDashboard } from "@/components/features/resources/devshelf-dashboard";
import { NewsletterSection } from "@/components/features/resources/newsletter-section";
import { prisma } from "@/lib/prisma";
import { Resource } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  let resources: Resource[] = INITIAL_RESOURCES;

  try {
    const dbResources = await prisma.resource.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    if (dbResources.length > 0) {
      resources = dbResources.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        url: r.url,
        category: r.category as Resource["category"],
        difficulty: r.difficulty as Resource["difficulty"],
        tags: r.tags,
        createdAt: r.createdAt.toISOString(),
        stars: r.stars,
        author: r.author ?? undefined,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch resources from database, using fallback:", error);
  }

  return (
    <>
      {/* Search & Hero Section + Resource Catalog Grid */}
      <DevShelfDashboard initialResources={resources} />

      {/* Newsletter Subscription Callout */}
      <NewsletterSection />
    </>
  );
}
