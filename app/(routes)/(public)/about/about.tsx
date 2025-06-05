import Layout from "@/components/Layout";
import {
  Smile,
  ThumbsUp,
  TrendingUp,
  Users,
  Award,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="bg-cover  text-white py-16"
        style={{ backgroundImage: "url('/ab.jpeg')" }}
      >
        <div className=" py-16">
          {" "}
          {/* Optional overlay for readability */}
          <div className="pl-8 pr-2 m-0">
            <div className="text-left p-0 m-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About Corde Stitch
              </h1>
              <p className="text-lg text-gray-300">
                We're revolutionizing the custom t-shirt industry in India with
                premium <br />
                quality products and cutting-edge design tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#3b3b3b]">Our Story</h2>
              <p className="text-gray-700">
                Founded in 2022, Corde Stitch began with a simple mission: to
                make high-quality custom t-shirts accessible to everyone in
                India. Our founders, Rahul and Priya, were frustrated by the
                lack of options for premium custom apparel that didn't break the
                bank.
              </p>
              <p className="text-gray-700">
                Starting from a small workshop in Bangalore, we've now grown
                into a nationwide brand, trusted by individuals, businesses, and
                organizations across the country. We take pride in our Indian
                heritage and commitment to quality craftsmanship.
              </p>
              <p className="text-gray-700">
                Today, Corde Stitch continues to innovate with state-of-the-art
                design tools and premium materials, making it easier than ever
                to express your unique style through custom apparel.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/gg.jpg"
                alt="Our workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3b3b3b]">Our Values</h2>
            <p className="text-gray-700 mt-4">
              At Corde Stitch, we're guided by a set of core values that shape
              everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#3b3b3b]/10 rounded-lg flex items-center justify-center mb-4">
                <ThumbsUp size={24} className="text-brand-accent" />
              </div>
              <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">
                Quality First
              </h3>
              <p className="text-gray-700">
                We never compromise on quality. From premium cotton fabrics to
                durable prints, we ensure every product meets our high
                standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#3b3b3b]/10 rounded-lg flex items-center justify-center mb-4">
                <Smile size={24} className="text-brand-accent" />
              </div>
              <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">
                Customer Happiness
              </h3>
              <p className="text-gray-700">
                Your satisfaction is our priority. We go the extra mile to
                ensure you love your custom t-shirts and have a great
                experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#3b3b3b]/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-brand-accent" />
              </div>
              <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">
                Continuous Innovation
              </h3>
              <p className="text-gray-700">
                We're constantly improving our products, design tools, and
                processes to provide you with the best custom t-shirt
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3b3b3b]">
              Why Choose Corde Stitch?
            </h2>
            <p className="text-gray-700 mt-4">
              When it comes to custom t-shirts in India, here's why we stand out
              from the crowd.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-[#3b3b3b] rounded-full flex items-center justify-center">
                  <Shield size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">
                  Premium Quality Materials
                </h3>
                <p className="text-gray-700">
                  We use 100% combed cotton for ultimate comfort and durability.
                  Our t-shirts maintain their shape, color, and print quality
                  even after multiple washes.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-[#3b3b3b] rounded-full flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">
                  Expert Design Support
                </h3>
                <p className="text-gray-700">
                  Not a design expert? No problem! Our team can help you bring
                  your ideas to life or suggest improvements to your designs.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-[#3b3b3b] rounded-full flex items-center justify-center">
                  <Award size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">
                  Made in India
                </h3>
                <p className="text-gray-700">
                  We take pride in being an Indian brand. All our products are
                  locally sourced and manufactured, supporting local communities
                  and reducing our carbon footprint.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-[#3b3b3b] rounded-full flex items-center justify-center">
                  <TrendingUp size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">
                  Competitive Pricing
                </h3>
                <p className="text-gray-700">
                  Get premium quality custom t-shirts without breaking the bank.
                  We offer competitive prices without compromising on quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3b3b3b]">Our Values</h2>
            <p className="text-lg text-[#3b3b3b]/70 mt-4 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#3b3b3b]/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#3b3b3b]">1</span>
              </div>
              <h3 className="text-xl font-semibold text-[#3b3b3b] mb-3">
                Quality First
              </h3>
              <p className="text-[#3b3b3b]/70">
                We never compromise on the quality of our products. From the
                fabric we use to the printing technology we employ, everything
                is selected to ensure longevity and customer satisfaction.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#3b3b3b]/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#3b3b3b]">2</span>
              </div>
              <h3 className="text-xl font-semibold text-[#3b3b3b] mb-3">
                Customer Focused
              </h3>
              <p className="text-[#3b3b3b]/70">
                Our customers are at the heart of everything we do. We
                continuously improve our products and services based on customer
                feedback and strive to exceed expectations at every turn.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#3b3b3b]/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#3b3b3b]">3</span>
              </div>
              <h3 className="text-xl font-semibold text-[#3b3b3b] mb-3">
                Sustainability
              </h3>
              <p className="text-[#3b3b3b]/70">
                We are committed to reducing our environmental impact. From
                eco-friendly inks to responsible sourcing of materials, we make
                choices that are better for the planet without compromising on
                quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3b3b3b]">Meet Our Team</h2>
            <p className="text-lg text-[#3b3b3b]/70 mt-4 max-w-2xl mx-auto">
              The talented individuals behind CordeStitch
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Nandhu Kasaram",
                role: "Founder & CEO",
                image:
                  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
              },
              {
                name: "yashaswini",
                role: "Head of Design",
                image:
                  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
              },
              {
                name: "jeevan",
                role: "Production Manager",
                image:
                  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
              },
              {
                name: "niveditha putta",
                role: "Customer Success",
                image:
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#3b3b3b]">
                  {member.name}
                </h3>
                <p className="text-[#3b3b3b]/70">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 bg-[#3b3b3b] text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Your Custom Design?</h2>
            <p className="text-gray-300 mb-8">
              Experience the Corde Stitch quality and service difference today. Start designing your perfect t-shirt now!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/customize" className="mt-[10px] text-center">
                Start Designing
              </Link>
              <Link href="/contact" className="btn-secondary text-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section> */}
    </Layout>
  );
};

export default About;
