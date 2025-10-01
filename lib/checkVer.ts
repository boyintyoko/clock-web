"use client"

import {useEffect} from "react";

export default function checkVersion() {
  const APP_VERSION = "1.0.0";

  useEffect(() => {
    const version = localStorage.getItem('APP_VERSION');
    if (version === APP_VERSION) return;
    localStorage.removeItem("urlData");
    localStorage.setItem("APP_VERSION", APP_VERSION)
  }, [])
}
