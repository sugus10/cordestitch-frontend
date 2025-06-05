"use client"
import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import Layout from '@/components/Layout';
import { getFaqs } from '@/app/services/data.service';
import { ApiResponsess, FAQ } from '@/lib/type';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response: ApiResponsess = await getFaqs(); 
        setFaqs(response.data); // Access the data property
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoadingFaqs(false);
      }
    };
  
    fetchFaqs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-[#3b3b3b] text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-300">
              Have questions or need assistance? We're here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info and Form */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-brand-dark mb-6">Get In Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Phone size={20} className="text-brand-accent" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-brand-dark">Phone</h3>
                      <p className="text-gray-700">+91 7349368311</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Mail size={20} className="text-brand-accent" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-brand-dark">Email</h3>
                      <p className="text-gray-700">info@cordestitch.com</p>
                      <p className="text-gray-700">support@cordestitch.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <MapPin size={20} className="text-brand-accent" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-brand-dark">Address</h3>
                      <p className="text-gray-700">
                      584, 1st floor, RD Rajanna Complex,<br />
                      Rajanukunte, Yelahanka Taluk,<br />
                      Bengaluru North 560064.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Clock size={20} className="text-brand-accent" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-brand-dark">Business Hours</h3>
                      <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-700">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium text-brand-dark mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Facebook">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#1da1f2] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Twitter">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#e1306c] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Instagram">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#0077b5] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="LinkedIn">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-brand-dark mb-6">Send Us a Message</h2>
                
                {formSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
                    <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
                    <button 
                      className="mt-4 text-brand-accent hover:underline"
                      onClick={() => setFormSubmitted(false)}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name*
                        </label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-dark focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address*
                        </label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-dark focus:outline-none"
                          
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-dark focus:outline-none"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject*
                        </label>
                        <select 
                          id="subject" 
                          name="subject" 
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-dark focus:outline-none"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Product Question">Product Question</option>
                          <option value="Bulk Order">Bulk Order</option>
                          <option value="Design Help">Design Help</option>
                          <option value="Shipping & Delivery">Shipping & Delivery</option>
                          <option value="Returns & Refunds">Returns & Refunds</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message*
                      </label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-dark focus:outline-none"
                        placeholder="Please enter your message here..."
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="privacy"
                        required
                        className="h-4 w-4 text-brand-accent border-gray-300 rounded focus:ring-brand-accent"
                      />
                      <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
                        I agree to the <a href="#" className="text-brand-accent hover:underline">Privacy Policy</a> and consent to having my data processed.
                      </label>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn-accent inline-flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-[16/9] w-full">
              {/* Embed Google Maps iframe */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248706.23293304237!2d77.4354634775776!3d13.096975400000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae19d7fe915333%3A0xcdb2c8559a5ac17!2sSeabed2Crest%20Technologies%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1693902576904!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Corde Stitch Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

     {/* FAQ Section */}
     <section className="py-16 bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-dark">Frequently Asked Questions</h2>
            <p className="text-gray-700 mt-2">
              Find answers to the most common questions about our products and services.
            </p>
          </div>
          
          {loadingFaqs ? (
            <div className="max-w-3xl mx-auto text-center py-12">
              <div className="animate-pulse flex flex-col space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {faqs.map((faq) => (
                <div key={faq._id} className="py-6">
                  <h3 className="text-lg font-medium text-brand-dark">{faq.question}</h3>
                  <p className="mt-2 text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <p className="text-gray-700">
              Don't see your question here? <a href="#" className="text-brand-accent hover:underline">Check our support center</a> or contact us directly.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
