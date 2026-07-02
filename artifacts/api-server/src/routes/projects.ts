import { Router } from "express";
import { db, projectsTable, insertProjectSchema } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router = Router();

router.get("/projects", async (req, res) => {
  try {
    const projects = await db
      .select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.createdAt));
    res.json(projects);
  } catch (err) {
    req.log.error(err, "Failed to list projects");
    res.status(500).json({ error: "Failed to list projects" });
  }
});

router.post("/projects", async (req, res) => {
  const parsed = insertProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [project] = await db.insert(projectsTable).values(parsed.data).returning();
    res.status(201).json(project);
  } catch (err) {
    req.log.error(err, "Failed to create project");
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const deleted = await db.delete(projectsTable).where(eq(projectsTable.id, id)).returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete project");
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
