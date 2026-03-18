import type { CollectionEntry } from "astro:content";
import type { JSX } from "react";

import { joinTags } from "../lib/tags";

export interface PostCardProps {
   post: CollectionEntry<"blog">;
   headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}
export function PostCard ( { post, headingLevel }: PostCardProps ) {
   const Title = ( headingLevel ? `h${ headingLevel }` : 'div' ) as keyof JSX.IntrinsicElements;
   return (
      <section className="post-card">
         <Title className="post-card__title"><a href={`/blog/${post.slug}/`}>{post.data.title}</a></Title>
         <div className="post-card__meta">
            <span className="post-card__date">
               Posted on {post.data.date.toDateString()}
            </span>
            {' '}
            <span className="post-card__tags">
               under {joinTags(post.data.tags, true)}
            </span>
         </div>
         <p className="post-card__excerpt">{post.data.excerpt}</p>
      </section>
   );
}
