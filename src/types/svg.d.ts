declare module '*.svg' {
    import React from 'react';
    const SVG: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}
