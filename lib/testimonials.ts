/**
 * Beta feedback shown on the landing page.
 *
 * Only add quotes from real users who gave written permission to publish
 * their name, role and photo. The section is hidden while this list is empty.
 *
 * TODO(content): collect 3 permissioned quotes from beta users.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Path under /public, e.g. "/testimonials/sara.jpg" (square, ≥ 96px). */
  photo: string;
  /** Must be true — confirms written permission is on file. */
  consent: true;
};

export const TESTIMONIALS: Testimonial[] = [];
