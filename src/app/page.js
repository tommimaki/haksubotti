"use client";
import "../styles/styles.css";
import { GlobalStateProvider } from "../../context/GlobalStateContext";

import Homepage from "./homepage";

export default function Home() {
  return (
    <GlobalStateProvider>
      <main className="flex min-h-screen flex-col  justify-center p-24">
        <div className="max-w-5xl  w-full">
          <Homepage />
        </div>
      </main>
    </GlobalStateProvider>
  );
}
