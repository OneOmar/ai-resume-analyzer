import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resumind – AI Resume Analyzer" },
    { name: "description", content: "Get instant AI feedback on your resume and improve your chances of getting hired." },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading">
        <h1>Track Tour Applications & Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>
    </section>
  </main>;
}
