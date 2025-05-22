// Example: render Marp slides in a Next.js page
import Marp from '@marp-team/marp-core';
import fs from 'fs';

export async function getStaticProps() {
  const md = fs.readFileSync('slides.md', 'utf-8');
  const marp = new Marp();
  const { html, css } = marp.render(md);
  return { props: { html, css } };
}

export default function SlidePage({ html, css }) {
  return (
    <div>
      <style>{css}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
