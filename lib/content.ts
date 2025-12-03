import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { App, Note } from './types';

const CONTENT_DIR = path.join(process.cwd(), '../../content');

export async function getApps(locale: string): Promise<App[]> {
  if (!locale) return [];
  const appsDir = path.join(CONTENT_DIR, 'apps', locale);

  try {
    const files = await fs.readdir(appsDir);
    const apps = await Promise.all(
      files
        .filter((file) => file.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(appsDir, file), 'utf8');
          return JSON.parse(content) as App;
        })
    );

    return apps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getFeaturedApps(locale: string): Promise<App[]> {
  const apps = await getApps(locale);
  return apps.filter((app) => app.featured).slice(0, 3);
}

export async function getNotes(locale: string): Promise<Note[]> {
  if (!locale) return [];
  const notesDir = path.join(CONTENT_DIR, 'notes', locale);

  try {
    const files = await fs.readdir(notesDir);
    const notes = await Promise.all(
      files
        .filter((file) => file.endsWith('.md'))
        .map(async (file) => {
          const slug = file.replace(/\.md$/, '');
          const content = await fs.readFile(path.join(notesDir, file), 'utf8');
          const { data } = matter(content);

          return {
            slug,
            title: data.title || 'Untitled',
            date: data.date || '',
            excerpt: data.excerpt || '',
            tags: data.tags || [],
          } as Note;
        })
    );

    return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getLatestNotes(locale: string, limit: number = 3): Promise<Note[]> {
  const notes = await getNotes(locale);
  return notes.slice(0, limit);
}

export async function getAppById(locale: string, id: string): Promise<App | null> {
  if (!locale || !id) return null;
  const filePath = path.join(CONTENT_DIR, 'apps', locale, `${id}.json`);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content) as App;
  } catch {
    return null;
  }
}

export async function getNoteBySlug(locale: string, slug: string): Promise<Note | null> {
  if (!locale || !slug) return null;
  const filePath = path.join(CONTENT_DIR, 'notes', locale, `${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      content, // Include markdown body
    } as Note;
  } catch {
    return null;
  }
}
