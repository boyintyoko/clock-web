import dynamic from "next/dynamic";

export const noSSR = (path: () => Promise<any>) =>
  dynamic(path, {ssr: false});
