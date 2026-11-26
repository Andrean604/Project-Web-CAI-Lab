import HomeTop from "@/components/HomeTop";
import AboutSection from "@/components/AboutSection";
import CompetitionPreview from "@/components/CompetitionPreview";
import LabGallery from "@/components/LabGallery";

export default function Home() {
  return (
    <>
      {/* 1 dan 2. Hero dan produk unggulan (dari backend) */}
      <HomeTop />

      {/* 3. Prestasi lomba */}
      <CompetitionPreview />

      {/* 4. Foto kondisi lab */}
      <LabGallery />

      {/* 5. Tentang lab */}
      <AboutSection />
    </>
  );
}
