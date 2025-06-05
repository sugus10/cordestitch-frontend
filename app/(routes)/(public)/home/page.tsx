"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Star, TrendingUp, Clock, Package, Truck, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { getHomePageData } from '@/app/services/data.service';
import { useRouter } from 'next/navigation';
import home from '@/public/home.png'

interface Category {
  id: string;
  name: string;
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
  const router=useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHomePageData();
        if (response) {
          // Format categories
          const apiCategories = response.data.categories.map((cat: any) => ({
            id: cat._id,
            name: cat.categoryName,
            coverImage: cat.coverImage
          }));
  
          const allCategories = [{ id: 'all', name: 'All', coverImage: '' }, ...apiCategories];
          setCategories(allCategories);
  
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
      {/* Hero section with new gradient design */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#3b3b3b]"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2127&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-x-0 bottom-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-white">
            <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="container-custom relative z-10 pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 max-w-lg">
              <span className={`inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Premium Quality T-Shirts
              </span>
              <h1 
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                Design Your <span className="">Perfect</span> T-Shirt
              </h1>
              <p 
                className={`text-lg md:text-xl text-gray-100 transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                Create custom designs with our easy-to-use t-shirt customizer. Add your text, logos, or images for a truly unique style.
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <Link href="/customize" 
                  className="relative group bg-white/10 hover:bg-white/20  text-white py-3 px-8 rounded-md font-medium transition-all duration-300 hover:shadow-xl overflow-hidden"
                >
                  <span className="relative z-10">Start Designing</span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </Link>
                <Link href="/products" 
                  className="bg-white/10 hover:bg-white/20 text-white py-3 px-8 rounded-md font-medium backdrop-blur-sm transition-all duration-300 hover:shadow-lg text-center flex items-center justify-center"
                >
                  Shop Collection <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
            <div className={`relative transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2127&auto=format&fit=crop"
                  alt="Custom T-Shirt" 
                  className="w-full h-[450px] object-cover rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-10 right-20 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            </div>
          </div>
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

      <section className="py-16 bg-secondary">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-[#3b3b3b] mb-6">Featured Products</h2>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push('/products')}
                className="cursor-pointer group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-[#3b3b3b] truncate">{product.name}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
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