import { env } from "cloudflare:workers";

export type SiteContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroBody: string;
  storyTitle: string;
  storyBody: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
};

export type Leader = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageKey: string | null;
  position: number;
  published: boolean;
};

export type Business = {
  id: string;
  name: string;
  category: string;
  summary: string;
  location: string | null;
  imageKey: string | null;
  websiteUrl: string | null;
  position: number;
  published: boolean;
};

export type PublicDocument = {
  id: string;
  title: string;
  category: string;
  year: number;
  fileKey: string;
  fileName: string;
  size: number;
};

export type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
};

export const defaultContent: SiteContent = {
  heroEyebrow: "Kavitha Group",
  heroTitle: "Built on trust.",
  heroAccent: "",
  heroBody:
    "From a single room and an instinct for opportunity to a diversified group serving generations of families and enterprises.",
  storyTitle: "A lifetime of enterprise, shaped by people.",
  storyBody:
    "Kavitha Group traces its roots to K. Varghese's earliest ventures, begun from a single room at home. What started with determination and a silver trade grew into a family of enterprises united by trust, accessibility and service.",
  contactPhone: "+91 75919 05656",
  contactEmail: "admin@kavithagroup.in",
  contactAddress:
    "Kavitha Building, Library Road, Municipal Junction, North Paravur, Ernakulam, Kerala 683513",
};

export const defaultLeaders: Leader[] = [
  {
    id: "k-varghese",
    name: "K. Varghese",
    role: "Founder & Chairman",
    bio: "Founder profile placeholder. Add the approved biography, milestones and portrait from the admin panel.",
    imageKey: null,
    position: 1,
    published: true,
  },
  {
    id: "kavitha-varghese",
    name: "Kavitha Varghese",
    role: "Co-founder & Director",
    bio: "Leadership profile placeholder. Add the approved biography and portrait from the admin panel.",
    imageKey: null,
    position: 2,
    published: true,
  },
  {
    id: "kevin-varghese",
    name: "Kevin Varghese",
    role: "Director",
    bio: "Director profile placeholder. Add the approved biography, focus areas and portrait from the admin panel.",
    imageKey: null,
    position: 3,
    published: true,
  },
  {
    id: "k-padmanabhan",
    name: "Dr. K. Padmanabhan",
    role: "General Manager",
    bio: "Management profile placeholder. Add the approved biography, experience and portrait from the admin panel.",
    imageKey: null,
    position: 4,
    published: true,
  },
];

export const defaultBusinesses: Business[] = [
  {
    id: "freemen-investments",
    name: "Freemen Investments",
    category: "NBFC & Finance",
    summary:
      "The Group's RBI-registered NBFC, extending responsible credit and asset-backed financial solutions across Kerala.",
    location: "Across Kerala",
    imageKey: "/assets/head-office.jpg",
    websiteUrl: "https://freemeninvestments.in/",
    position: 1,
    published: true,
  },
  {
    id: "kavitha-finance",
    name: "Kavitha Finance",
    category: "Inclusive Finance",
    summary:
      "Financial services shaped around working women, families and the practical borrowing needs of local communities.",
    location: "North Paravur, Kerala",
    imageKey: "/assets/head-office-2.jpg",
    websiteUrl: null,
    position: 2,
    published: true,
  },
  {
    id: "kavitha-nidhi",
    name: "Kavitha Nidhi Limited",
    category: "Savings & Deposits",
    summary:
      "Established in 2016 to encourage disciplined savings and provide member-focused financial services.",
    location: "Ernakulam, Kerala",
    imageKey: null,
    websiteUrl: null,
    position: 3,
    published: true,
  },
  {
    id: "vypin-kuries",
    name: "Vypin Kuries",
    category: "Community Savings",
    summary:
      "One of the Group's formative ventures, created to encourage savings and deepen lasting community relationships.",
    location: "Cherai, Kerala",
    imageKey: "/assets/vypin-kuries.png",
    websiteUrl: null,
    position: 4,
    published: true,
  },
  {
    id: "kavitha-jewellery",
    name: "Kavitha Jewellery",
    category: "Jewellery",
    summary:
      "Founded in Cherai in 1998, the jewellery business became the foundation of today's Kavitha Group.",
    location: "Cherai, North Paravur",
    imageKey: "/assets/jewellery.png",
    websiteUrl: "https://it17268.wixsite.com/mysite",
    position: 5,
    published: true,
  },
  {
    id: "krithi-by-kavitha",
    name: "Krithi by Kavitha",
    category: "Fashion & Lifestyle",
    summary:
      "A contemporary clothing boutique bringing the Group's eye for quality into fashion and lifestyle retail.",
    location: "Kerala",
    imageKey: null,
    websiteUrl: null,
    position: 6,
    published: true,
  },
  {
    id: "kavitha-event-hub",
    name: "Kavitha Event Hub",
    category: "Events",
    summary:
      "A spacious North Paravur venue designed for weddings, gatherings and meaningful celebrations.",
    location: "Kedamangalam, North Paravur",
    imageKey: "/assets/event-hub.png",
    websiteUrl: null,
    position: 7,
    published: true,
  },
  {
    id: "kavitha-sports-leisure",
    name: "Kavitha Sports & Leisure Club",
    category: "Sports & Leisure",
    summary:
      "A community-minded destination for recreation, wellbeing and shared experiences.",
    location: "Kerala",
    imageKey: null,
    websiteUrl: null,
    position: 8,
    published: true,
  },
];

function mediaUrl(key: string | null): string | null {
  if (!key) return null;
  return key.startsWith("/") || key.startsWith("http") ? key : `/media/${key}`;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const row = await env.DB.prepare(
      "SELECT value FROM content_blocks WHERE key = ? LIMIT 1",
    )
      .bind("site_content")
      .first<{ value: string }>();
    if (!row?.value) return defaultContent;
    return { ...defaultContent, ...(JSON.parse(row.value) as Partial<SiteContent>) };
  } catch {
    return defaultContent;
  }
}

export async function getLeaders(includeDrafts = false): Promise<Leader[]> {
  try {
    const query = includeDrafts
      ? "SELECT * FROM leaders ORDER BY position ASC"
      : "SELECT * FROM leaders WHERE published = 1 ORDER BY position ASC";
    const result = await env.DB.prepare(query).all<Record<string, unknown>>();
    if (!result.results.length) return defaultLeaders;
    return result.results.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      role: String(row.role),
      bio: String(row.bio),
      imageKey: mediaUrl(row.image_key ? String(row.image_key) : null),
      position: Number(row.position),
      published: Boolean(row.published),
    }));
  } catch {
    return defaultLeaders;
  }
}

export async function getBusinesses(includeDrafts = false): Promise<Business[]> {
  try {
    const query = includeDrafts
      ? "SELECT * FROM businesses ORDER BY position ASC"
      : "SELECT * FROM businesses WHERE published = 1 ORDER BY position ASC";
    const result = await env.DB.prepare(query).all<Record<string, unknown>>();
    if (!result.results.length) return defaultBusinesses;
    return result.results.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      category: String(row.category),
      summary: String(row.summary),
      location: row.location ? String(row.location) : null,
      imageKey: mediaUrl(row.image_key ? String(row.image_key) : null),
      websiteUrl: row.website_url ? String(row.website_url) : null,
      position: Number(row.position),
      published: Boolean(row.published),
    }));
  } catch {
    return defaultBusinesses;
  }
}

export async function getDocuments(): Promise<PublicDocument[]> {
  try {
    const result = await env.DB.prepare(
      "SELECT id, title, category, year, file_key, file_name, size FROM documents WHERE published = 1 ORDER BY year DESC, created_at DESC",
    ).all<Record<string, unknown>>();
    return result.results.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      category: String(row.category),
      year: Number(row.year),
      fileKey: String(row.file_key),
      fileName: String(row.file_name),
      size: Number(row.size),
    }));
  } catch {
    return [];
  }
}

export async function getJobs(): Promise<Job[]> {
  try {
    const result = await env.DB.prepare(
      "SELECT id, title, location, type, description FROM jobs WHERE published = 1 ORDER BY created_at DESC",
    ).all<Record<string, unknown>>();
    return result.results.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      location: String(row.location),
      type: String(row.type),
      description: String(row.description),
    }));
  } catch {
    return [];
  }
}
