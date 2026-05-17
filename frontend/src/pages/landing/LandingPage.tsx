import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  Compass,
  Globe,
  Users,
  Star,
  ChevronRight,
  Award,
  ArrowRight,
  Play,
} from "lucide-react";
import {
  features,
  guides,
  testimonials,
} from "@/constants/landingPage";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import Testinomial from "@/layouts/components/landing/Testinomial";
import { Marquee } from "@/components/ui/marquee";
import useAuthStore from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { getPopularDestination } from "@/api/landing_page.api";
import type { PopularDestination } from "@/types/interface.type";

const LandingPage = () => {
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));
  const [showDemo, setShowDemo] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [popularDestination, setPopularDestination] = useState<
    PopularDestination[]
  >([]);

  useEffect(() => {
    const handleGetPopularDestination = async () => {
      const data = await getPopularDestination();
      console.log("destination: ", data);
      setPopularDestination(data);
    };

    handleGetPopularDestination();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        {/* background video */}
        <div className="absolute inset-0 z-0">
          <video
            src="/landing_page_video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        {/* hero content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-16 text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span>Explore the world with confidence</span>
          </div>

          <h1 className="text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
            Discover Your Next
            <span className="block">
              <DiaTextReveal
                text="Great Adventure"
                repeat
                colors={[
                  "#fbbf24",
                  "#f97316",
                  "#ef4444",
                  "#fb7185",
                  "#38bdf8",
                  "#22d3ee",
                ]}
                repeatDelay={1.5}
                textColor="#f97316"
              />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Join thousands of travelers discovering hidden gems, planning
            unforgettable trips, and sharing experiences with our global
            community.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={user ? "/dashboard" : "/auth?mode=signup"}
              className="from-primary to-primary/80 shadow-primary/30 flex items-center gap-2 rounded-full bg-gradient-to-r px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              {user ? "Start Planning Now" : "Register Now"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white transition-all hover:bg-white/10"
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </button>
            {showDemo &&
              createPortal(
                <div
                  className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-md"
                  onClick={() => setShowDemo(false)}
                >
                  <div
                    className="relative w-full max-w-5xl px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setShowDemo(false)}
                      className="absolute right-0 z-[1000000] rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/20"
                    >
                      ✕
                    </button>

                    <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
                      <iframe
                        className="h-full w-full"
                        src="/video_demo.mp4"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>,
                document.body,
              )}
          </div>

          {/* stats */}
          <div className="my-12 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm text-white/70">Active Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">120+</div>
              <div className="text-sm text-white/70">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.9</div>
              <div className="text-sm text-white/70">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section
        id="features"
        className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-50">
          <InteractiveGridPattern width={50} height={50} squares={[60, 60]} />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
              <Compass className="h-4 w-4" />
              <span>Why Choose Us</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Everything You Need for
              <br />
              <span className="text-primary">Perfect Travel Planning</span>
            </h2>

            <p className="mt-4 text-gray-500">
              From inspiration to execution, we've got you covered with powerful
              tools and community insights.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="from-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br to-purple-100 transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>

                <p className="mt-2 leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destination */}
      {/* Popular Destination */}
      <section
        id="destinations"
        className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-8 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
                <Globe className="h-4 w-4" />
                <span>Explore</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Popular Destinations
              </h2>
              <p className="mt-2 text-gray-500">
                Handpicked locations our community loves
              </p>
            </div>
            <Link
              to="/community-guide"
              className="text-primary flex items-center gap-1 font-medium transition-all hover:gap-2"
            >
              View All Destinations
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <Marquee reverse pauseOnHover className="py-3 [--duration:40s]">
            {popularDestination.map((dest) => {
              return (
                <div
                  key={dest.topGuide._id}
                  className="group relative mx-2 w-72 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* image container */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={dest.topGuide.thumbnailImage}
                      alt={dest.country}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* left corner popular label */}
                    <div className="absolute top-3 left-3 z-10 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      🔥 Popular
                    </div>

                    {/*  */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* cotent */}
                  <div className="p-4">
                    {/* country */}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{dest.country}</span>
                    </div>

                    {/* description */}
                    <h3 className="mt-1 line-clamp-1 text-lg font-bold text-gray-800">
                      {dest.topGuide.description}
                    </h3>
                  </div>

                  {/*  */}
                  <div className="group-hover:ring-primary/20 absolute inset-0 rounded-2xl ring-1 ring-black/5 transition-all" />
                </div>
              );
            })}
          </Marquee>
        </div>
      </section>

      {/* Community Guides */}
      <section className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
                <Users className="h-4 w-4" />
                <span>Community</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Learn from Real
                <br />
                Travel Experiences
              </h2>
              <p className="mt-4 leading-relaxed text-gray-500">
                Our community of passionate travelers shares authentic guides,
                insider tips, and hidden gems you won't find in typical
                guidebooks.
              </p>

              <div className="mt-8 space-y-4">
                {guides.map((guide, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-xl p-4 transition-all hover:bg-gray-50"
                  >
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                      <img
                        src={guide.avatar}
                        alt={guide.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800">
                          {guide.title}
                        </h4>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-500">
                            {guide.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        By {guide.author} • {guide.reads} reads
                      </p>
                      <button className="text-primary mt-2 flex items-center gap-1 text-sm">
                        Read Guide <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/guides"
                className="text-primary mt-6 inline-flex items-center gap-2 font-medium"
              >
                Explore All Guides
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&h=700&fit=crop"
                  alt="Travel community"
                  className="w-full object-cover"
                />
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-300" />
                      <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-400" />
                      <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-500" />
                    </div>
                    <span className="text-sm">
                      Join 50,000+ travelers sharing their stories
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 hidden rounded-2xl bg-white p-4 shadow-lg lg:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Top Contributor</div>
                    <div className="text-xs text-gray-500">
                      2,345 helpful reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Loved by Travelers Worldwide
          </h2>
          <p className="mt-3 text-gray-500">
            Trusted by thousands of explorers around the world
          </p>
        </div>

        {/* Row 1 */}
        <Marquee pauseOnHover className="py-3 [--duration:35s]">
          {firstRow.map((item, index) => (
            <Testinomial key={index} {...item} />
          ))}
        </Marquee>

        {/* Row 2 */}
        <Marquee reverse pauseOnHover className="py-3 [--duration:40s]">
          {secondRow.map((item, index) => (
            <Testinomial key={index} {...item} />
          ))}
        </Marquee>
      </section>

      {/* CTA action */}
      {!user && (
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="from-primary relative overflow-hidden rounded-3xl bg-gradient-to-r to-purple-600 p-8 text-center md:p-12">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10" />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Ready to Start Your Journey?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-white/80">
                  Join thousands of travelers who are already discovering
                  amazing destinations and planning unforgettable trips.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    to="/dashboard"
                    className="text-primary flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold shadow-lg transition-all hover:scale-105"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button className="flex items-center gap-2 rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition-all hover:bg-white/10">
                    Learn More
                  </button>
                </div>
                <p className="mt-6 text-sm text-white/60">
                  No credit card required • Free forever
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;


