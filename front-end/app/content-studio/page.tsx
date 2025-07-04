"use client";

import ContentStudio from "@/components/departments/content-studio";

export default function ContentStudioPage() {
  const handleBack = () => {
    if (typeof window !== "undefined") window.history.back();
  };

  return (
    <ContentStudio
      onBackAction={handleBack}
      department={{ name: "Content Studio" }}
    />
  );
}
