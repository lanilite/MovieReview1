import { v4 } from "uuid";

export function Rating({
  starCount,
  rating,
  reviewCount,
  className,
}: {
  starCount: number;
  rating?: number;
  reviewCount?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {[...Array(5)].map((_, index) => (
        <span
          key={v4()}
          className={index < starCount ? "text-[#ffc107]" : "text-[#e4e5e9]"}
        >
          &#9733;
        </span>
      ))}

      {rating !== undefined && (
        <span className="ml-2">
          {rating} ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
