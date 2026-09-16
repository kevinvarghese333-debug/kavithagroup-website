import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { businesses, contentBlocks, documents, jobs, leaders } from "@/db/schema";

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
  contactEmail: "it@kavithagroup.in",
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
    imageKey: "/assets/leadership/kevin-varghese.jpg",
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
  return key.startsWith("/") || key.startsWith("http") ? key : null;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const [row] = await getDb()
      .select({ value: contentBlocks.value })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, "site_content"))
      .limit(1);
    if (!row?.value) return defaultContent;
    return { ...defaultContent, ...(JSON.parse(row.value) as Partial<SiteContent>) };
  } catch {
    return defaultContent;
  }
}

export async function getLeaders(includeDrafts = false): Promise<Leader[]> {
  try {
    const db = getDb();
    const rows = includeDrafts
      ? await db.select().from(leaders).orderBy(asc(leaders.position))
      : await db.select().from(leaders).where(eq(leaders.published, true)).orderBy(asc(leaders.position));
    if (!rows.length) return defaultLeaders;
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      bio: row.bio,
      imageKey: mediaUrl(row.imageKey),
      position: row.position,
      published: row.published,
    }));
  } catch {
    return defaultLeaders;
  }
}

export async function getBusinesses(includeDrafts = false): Promise<Business[]> {
  try {
    const db = getDb();
    const rows = includeDrafts
      ? await db.select().from(businesses).orderBy(asc(businesses.position))
      : await db.select().from(businesses).where(eq(businesses.published, true)).orderBy(asc(businesses.position));
    if (!rows.length) return defaultBusinesses;
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      summary: row.summary,
      location: row.location,
      imageKey: mediaUrl(row.imageKey),
      websiteUrl: row.websiteUrl,
      position: row.position,
      published: row.published,
    }));
  } catch {
    return defaultBusinesses;
  }
}

export async function getDocuments(): Promise<PublicDocument[]> {
  try {
    const rows = await getDb()
      .select({
        id: documents.id,
        title: documents.title,
        category: documents.category,
        year: documents.year,
        fileKey: documents.fileKey,
        fileName: documents.fileName,
        size: documents.size,
      })
      .from(documents)
      .where(eq(documents.published, true))
      .orderBy(desc(documents.year), desc(documents.createdAt));
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      year: row.year,
      fileKey: row.fileKey,
      fileName: row.fileName,
      size: row.size,
    }));
  } catch {
    return [];
  }
}

export async function getJobs(): Promise<Job[]> {
  try {
    const rows = await getDb()
      .select({
        id: jobs.id,
        title: jobs.title,
        location: jobs.location,
        type: jobs.type,
        description: jobs.description,
      })
      .from(jobs)
      .where(eq(jobs.published, true))
      .orderBy(desc(jobs.createdAt));
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      location: row.location,
      type: row.type,
      description: row.description,
    }));
  } catch {
    return [];
  }
}
