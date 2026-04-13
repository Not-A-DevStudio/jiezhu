import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { CodeExample } from "../components/CodeExample";
import { Principle } from "../components/Principle";
import { Philosophy } from "../components/Philosophy";
import { Roadmap } from "../components/Roadmap";
import { BlogShowcase } from "../components/BlogShowcase";

export function Home() {
  return (
    <>
      <Hero />
      <BlogShowcase />
      <Features />
      <CodeExample />
      <Principle />
      <Philosophy />
      <Roadmap />
    </>
  );
}
