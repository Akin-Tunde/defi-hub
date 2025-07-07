// Location: src/global.d.ts

// This declares a new namespace for JSX, extending the existing one.
declare namespace JSX {
  // This extends the IntrinsicElements interface, which contains all known HTML elements.
  interface IntrinsicElements {
    // Here, we are adding 'w3m-button' to the list of known elements.
    // We give it a type of 'any' because we don't need to be specific
    // about its props for this to work.
    'w3m-button': any;
  }
}