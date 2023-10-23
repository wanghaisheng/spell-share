import { getBabelOutputPlugin } from "@rollup/plugin-babel"
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

export default {
  input: "index.js",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
    replace({
        __env__: JSON.stringify(process.env.ENV),
        preventAssignment: true,
    }),
    getBabelOutputPlugin({
      presets: ["@babel/preset-env"],
    }),
    terser(),
  ],
}
