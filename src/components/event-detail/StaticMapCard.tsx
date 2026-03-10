"use client";

interface StaticMapCardProps {
  lat: string;
  lng: string;
  address: string;
  locationName?: string;
}

export default function StaticMapCard({
  lat,
  lng,
  address,
  locationName,
}: StaticMapCardProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapSrc = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=600x300&scale=2&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
  const directionsHref = `https://maps.google.com/?q=${lat},${lng}`;

  return (
    <a
      href={directionsHref}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 block"
    >
      <img
        src={mapSrc}
        alt={`Map showing ${locationName ?? address}`}
        className="h-40 w-full rounded-[var(--radius-md)] object-cover"
        loading="lazy"
      />
      <div className="mt-2 px-0.5">
        {locationName && (
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {locationName}
          </p>
        )}
        <p className="text-xs text-[var(--color-text-muted)]">{address}</p>
        <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
          Tap for directions
        </p>
      </div>
    </a>
  );
}
