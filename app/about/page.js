import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { Shield, Zap, Star, Truck, Users, Award } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Quality First",
    desc: "100% satisfaction guarantee. We reprint or refund — no questions asked.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    desc: "Same-day, rush, and standard options. We deliver when you need it.",
  },
  {
    icon: Star,
    title: "Premium Materials",
    desc: "Only the finest paper stocks, vibrant inks, and lasting finishes.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    desc: "Real-time tracking from production to your door, every time.",
  },
  {
    icon: Users,
    title: "Expert Support",
    desc: "Our team of print specialists is ready to help with any question.",
  },
  {
    icon: Award,
    title: "Proven Track Record",
    desc: "Over 50,000 happy customers and 2M+ products delivered.",
  },
];

const team = [
  { name: "Alex Rivera", role: "Founder & CEO", initial: "A" },
  { name: "Priya Sharma", role: "Head of Production", initial: "P" },
  { name: "Marcus Lee", role: "Lead Designer", initial: "M" },
  { name: "Sofia Chen", role: "Customer Success", initial: "S" },
];

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-ink-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-5xl font-bold mb-5">
            We Print Your Vision
          </h1>
          <p className="text-ink-300 text-xl leading-relaxed max-w-2xl mx-auto">
            PrintCraft was founded with one goal: make premium printing
            accessible to every business, big or small. We combine cutting-edge
            technology with old-school craftsmanship to deliver prints that make
            an impression.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-500 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
          {[
            { value: "50,000+", label: "Happy Customers" },
            { value: "2M+", label: "Products Delivered" },
            { value: "4.9★", label: "Average Rating" },
            { value: "10 Years", label: "In Business" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-bold">{stat.value}</p>
              <p className="text-brand-100 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="font-display font-bold text-xl text-ink-900 mb-2">
                {title}
              </h3>
              <p className="text-ink-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-ink-50 border-y border-ink-100 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">The Team Behind PrintCraft</h2>
            <p className="section-subtitle mx-auto">
              Passionate people dedicated to your print success
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="card p-6 text-center">
                <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-display font-bold text-2xl">
                    {member.initial}
                  </span>
                </div>
                <p className="font-semibold text-ink-900">{member.name}</p>
                <p className="text-sm text-ink-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="section-title mb-4">Ready to Work Together?</h2>
        <p className="text-ink-500 text-lg mb-8">
          Get premium prints delivered fast. Browse our full catalog and get an
          instant quote.
        </p>
        <Link href="/products" className="btn-primary text-lg px-10 py-4">
          Browse Products
        </Link>
      </section>
    </MainLayout>
  );
}
