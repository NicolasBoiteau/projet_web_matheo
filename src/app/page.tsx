import { HeroSection } from "@/components/home/HeroSection"
import { ServicesGrid } from "@/components/home/ServicesGrid"
import { StatsCounter } from "@/components/home/StatsCounter"
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel"
import { CTASection } from "@/components/home/CTASection"
import { getHomeServices, getHomeStats, getTestimonials } from "@/lib/content.server"

export default async function HomePage() {
  const [services, stats, testimonials] = await Promise.all([
    getHomeServices(),
    getHomeStats(),
    getTestimonials(),
  ])

  return (
    <>
      <HeroSection />
      <ServicesGrid services={services} />
      <StatsCounter stats={stats} />
      <TestimonialsCarousel testimonials={testimonials} />
      <CTASection />
    </>
  )
}
