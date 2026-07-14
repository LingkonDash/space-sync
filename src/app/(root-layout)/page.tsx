import Banner from "@/components/home/Banner";
import Category from "@/components/home/Category";
import FAQ from "@/components/home/FAQ";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import HowItWorks from "@/components/home/HowItWorks";
import ImpactMetrics from "@/components/home/ImpactMetrics";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Banner />
      <ImpactMetrics />
      <Category />
      <FeaturedRooms />
      <WhyChooseUs />
      <HowItWorks />
      <FAQ />
      <TestimonialSlider />
    </>
  );
}
