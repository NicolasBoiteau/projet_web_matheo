import { ImageResponse } from "next/og"
import { SITE_CONFIG } from "@/lib/utils/constants"

// Image Open Graph par défaut (partage réseaux sociaux), générée à la volée.
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = SITE_CONFIG.name

const GOLD = "#C5A55A"
const FIR = "#1B3A2D"
const CREAM = "#F7F4EE"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: FIR,
          color: CREAM,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: 24,
          }}
        >
          {`Centre équestre · ${SITE_CONFIG.address.city}`}
        </div>
        <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.05 }}>
          {SITE_CONFIG.name}
        </div>
        <div style={{ fontSize: 40, color: GOLD, marginTop: 16 }}>
          {SITE_CONFIG.tagline}
        </div>
        <div
          style={{
            marginTop: 48,
            height: 6,
            width: 220,
            background: GOLD,
            borderRadius: 4,
          }}
        />
      </div>
    ),
    size
  )
}
