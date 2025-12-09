"use client";

import Session from "./Account/Session";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body
        className="bg-purple-dark"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Provider store={store}>
          <Session>
            <Navbar />
            <main className="container-fluid px-3 py-4" style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </Session>
        </Provider>
      </body>
    </html>
  );
}
