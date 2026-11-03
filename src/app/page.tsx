import { INITIAL_RESOURCES } from "@/lib/data";
import { DevShelfDashboard } from "@/components/features/resources/devshelf-dashboard";
import { NewsletterSection } from "@/components/features/resources/newsletter-section";

export default function Home() {
  return (
    <>
      {/* Search & Hero Section + Resource Catalog Grid */}
      <DevShelfDashboard initialResources={INITIAL_RESOURCES} />

      {/* Newsletter Subscription Callout */}
      <NewsletterSection />
    </>
  );
}
