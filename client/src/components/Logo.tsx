"use client";

import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: { text: "40px", vinyl: 25 },
    md: { text: "100px", vinyl: 75 },
    lg: { text: "175px", vinyl: 110 },
  };

  const { text, vinyl } = sizes[size];

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
          width: vinyl,
          height: vinyl,
          position: "relative",
        }}
      >
        <span
          className="spin-slow"
          style={{
            display: "block",
            width: vinyl,
            height: vinyl,
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
            width={vinyl}
            height={vinyl}
            style={{
              objectFit: "contain",
              display: "block",
            }}
          />
        </span>
      </span>
      ve
    </span>
  );
}
