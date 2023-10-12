"use client";
import { GlobalStateProvider } from "../../context/GlobalStateContext";
import FormPage from "../../components/form";
import CompanyDataDisplay from "../../components/CompanyDataDisplay";
import Homepage from "./homepage";

export default function Home() {
  return (
    <GlobalStateProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="max-w-5xl border-2 border-indigo-600 w-full text-center">
          <Homepage />
        </div>
      </main>
    </GlobalStateProvider>
  );
}
