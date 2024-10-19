import { FlattenSimpleInterpolation } from 'styled-components';

export const XXS = 568;
export const XS = 768;
export const S = 896;
export const M = 1024;
export const L = 1280;

export const xxsMax = XXS - 1;
export const xxsMin = XXS;

export const xsMax = S - 1;
export const xsMin = XS;

export const sMax = M - 1;
export const sMin = S;

export const mMax = L - 1;
export const mMin = M;

export const mobile = (content: FlattenSimpleInterpolation): string => {
  return `
    @media (max-width: ${xxsMax}px) {
        ${content.join('')}    
    }
    `;
};

export const aboveMobile = (content: FlattenSimpleInterpolation): string => {
  return `
      @media (min-width: ${xxsMin}px) {
          ${content.join('')}    
      }
      `;
};

export const tablet = (content: FlattenSimpleInterpolation): string => {
  return `
        @media (max-width: ${sMax}px) {
            ${content.join('')}    
        }
        `;
};

export const laptop = (content: FlattenSimpleInterpolation): string => {
  return `
        @media (max-width: ${mMax}px) {
            ${content.join('')}    
        }
        `;
};
