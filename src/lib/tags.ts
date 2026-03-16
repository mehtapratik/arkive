// src/lib/tags.ts
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Returns all blog posts and a Map of tag -> posts
 */
export async function getPostsByTag() {
  const posts = await getCollection('blog');

  const tagMap = new Map<string, CollectionEntry<'blog'>[]>();

  for (const post of posts) {
    const tags = post.data.tags ?? [];
    for (const tag of tags) {
      const normalized = tag.toLowerCase(); // optional normalization
      const list = tagMap.get(normalized) ?? [];
      list.push(post);
      tagMap.set(normalized, list);
    }
  }

  return { posts, tagMap };
}

export async function getLastNPosts(n: number) {
  const posts = await getCollection('blog');
  const postsSorted = [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return postsSorted.slice(0, n);
}

/**
 * Convenience: get a sorted array of unique tags
 */
export async function getAllTags() {
  const { tagMap } = await getPostsByTag();
  return Array.from(tagMap.keys()).sort((a, b) => a.localeCompare(b));
}

export async function getTagsByPostCount() {
  const { tagMap } = await getPostsByTag();
  const tags = new Map<string, number>();
  for (const [tag, posts] of tagMap.entries()) {
    tags.set(tag, posts.length);
  }
  return Array.from(tags.entries()).sort((a, b) => b[1] - a[1]);
}


export const joinTags = (tags: string[], trim = false) => {
  if (!tags || tags.length === 0) {
    return "";
  }

  if (tags.length === 1) {
    return tags[0];
  }

  if (tags.length === 2) {
    return `${tags[0]} and ${tags[1]}`;
  }

  if (trim) {
    return `${tags[0]}, ${tags[1]}, and ${tags.length - 2} more`;
  }

  // join all tags with a comma and an and before the last tag
  return tags.slice(0, -1).join(', ') + ' and ' + tags[tags.length - 1];
}

export const joinTagsWithLinks = (tags: string[]) => {
  if (!tags || tags.length === 0) {
    return "";
  }
  if (tags.length === 1) {
    return `<a href="/tags/${tags[0]}/">${tags[0]}</a>`;
  }
  if (tags.length === 2) {
    return `<a href="/tags/${tags[0]}/">${tags[0]}</a> and <a href="/tags/${tags[1]}/">${tags[1]}</a>`;
  }
  return tags.slice(0, -1).map((tag) => `<a href="/tags/${tag}/">${tag}</a>`).join(', ') + ', and ' + `<a href="/tags/${tags[tags.length - 1]}/">${tags[tags.length - 1]}</a>`;
}
