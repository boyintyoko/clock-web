import urlData from "@/data/urlData";

export default function VersionFunc() {

  const isNowVersion = "1.0.0"

  const version = localStorage.getItem("version");
  if (!version || version !== isNowVersion) {
    localStorage.setItem("version", isNowVersion);
    localStorage.removeItem("urlData");
    localStorage.setItem("urlData", JSON.stringify(urlData))
  }

  return;
}
