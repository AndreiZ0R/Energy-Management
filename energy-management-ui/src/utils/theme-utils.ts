export const cssVar = (label: string): string => {
   return getComputedStyle(document.body).getPropertyValue(label).replace(/ /g, ",");
}

export const rgbCssVar = (label: string): string => {
   return `rgb(${cssVar(label)})`;
}