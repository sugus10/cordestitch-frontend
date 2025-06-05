"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Star, TrendingUp, Clock, Package, Truck, ArrowRight, Palette, Shirt } from 'lucide-react';
import Layout from '@/components/Layout';
import { getHomePageData } from '@/app/services/data.service';
import { useRouter } from 'next/navigation';
import ChatbotComponent from '@/components/chatbot/middleware/ChatBotComponent';
// import homeImage from '../public/home.png'

export interface Category {
  _id: string;
  categoryName: string;
  categoryDescription?: string;
  coverImage?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
}

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: "/home.png", alt: "Hero Background 1" },
    { id: 2, image: "/slide.png", alt: "Hero Background 2" },
    { id: 3, image: "/slidertwo.png", alt: "Hero Background 3" },
    { id: 4, image: "/sliderthree.png", alt: "Hero Background 4" },
  ];
  useEffect(() => {
    setIsLoaded(true);

    // Auto-scroll carousel every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHomePageData();
        if (response) {


          setCategories(response.data.categories);

          if (typeof window !== 'undefined') {
            sessionStorage.setItem('categoryIds', JSON.stringify(
              response.data.categories.map((cat: any) => cat._id)
            ));
          }

          // Repurpose categories as "products"
          const products = response.data.categories.map((cat: any, index: number) => ({
            id: index + 1,
            name: cat.categoryName,
            image: cat.coverImage,
            category: cat._id,
            price: 0,
            rating: 0,
            reviewCount: 0
          }));

          setFeaturedProducts(products);
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };
  const filteredProducts =
    activeCategory === 'all'
      ? featuredProducts
      : featuredProducts.filter((product) => product.category === activeCategory);
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b3b3b]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Chatbot Component - Adjusted for tablet */}
      <div className="p-2.5 h-15 w-15 flex items-center justify-center fixed right-0 bottom-7 md:bottom-10 z-[9] cursor-pointer">
        <ChatbotComponent userType="customer" />
      </div>
      {/* Hero section with new gradient design */}
      <section className="relative min-h-[32vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Carousel Container */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-[50vh] md:h-full relative">
            {/* Carousel Slides */}
            <div className="relative w-full h-full overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-contain md:object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

  
      </section>



      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#3b3b3b] mb-3">Curated Collections</h2>
            <p className="text-[#636363] max-w-2xl mx-auto">
              Discover handpicked designs that inspire creativity and self-expression
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((categories) => (
                <div
                  key={categories._id}
                  onClick={() => router.push(`/list/${categories._id}`)}
                  className="cursor-pointer group relative"
                >
                  {/* Image Container with Creative Effects */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-[#f5f5f5]">
                    {/* Main Image with Parallax Effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={categories.coverImage}
                        alt={categories.categoryName}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>

                    {/* Dynamic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3b3b3b]/30 via-[#3b3b3b]/0 to-[#3b3b3b]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Floating Elements */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                        <h3 className="font-medium text-[#3b3b3b] truncate">{categories.categoryName}</h3>
                        <div className="flex justify-between items-center mt-2">

                          {/* <div className="flex items-center">
                            {renderStars(product.rating)}
                            <span className="ml-1 text-xs text-[#636363]">({product.reviewCount})</span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle Border Animation */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#3b3b3b]/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#636363]">Our latest creations are coming soon</p>
            </div>
          )}
        </div>
      </section>



      <section className="py-20 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-[#3b3b3b]">#MadeWithCordeStitch</h2>
          <p className="text-[#636363] mt-2">See how our users are styling their custom creations</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
          {['aaa.png', 'bbb.png', 'fff.jpg', 'fgf.jpg'].map((img, i) => (
            <div key={i} className="overflow-hidden rounded-lg shadow hover:scale-105 transition">
              <img src={`/${img}`} alt={`User creation ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 bg-[#eef2f7]">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img src="/sliderthree.png" alt="Smart Fit" className="rounded-lg shadow-lg" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#2a2a2a] mb-4">Experience the Smart Fit</h2>
            <p className="text-[#555] mb-6">
              Our sizing ensures your custom tee fits like it was made just for you. No more guesswork – just perfection.
            </p>
            <ul className="list-disc list-inside text-[#3b3b3b] space-y-2">
              <li>Body-mapping technology</li>
              <li>Dynamic fabric stretch & feedback</li>
              <li>Perfect fit guarantee</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#3b3b3b]">Need Inspiration?</h2>
          <p className="text-[#636363]">Explore trending themes our community loves</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
          {['/disney.png', '/tandj.png', '/squid.png', '/harry.png'].map((title, i) => (
            <div key={i} className="bg-[#f9f9f9] p-4 rounded-xl shadow  text-center hover:shadow-lg transition">
              <img src={title} alt={title} className="w-full object-cover rounded mb-3" />

            </div>
          ))}
        </div>
      </section>


      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3b3b3b] animate-fade-in">Why Choose Corde Stitch?</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto animate-fade-in">
              We combine premium quality materials with state-of-the-art customization technology to deliver the perfect t-shirt for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="mx-auto w-12 h-12 bg-[#3b3b3b] rounded-full flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">100% combed cotton for ultimate comfort and durability</p>
            </div>

            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="mx-auto w-12 h-12 bg-[#3b3b3b] rounded-full flex items-center justify-center mb-4">
                <Package size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Design</h3>
              <p className="text-gray-600">Advanced tools to create your unique design</p>
            </div>

            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="mx-auto w-12 h-12 bg-[#3b3b3b] rounded-full flex items-center justify-center mb-4">
                <Clock size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Turnaround</h3>
              <p className="text-gray-600">Production and shipping within 3-5 business days</p>
            </div>

            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="mx-auto w-12 h-12 bg-[#3b3b3b] rounded-full flex items-center justify-center mb-4">
                <Truck size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pan India Delivery</h3>
              <p className="text-gray-600">Free shipping on orders above ₹999</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3b3b3b]">What Our Customers Say</h2>
            <p className="text-gray-600 mt-2">Don't just take our word for it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-secondary p-6 rounded-lg">
              <div className="flex mb-4">
                {renderStars(5)}
              </div>
              <p className="text-gray-700 mb-4">
                "The t-shirt quality is amazing and the print is vibrant even after multiple washes. I've ordered several times now!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <p className="font-medium text-[#3b3b3b]">Priya Sharma</p>
                  <p className="text-sm text-gray-500">Delhi</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-6 rounded-lg">
              <div className="flex mb-4">
                {renderStars(5)}
              </div>
              <p className="text-gray-700 mb-4">
                "I was skeptical about ordering custom t-shirts online, but CordeStitch exceeded my expectations. The design tool is so easy to use!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <p className="font-medium text-[#3b3b3b]">Rajesh Kumar</p>
                  <p className="text-sm text-gray-500">Mumbai</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-6 rounded-lg">
              <div className="flex mb-4">
                {renderStars(4.5)}
              </div>
              <p className="text-gray-700 mb-4">
                "Ordered custom t-shirts for our company event. The customer service was excellent and delivery was faster than expected."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <p className="font-medium text-[#3b3b3b]">Ananya Patel</p>
                  <p className="text-sm text-gray-500">Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-[#3b3b3b] text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Your Custom Design?</h2>
            <p className="text-gray-300 mb-8">
              Express your unique style with our premium quality t-shirts and custom design tools. 
              Perfect for individuals, teams, or special events.
            </p>
            <Link href="/customize" className="bg-[#3b3b3b]">
              Start Designing Now
            </Link>
          </div>
        </div>
      </section> */}
    </Layout>
  );
};

export default Index;