import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 20h-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
      <path d="M9 12H5" />
      <path d="M19 12h-4" />
      <path d="M14 8v8" />
      <path d="M9 6V4h6v2" />
      <path d="M9 20v-2h6v2" />
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
