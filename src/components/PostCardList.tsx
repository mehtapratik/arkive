import type { CollectionEntry } from "astro:content";

import { PostCard } from "./PostCard";

export interface PostCardListProps {
   posts: CollectionEntry<"blog">[];
   headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}
export function PostCardList ( { posts, headingLevel }: PostCardListProps ) {
   return (
      <ul className="post-card-list">
         {posts.map((post) => (
            <li className="post-card-list__item" key={post.slug}>
               <PostCard post={post} headingLevel={headingLevel} />
            </li>
         ))}
      </ul>
   );
}
