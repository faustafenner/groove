"use client";

import Session from "./Account/Session";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-purple-dark">
        <Provider store={store}>
          <Session>
            <Navbar />
            <main className="container-fluid px-3 py-4">{children}</main>
          </Session>
        </Provider>
      </body>
    </html>
  );
}
