/**
 * Renders WordPress `content.rendered` HTML inside the site's typography.
 * The WP backend is trusted (first-party); if you syndicate untrusted content,
 * sanitize `html` server-side (e.g. with isomorphic-dompurify) before this point.
 */
export default function WPContent({ html }: { html: string }) {
  return (
    <div
      className="wp-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
