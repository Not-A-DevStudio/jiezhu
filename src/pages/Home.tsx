import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { CodeExample } from "../components/CodeExample";
import { Principle } from "../components/Principle";
import { Philosophy } from "../components/Philosophy";
import { Roadmap } from "../components/Roadmap";

export function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CodeExample />
      <Principle />
      <Philosophy />
      <Roadmap />
    </>
  );
}
