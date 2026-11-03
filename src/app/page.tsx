import { Prisma } from "@prisma/client";
import { INITIAL_RESOURCES } from "@/lib/data";
import { DevShelfDashboard } from "@/components/features/resources/devshelf-dashboard";
import { NewsletterSection } from "@/components/features/resources/newsletter-section";
import { prisma } from "@/lib/prisma";
import { Resource, Category, Difficulty, SortOption } from "@/lib/types";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    difficulty?: string;
    sort?: string;
    view?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const rawPage = parseInt(params.page || "1", 10);
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const query = typeof params.q === "string" ? params.q.trim() : "";
  const categoryParam = typeof params.category === "string" ? params.category : "All Categories";
  const difficultyParam =
    typeof params.difficulty === "string" && ["Beginner", "Intermediate", "Advanced"].includes(params.difficulty)
      ? (params.difficulty as Difficulty)
      : "All";
  const sortParam =
    typeof params.sort === "string" && ["stars", "newest", "title", "difficulty"].includes(params.sort)
      ? (params.sort as SortOption)
      : "stars";
  const viewParam = params.view === "list" ? "list" : "grid";

  // Build Prisma Where
  const where: Prisma.ResourceWhereInput = {};

  if (categoryParam && categoryParam !== "All Categories") {
    where.category = { equals: categoryParam };
  }

  if (difficultyParam && difficultyParam !== "All") {
    where.difficulty = { equals: difficultyParam };
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { tags: { has: query.startsWith("#") ? query : `#${query}` } },
      { tags: { has: query } },
    ];
  }

  // Build Prisma OrderBy
  let orderBy: Prisma.ResourceOrderByWithRelationInput = { stars: "desc" };
  if (sortParam === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sortParam === "title") {
    orderBy = { title: "asc" };
  } else if (sortParam === "difficulty") {
    orderBy = { difficulty: "asc" };
  }

  let resources: Resource[] = [];
  let totalCount = 0;

  try {
    const hasFilters = Boolean(
      query ||
      (categoryParam && categoryParam !== "All Categories") ||
      (difficultyParam && difficultyParam !== "All")
    );

    const skip = (currentPage - 1) * PAGE_SIZE;

    // Optimized count calculation:
    // If no filters are active, use PostgreSQL reltuples from pg_class for instant sub-millisecond response on 2M+ rows.
    // If filters are active, use indexed prisma.resource.count({ where }).
    const [dbResources, count] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy,
      }),
      hasFilters
        ? prisma.resource.count({ where })
        : prisma.$queryRawUnsafe<{ count: bigint }[]>(
            `SELECT reltuples::bigint AS count FROM pg_class WHERE relname = 'Resource'`
          ).then((rows) => Number(rows[0]?.count ?? 2000000)),
    ]);

    totalCount = count;

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
    console.error("Database query failed, using fallback:", error);
    resources = INITIAL_RESOURCES;
    totalCount = INITIAL_RESOURCES.length;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <>
      {/* Server-Side Paginated Dashboard */}
      <DevShelfDashboard
        resources={resources}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        initialQuery={query}
        initialCategory={categoryParam as Category}
        initialDifficulty={difficultyParam}
        initialSort={sortParam}
        initialView={viewParam}
      />

      {/* Newsletter Subscription Callout */}
      <NewsletterSection />
    </>
  );
}
