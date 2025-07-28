import type { Route } from "./+types/home";
import { Dashboard } from "../dashboard/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Welcome to clout enterprises. " },
  ];
}

export default function Home() {
  return <Dashboard />;
}
