/** Metro/Babel inlines HF keys at build — `process` is only used for typing here. */
declare const process: {
  env: {
    HF_INFERENCE_API_KEY?: string;
    HF_API_KEY?: string;
    HF_TOKEN?: string;
    NODE_ENV?: string;
  };
};
