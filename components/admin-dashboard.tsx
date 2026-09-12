"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Building2, FileText, Inbox, LayoutDashboard, Loader2, LogOut, Plus, Save, Trash2, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Business, Leader, SiteContent } from "@/lib/site-content";

type AdminDocument = { id: string; title: string; category: string; year: number; file_name: string; file_key: string; size: number; published: number };
type AdminJob = { id: string; title: string; location: string; type: string; description: string; published: number; created_at?: number };
type Inquiry = { id: string; name: string; email: string; phone?: string; subject: string; message: string; status: string; created_at: number };
type AdminState = { content: SiteContent; leaders: Leader[]; businesses: Business[]; documents: AdminDocument[]; jobs: AdminJob[]; inquiries: Inquiry[] };

const navItems = [
  ["overview", LayoutDashboard, "Overview"],
  ["content", FileText, "Site content"],
  ["businesses", Building2, "Businesses"],
  ["leadership", UserRound, "Leadership"],
  ["documents", Upload, "Documents"],
  ["careers", BriefcaseBusiness, "Careers"],
  ["inquiries", Inbox, "Enquiries"],
] as const;

export function AdminDashboard({ userEmail }: { userEmail: string }) {
  const [data, setData] = useState<AdminState | null>(null);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");

  async function loadState() {
    const response = await fetch("/api/admin/state", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load admin data");
    setData(await response.json());
  }

  useEffect(() => { void loadState(); }, []);

  async function save(path: string, body: unknown, label: string) {
    setBusy(label); setNotice("");
    const response = await fetch(path, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    setBusy("");
    if (!response.ok) { setNotice("That change could not be saved."); return; }
    setNotice(`${label} saved and ready to publish.`);
  }

  async function uploadFile(file: File, kind: "image" | "document") {
    const body = new FormData(); body.set("file", file); body.set("kind", kind);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    if (!response.ok) throw new Error("Upload failed");
    return response.json() as Promise<{ key: string; url: string; fileName: string; mimeType: string; size: number }>;
  }

  async function uploadLeaderImage(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file || !data) return;
    setBusy(`leader-${index}`);
    try { const uploaded = await uploadFile(file, "image"); const leaders = [...data.leaders]; leaders[index] = { ...leaders[index], imageKey: uploaded.url }; setData({ ...data, leaders }); setNotice("Portrait uploaded. Save leadership to publish it."); }
    catch { setNotice("Portrait upload failed."); } finally { setBusy(""); }
  }

  async function uploadBusinessImage(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file || !data) return;
    setBusy(`business-${index}`);
    try { const uploaded = await uploadFile(file, "image"); const businesses = [...data.businesses]; businesses[index] = { ...businesses[index], imageKey: uploaded.url }; setData({ ...data, businesses }); setNotice("Image uploaded. Save businesses to publish it."); }
    catch { setNotice("Image upload failed."); } finally { setBusy(""); }
  }

  async function uploadDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file || !data) return;
    const title = window.prompt("Document title", file.name.replace(/\.pdf$/i, ""));
    if (!title) return;
    const category = window.prompt("Category: annual, agm, policy or disclosure", "annual") || "annual";
    const year = Number(window.prompt("Year", String(new Date().getFullYear()))) || new Date().getFullYear();
    setBusy("document");
    try {
      const uploaded = await uploadFile(file, "document");
      const response = await fetch("/api/admin/documents", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title, category, year, fileKey: uploaded.key, fileName: uploaded.fileName, mimeType: uploaded.mimeType, size: uploaded.size, published: true }) });
      if (!response.ok) throw new Error("Document metadata failed");
      await loadState(); setNotice("Document uploaded and published.");
    } catch { setNotice("Document upload failed."); } finally { setBusy(""); event.target.value = ""; }
  }

  async function deleteDocument(id: string) {
    if (!window.confirm("Remove this document from the website?")) return;
    setBusy(`delete-${id}`);
    await fetch(`/api/admin/documents?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadState(); setBusy(""); setNotice("Document removed.");
  }

  async function updateInquiry(id: string, status: string) {
    await fetch("/api/admin/inquiries", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (data) setData({ ...data, inquiries: data.inquiries.map((item) => item.id === id ? { ...item, status } : item) });
  }

  if (!data) return <div className="admin-loading"><Loader2 className="spin" /><span>Opening Kavitha Group admin…</span></div>;

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link href="/" className="admin-brand"><img src="/assets/kavitha-mark.png" alt="" /><span>Kavitha Group</span><small>Admin</small></Link>
        <div><span>{userEmail}</span><Link href="/" target="_blank">View site <ArrowUpRight size={14} /></Link><a href="/signout-with-chatgpt?return_to=/"><LogOut size={14} /> Sign out</a></div>
      </header>

      {notice && <div className="admin-notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}

      <Tabs defaultValue="overview" orientation="vertical" className="admin-tabs">
        <TabsList className="admin-sidebar">
          <p>Website controls</p>
          {navItems.map(([value, Icon, label]) => <TabsTrigger value={value} key={value}><Icon size={17} />{label}</TabsTrigger>)}
        </TabsList>

        <div className="admin-workspace">
          <TabsContent value="overview">
            <AdminHeading eyebrow="Dashboard" title="Website overview" body="Everything that powers the public Kavitha Group website, in one place." />
            <div className="admin-stat-grid">
              <AdminStat value={data.businesses.length} label="Businesses" /><AdminStat value={data.leaders.length} label="Leaders" /><AdminStat value={data.documents.length} label="Documents" /><AdminStat value={data.inquiries.filter((item) => item.status === "new").length} label="New enquiries" />
            </div>
            <div className="admin-guide"><h3>Content workflow</h3><ol><li>Replace placeholder leadership portraits and bios.</li><li>Upload AGM reports, annual reports and company policies.</li><li>Review business descriptions and links.</li><li>Add the live admin email before publishing.</li></ol></div>
          </TabsContent>

          <TabsContent value="content">
            <AdminHeading eyebrow="Public website" title="Core site content" body="Edit the main story, hero and head-office details used across the site." />
            <div className="admin-form-grid">
              {(Object.entries(data.content) as Array<[keyof SiteContent, string]>).map(([key, value]) => (
                <label className={key === "storyBody" || key === "heroBody" || key === "contactAddress" ? "span-2" : ""} key={key}>
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                  {key === "storyBody" || key === "heroBody" || key === "contactAddress" ? <Textarea value={value} rows={key === "storyBody" ? 7 : 4} onChange={(event) => setData({ ...data, content: { ...data.content, [key]: event.target.value } })} /> : <Input value={value} onChange={(event) => setData({ ...data, content: { ...data.content, [key]: event.target.value } })} />}
                </label>
              ))}
            </div>
            <Button className="admin-save" onClick={() => save("/api/admin/content", data.content, "Site content")} disabled={busy === "Site content"}>{busy === "Site content" ? <Loader2 className="spin" /> : <Save />}Save site content</Button>
          </TabsContent>

          <TabsContent value="businesses">
            <AdminHeading eyebrow="Portfolio" title="Businesses" body="Edit names, descriptions, locations, links and photography for every Group business." />
            <div className="admin-record-list">
              {data.businesses.map((business, index) => <section className="admin-record" key={business.id}>
                <div className="record-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="record-fields">
                  <div className="field-pair"><label><span>Name</span><Input value={business.name} onChange={(event) => { const businesses = [...data.businesses]; businesses[index] = { ...business, name: event.target.value }; setData({ ...data, businesses }); }} /></label><label><span>Category</span><Input value={business.category} onChange={(event) => { const businesses = [...data.businesses]; businesses[index] = { ...business, category: event.target.value }; setData({ ...data, businesses }); }} /></label></div>
                  <label><span>Summary</span><Textarea rows={4} value={business.summary} onChange={(event) => { const businesses = [...data.businesses]; businesses[index] = { ...business, summary: event.target.value }; setData({ ...data, businesses }); }} /></label>
                  <div className="field-pair"><label><span>Location</span><Input value={business.location ?? ""} onChange={(event) => { const businesses = [...data.businesses]; businesses[index] = { ...business, location: event.target.value }; setData({ ...data, businesses }); }} /></label><label><span>Website URL</span><Input value={business.websiteUrl ?? ""} onChange={(event) => { const businesses = [...data.businesses]; businesses[index] = { ...business, websiteUrl: event.target.value }; setData({ ...data, businesses }); }} /></label></div>
                  <label className="upload-control"><Upload size={16} />{busy === `business-${index}` ? "Uploading…" : "Replace business image"}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadBusinessImage(index, event)} /></label>
                </div>
              </section>)}
            </div>
            <Button className="admin-save" onClick={() => save("/api/admin/businesses", { businesses: data.businesses }, "Businesses")}><Save />Save businesses</Button>
          </TabsContent>

          <TabsContent value="leadership">
            <AdminHeading eyebrow="People" title="Leadership profiles" body="The four initial profiles are placeholders. Upload approved portraits and replace the draft biographies here." />
            <div className="admin-record-list">
              {data.leaders.map((leader, index) => <section className="admin-record leader-record" key={leader.id}>
                <div className="admin-avatar">{leader.imageKey ? <img src={leader.imageKey} alt="" /> : leader.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                <div className="record-fields">
                  <div className="field-pair"><label><span>Name</span><Input value={leader.name} onChange={(event) => { const leaders = [...data.leaders]; leaders[index] = { ...leader, name: event.target.value }; setData({ ...data, leaders }); }} /></label><label><span>Role</span><Input value={leader.role} onChange={(event) => { const leaders = [...data.leaders]; leaders[index] = { ...leader, role: event.target.value }; setData({ ...data, leaders }); }} /></label></div>
                  <label><span>Biography</span><Textarea rows={5} value={leader.bio} onChange={(event) => { const leaders = [...data.leaders]; leaders[index] = { ...leader, bio: event.target.value }; setData({ ...data, leaders }); }} /></label>
                  <label className="upload-control"><Upload size={16} />{busy === `leader-${index}` ? "Uploading…" : "Upload portrait"}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadLeaderImage(index, event)} /></label>
                </div>
              </section>)}
            </div>
            <Button className="admin-save" onClick={() => save("/api/admin/leadership", { leaders: data.leaders }, "Leadership")}><Save />Save leadership</Button>
          </TabsContent>

          <TabsContent value="documents">
            <AdminHeading eyebrow="Investor Corner" title="Reports and policies" body="Upload PDFs up to 15 MB. Published files appear immediately in the public document library." />
            <label className="document-drop"><Upload size={28} /><strong>{busy === "document" ? "Uploading document…" : "Upload a PDF"}</strong><span>AGM report, annual report, company policy or disclosure</span><input type="file" accept="application/pdf" onChange={uploadDocument} disabled={busy === "document"} /></label>
            <div className="admin-document-list">
              {data.documents.map((document) => <article key={document.id}><FileText size={19} /><div><strong>{document.title}</strong><span>{document.category} · {document.year} · {(document.size / 1_000_000).toFixed(1)} MB</span></div><Button variant="ghost" size="icon" onClick={() => deleteDocument(document.id)} aria-label={`Delete ${document.title}`}>{busy === `delete-${document.id}` ? <Loader2 className="spin" /> : <Trash2 />}</Button></article>)}
              {!data.documents.length && <p className="admin-empty">No documents uploaded yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="careers">
            <AdminHeading eyebrow="Recruitment" title="Career openings" body="Publish, revise and remove roles shown on the public Careers page." />
            <Button variant="outline" onClick={() => setData({ ...data, jobs: [...data.jobs, { id: crypto.randomUUID(), title: "New position", location: "North Paravur, Kerala", type: "Full time", description: "Add the role description, responsibilities and requirements.", published: 1, created_at: Date.now() }] })}><Plus />Add opening</Button>
            <div className="admin-record-list compact-records">
              {data.jobs.map((job, index) => <section className="admin-record" key={job.id}><div className="record-fields"><div className="field-pair"><label><span>Job title</span><Input value={job.title} onChange={(event) => { const jobs = [...data.jobs]; jobs[index] = { ...job, title: event.target.value }; setData({ ...data, jobs }); }} /></label><label><span>Location</span><Input value={job.location} onChange={(event) => { const jobs = [...data.jobs]; jobs[index] = { ...job, location: event.target.value }; setData({ ...data, jobs }); }} /></label></div><label><span>Description</span><Textarea rows={4} value={job.description} onChange={(event) => { const jobs = [...data.jobs]; jobs[index] = { ...job, description: event.target.value }; setData({ ...data, jobs }); }} /></label></div></section>)}
            </div>
            {!!data.jobs.length && <Button className="admin-save" onClick={() => save("/api/admin/jobs", { jobs: data.jobs }, "Career openings")}><Save />Save openings</Button>}
          </TabsContent>

          <TabsContent value="inquiries">
            <AdminHeading eyebrow="Inbox" title="Website enquiries" body="Review the latest enquiries and track follow-up status." />
            <div className="inquiry-list">
              {data.inquiries.map((inquiry) => <article key={inquiry.id}><div className="inquiry-meta"><span>{inquiry.subject}</span><time>{new Date(inquiry.created_at).toLocaleDateString()}</time></div><h3>{inquiry.name}</h3><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>{inquiry.phone && <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>}<p>{inquiry.message}</p><select value={inquiry.status} onChange={(event) => updateInquiry(inquiry.id, event.target.value)}><option value="new">New</option><option value="in-progress">In progress</option><option value="closed">Closed</option></select></article>)}
              {!data.inquiries.length && <p className="admin-empty">No enquiries yet.</p>}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}

function AdminHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <div className="admin-heading"><span>{eyebrow}</span><h1>{title}</h1><p>{body}</p></div>;
}
function AdminStat({ value, label }: { value: number; label: string }) {
  return <article><strong>{value}</strong><span>{label}</span></article>;
}
