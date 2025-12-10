"use client";

import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: { text: "40px", vinyl: 25 },
    md: { text: "100px", vinyl: 75 },
    lg: { text: "clamp(80px, 15vw, 175px)", vinyl: "clamp(60, 10vw, 110)" },
  };

  const { text, vinyl } = sizes[size];
  const vinylSize = typeof vinyl === "string" ? 110 : vinyl;

  return (
    <span
      className="d-inline-flex align-items-center"
      style={{
        fontSize: text,
        color: "#F2E9E9",
        fontFamily: "'Fredoka One', cursive",
      }}
    >
      Gro
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: typeof vinyl === "string" ? "0.63em" : vinyl,
          height: typeof vinyl === "string" ? "0.63em" : vinyl,
          position: "relative",
        }}
      >
        <span
          className="spin-slow"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            transformOrigin: "center center",
          }}
        >
          <Image
            src="/vinyl.png"
            alt="o"
            width={vinylSize}
            height={vinylSize}
            style={{
              objectFit: "contain",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          />
        </span>
      </span>
      ve
    </span>
  );
}
