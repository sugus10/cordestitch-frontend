
"use client"
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { getFaqs } from '@/app/services/data.service';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: FAQ[];
  count: number;
}
const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqData, setFaqData] = useState<FAQ[]>([]); 

  const fetchFaqData = async () => {
    try {
      const response: ApiResponse = await getFaqs(); 
      setFaqData(response.data); // Access the data property
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => {
    fetchFaqData();
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const answerVariants = {
    open: { 
      opacity: 1,
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    },
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto my-12 px-5 py-8 bg-gray-50 rounded-lg font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 
        className="text-center text-2xl md:text-3xl font-bold text-gray-800 py-5 mb-8 relative"
        variants={itemVariants}
      >
        Frequently Asked Questions
      </motion.h2>
      
      <motion.div className="mb-8" variants={containerVariants}>
        {faqData.map((faq, index) => (
          <motion.div 
            key={faq._id} 
            className={`border-b border-gray-300 py-4`}
            variants={itemVariants}
          >
            <motion.div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-sm md:text-base font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                {faq.question}
              </p>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FontAwesomeIcon 
                  icon={activeIndex === index ? faChevronUp : faChevronDown} 
                  className="text-gray-800 w-4 h-4 md:w-5 md:h-5"
                />
              </motion.div>
            </motion.div>
            
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={answerVariants}
                  className="overflow-hidden"
                >
                  <p className="text-gray-600 text-sm md:text-base pt-2">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default FAQs;