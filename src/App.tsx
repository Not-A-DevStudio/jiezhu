import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { CodeExample } from "./components/CodeExample";
import { Principle } from "./components/Principle";
import { Philosophy } from "./components/Philosophy";
import { Roadmap } from "./components/Roadmap";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <Header />
      <main className="relative">
        <Hero />
        <Features />
        <CodeExample />
        <Principle />
        <Philosophy />
        <Roadmap />
      </main>
      <Footer />
    </div>
  );
}

export default App;