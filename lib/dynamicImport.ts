import dynamic from "next/dynamic";
import {ComponentType} from "react";

export function noSSR<T>(
  fn: () => Promise<{default: ComponentType<T>}>
) {
  return dynamic(fn, {ssr: false});
}
