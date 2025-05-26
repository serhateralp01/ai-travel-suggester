
import React from 'react';

export const AirportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" // Using a 20x20 viewbox
    fill="currentColor" 
    {...props}
  >
    <path d="M10.75 1.914a.75.75 0 00-1.5 0v.586L5.902 6.25H4.75a.75.75 0 000 1.5h1.152L3.32 11.332a2.251 2.251 0 001.09 2.956l.469.2c.36.153.75.229 1.131.229.939 0 1.799-.522 2.21-1.37L10 10.395l1.78 2.955a2.25 2.25 0 003.81-.077l.468-.2a2.251 2.251 0 001.09-2.956L14.098 7.75h1.152a.75.75 0 000-1.5h-1.152L10.75 2.5V1.914z" />
  </svg>
);