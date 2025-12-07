"use client";

import Link from "next/link";
import Image from "next/image";

interface AlbumCardProps {
  album: {
    spotifyId: string;
    name: string;
    artist: string;
    image: string;
  };
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/Album/${album.spotifyId}`} className="text-decoration-none">
      <div className="album-card">
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1/1",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Image
            src={album.image || "/placeholder-album.png"}
            alt={album.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <h6 className="mt-2 mb-1 text-white text-center">{album.name}</h6>
        <p
          className="text-cream small text-center mb-0"
          style={{ opacity: 0.7 }}
        >
          {album.artist}
        </p>
      </div>
    </Link>
  );
}
