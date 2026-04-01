import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Demo } from "./pages/Demo";
import { Blog } from "./pages/Blog";

function App() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 flex flex-col">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <Header />
      <main className="relative flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;