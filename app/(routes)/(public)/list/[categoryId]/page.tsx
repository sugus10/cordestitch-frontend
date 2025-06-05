"use client";
import { useState, useEffect, useMemo } from 'react';
import { Star, Filter, X, ChevronDown, Loader, ChevronUp, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { getFilterOptionsByCategory, getProductByFilter } from '@/app/services/data.service';

interface Product {
  _id: string;
  categoryId: string;
  subcategoryId: string;
  productName: string;
  productDescription: string;
  basePrice: number;
  coverImage: string;
  colorName: string;
  colorCode: string;
  rating?: number;
  reviewCount?: number;
  sizes?: string[];
}

interface Category {
  _id: string;
  name: string;
}

interface Color {
  colorName: string;
  colorCode: string;
}

interface FilterOptionsResponse {
  status: number;
  data: {
    subcategories: Category[];
    colors: Color[];
    sizes: string[];
    attributes: {
      neck: string[];
      sleev: string[];
    };
  };
}

interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}

const Products = () => {
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    colors: [],
    sizes: [],
    priceRange: [0, 5000],
  });
  
  const [sortBy, setSortBy] = useState('popularity');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse['data'] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIds = sessionStorage.getItem('categoryIds');
        const categoryIds: string[] = storedIds ? JSON.parse(storedIds) : [];

        if (categoryIds.length === 0) {
          setError('No category selected');
          setLoading(false);
          return;
        }

        const id = categoryIds[0];
        setCategoryId(id);

        const [filtersResponse, productsResponse] = await Promise.all([
          getFilterOptionsByCategory(id),
          getProductByFilter({ categoryId: id })
        ]);

        setFilterOptions(filtersResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (!categoryId) return;
      try {
        setLoading(true);
        const response = await getProductByFilter({
          categoryId,
          color: activeFilters.colors,
          size: activeFilters.sizes,
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error filtering products:', error);
        setError('Failed to apply filters');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchFilteredProducts();
    }
  }, [activeFilters, categoryId]);

  const toggleCategoryFilter = (categoryId: string) => {
    setActiveFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const toggleColorFilter = (colorName: string) => {
    setActiveFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter(color => color !== colorName)
        : [...prev.colors, colorName]
    }));
  };

  const toggleSizeFilter = (size: string) => {
    setActiveFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      categories: [],
      colors: [],
      sizes: [],
      priceRange: [0, 5000]
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const sizeMatch = activeFilters.sizes.length === 0 || 
        (product.sizes && product.sizes.some(size => activeFilters.sizes.includes(size)));
      const priceMatch = product.basePrice >= activeFilters.priceRange[0] && 
        product.basePrice <= activeFilters.priceRange[1];
      
      return sizeMatch && priceMatch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.basePrice - b.basePrice;
        case 'price-high':
          return b.basePrice - a.basePrice;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return parseInt(b._id) - parseInt(a._id);
        default:
          return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
    });
  }, [products, activeFilters, sortBy]);

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} 
      />
    ));
  };

  const sortOptions = [
    { id: 'popularity', name: 'Popularity' },
    { id: 'newest', name: 'Newest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Customer Rating' },
  ];

  const toggleFilterSection = (section: string) => {
    setExpandedFilter(expandedFilter === section ? null : section);
  };
const productCount = products?.length ?? 0;
  if (loading && products.length === 0) {
    return (
          <Layout>
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl font-light tracking-tight text-[#161616]">Curated Collection</h1>
              <div className="w-20 h-1 bg-[#161616] mt-3"></div>
  <p className="text-[#3b3b3b] mt-4 text-sm">
  {productCount} {productCount === 1 ? 'exclusive piece' : 'exceptional pieces'} awaiting discovery
</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Mobile Filter Button */}
              <button 
                className="flex items-center justify-center space-x-2 bg-transparent px-4 py-3 rounded-none border-b-2 border-transparent hover:border-[#161616] transition-all duration-300 md:hidden"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={18} className="text-[#161616]" />
                <span className="text-[#161616] uppercase text-xs tracking-wider">Filters</span>
                {(activeFilters.categories.length > 0 || 
                  activeFilters.colors.length > 0 || 
                  activeFilters.sizes.length > 0) && (
                  <span className="ml-1 bg-[#161616] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFilters.categories.length + activeFilters.colors.length + activeFilters.sizes.length}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative border-b-2 border-[#161616]">
                <select 
                  className="appearance-none bg-transparent py-3 pl-2 pr-8 text-[#161616] focus:outline-none text-sm tracking-wide w-full md:w-48"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id} className="bg-white">
                      {option.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#161616]">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(activeFilters.categories.length > 0 || 
            activeFilters.colors.length > 0 || 
            activeFilters.sizes.length > 0) && (
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <span className="text-xs text-[#3b3b3b] tracking-wider">ACTIVE FILTERS:</span>
              {activeFilters.categories.map(categoryId => {
                const category = filterOptions?.subcategories.find(c => c._id === categoryId);
                return category ? (
                  <div key={`filter-${categoryId}`} className="px-3 py-1 flex items-center text-xs border border-[#3b3b3b] tracking-wider">
                    <span className="text-[#161616]">{category.name}</span>
                    <button 
                      onClick={() => toggleCategoryFilter(categoryId)} 
                      className="ml-2 text-[#3b3b3b] hover:text-[#161616]"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : null;
              })}
              {activeFilters.colors.map(colorName => (
                <div key={`filter-${colorName}`} className="px-3 py-1 flex items-center text-xs border border-[#3b3b3b] tracking-wider">
                  <span className="text-[#161616]">{colorName}</span>
                  <button 
                    onClick={() => toggleColorFilter(colorName)} 
                    className="ml-2 text-[#3b3b3b] hover:text-[#161616]"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {activeFilters.sizes.map(size => (
                <div key={`filter-${size}`} className="px-3 py-1 flex items-center text-xs border border-[#3b3b3b] tracking-wider">
                  <span className="text-[#161616]">{size}</span>
                  <button 
                    onClick={() => toggleSizeFilter(size)} 
                    className="ml-2 text-[#3b3b3b] hover:text-[#161616]"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button 
                className="text-[#3b3b3b] hover:text-[#161616] text-xs tracking-wider underline"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Desktop Filters */}
            {filterOptions && (
              <div className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="font-normal text-xl text-[#161616] tracking-wider">FILTERS</h2>
                    {(activeFilters.categories.length > 0 || 
                      activeFilters.colors.length > 0 || 
                      activeFilters.sizes.length > 0) && (
                      <button 
                        className="text-xs text-[#3b3b3b] hover:text-[#161616] tracking-wider underline"
                        onClick={clearFilters}
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Categories Filter */}
                  <div className="mb-8 border-b border-[#eaeaea] pb-6">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-4"
                      onClick={() => toggleFilterSection('categories')}
                    >
                      <h3 className="font-normal text-sm text-[#161616] tracking-wider">CATEGORIES</h3>
                      {expandedFilter === 'categories' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedFilter === 'categories' && (
                      <div className="space-y-3 pl-1">
                        {filterOptions.subcategories.map(category => (
                          <div key={category._id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category._id}`}
                              className="h-4 w-4 rounded-none border-[#3b3b3b] focus:ring-0 checked:bg-[#161616]"
                              checked={activeFilters.categories.includes(category._id)}
                              onChange={() => toggleCategoryFilter(category._id)}
                            />
                            <label 
                              htmlFor={`category-${category._id}`} 
                              className="ml-3 text-sm text-[#3b3b3b] tracking-wider"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Colors Filter */}
                  <div className="mb-8 border-b border-[#eaeaea] pb-6">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-4"
                      onClick={() => toggleFilterSection('colors')}
                    >
                      <h3 className="font-normal text-sm text-[#161616] tracking-wider">COLORS</h3>
                      {expandedFilter === 'colors' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedFilter === 'colors' && (
                      <div className="flex flex-wrap gap-3 pl-1">
                        {filterOptions.colors.map(color => (
                          <button
                            key={color.colorName}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                              ${activeFilters.colors.includes(color.colorName) ? 'ring-1 ring-offset-1 ring-[#161616]' : ''}`}
                            style={{ backgroundColor: color.colorCode }}
                            title={color.colorName}
                            onClick={() => toggleColorFilter(color.colorName)}
                          >
                            {activeFilters.colors.includes(color.colorName) && (
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none">
                                <path 
                                  d="M5 13L9 17L19 7" 
                                  stroke={color.colorCode === '#FFFFFF' ? '#161616' : 'white'} 
                                  strokeWidth="2" 
                                />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sizes Filter */}
                  <div className="mb-8 border-b border-[#eaeaea] pb-6">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-4"
                      onClick={() => toggleFilterSection('sizes')}
                    >
                      <h3 className="font-normal text-sm text-[#161616] tracking-wider">SIZES</h3>
                      {expandedFilter === 'sizes' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedFilter === 'sizes' && (
                      <div className="flex flex-wrap gap-2 pl-1">
                        {filterOptions.sizes.map(size => (
                          <button
                            key={size}
                            className={`w-10 h-10 flex items-center justify-center text-xs border rounded-none transition-colors ${
                              activeFilters.sizes.includes(size)
                                ? 'border-[#161616] bg-[#161616] text-white'
                                : 'border-[#eaeaea] text-[#3b3b3b] hover:border-[#3b3b3b]'
                            }`}
                            onClick={() => toggleSizeFilter(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Range Filter */}
                  <div className="pb-2">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-4"
                      onClick={() => toggleFilterSection('price')}
                    >
                      <h3 className="font-normal text-sm text-[#161616] tracking-wider">PRICE RANGE</h3>
                      {expandedFilter === 'price' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedFilter === 'price' && (
                      <div className="pl-1">
                        <div className="flex items-center justify-between mb-4 text-xs text-[#3b3b3b] tracking-wider">
                          <span>₹{activeFilters.priceRange[0]}</span>
                          <span>₹{activeFilters.priceRange[1]}</span>
                        </div>
                        <div className="px-1 mb-6">
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={activeFilters.priceRange[1]}
                            onChange={(e) => setActiveFilters(prev => ({
                              ...prev,
                              priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                            }))}
                            className="w-full h-px bg-[#eaeaea] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-[#161616]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Filters Overlay */}
            {isFilterOpen && filterOptions && (
              <div className="fixed inset-0 bg-black/70 z-50 lg:hidden flex">
                <div className="bg-white h-full w-4/5 max-w-sm p-6 ml-auto overflow-y-auto animate-slide-in flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="font-normal text-xl text-[#161616] tracking-wider">FILTERS</h2>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="text-[#3b3b3b] hover:text-[#161616]"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {/* Categories - Mobile */}
                    <div className="mb-8 border-b border-[#eaeaea] pb-6">
                      <button 
                        className="flex justify-between items-center w-full text-left mb-4"
                        onClick={() => toggleFilterSection('mobile-categories')}
                      >
                        <h3 className="font-normal text-sm text-[#161616] tracking-wider">CATEGORIES</h3>
                        {expandedFilter === 'mobile-categories' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedFilter === 'mobile-categories' && (
                        <div className="space-y-3 pl-1">
                          {filterOptions.subcategories.map(category => (
                            <div key={category._id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`mobile-category-${category._id}`}
                                className="h-4 w-4 rounded-none border-[#3b3b3b] focus:ring-0 checked:bg-[#161616]"
                                checked={activeFilters.categories.includes(category._id)}
                                onChange={() => toggleCategoryFilter(category._id)}
                              />
                              <label 
                                htmlFor={`mobile-category-${category._id}`} 
                                className="ml-3 text-sm text-[#3b3b3b] tracking-wider"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Colors - Mobile */}
                    <div className="mb-8 border-b border-[#eaeaea] pb-6">
                      <button 
                        className="flex justify-between items-center w-full text-left mb-4"
                        onClick={() => toggleFilterSection('mobile-colors')}
                      >
                        <h3 className="font-normal text-sm text-[#161616] tracking-wider">COLORS</h3>
                        {expandedFilter === 'mobile-colors' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedFilter === 'mobile-colors' && (
                        <div className="flex flex-wrap gap-3 pl-1">
                          {filterOptions.colors.map(color => (
                            <button
                              key={color.colorName}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                                ${activeFilters.colors.includes(color.colorName) ? 'ring-1 ring-offset-1 ring-[#161616]' : ''}`}
                              style={{ backgroundColor: color.colorCode }}
                              title={color.colorName}
                              onClick={() => toggleColorFilter(color.colorName)}
                            >
                              {activeFilters.colors.includes(color.colorName) && (
                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none">
                                  <path 
                                    d="M5 13L9 17L19 7" 
                                    stroke={color.colorCode === '#FFFFFF' ? '#161616' : 'white'} 
                                    strokeWidth="2" 
                                  />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sizes - Mobile */}
                    <div className="mb-8 border-b border-[#eaeaea] pb-6">
                      <button 
                        className="flex justify-between items-center w-full text-left mb-4"
                        onClick={() => toggleFilterSection('mobile-sizes')}
                      >
                        <h3 className="font-normal text-sm text-[#161616] tracking-wider">SIZES</h3>
                        {expandedFilter === 'mobile-sizes' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedFilter === 'mobile-sizes' && (
                        <div className="flex flex-wrap gap-2 pl-1">
                          {filterOptions.sizes.map(size => (
                            <button
                              key={size}
                              className={`w-10 h-10 flex items-center justify-center text-xs border rounded-none transition-colors ${
                                activeFilters.sizes.includes(size)
                                  ? 'border-[#161616] bg-[#161616] text-white'
                                  : 'border-[#eaeaea] text-[#3b3b3b] hover:border-[#3b3b3b]'
                              }`}
                              onClick={() => toggleSizeFilter(size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price Range - Mobile */}
                    <div className="mb-8">
                      <button 
                        className="flex justify-between items-center w-full text-left mb-4"
                        onClick={() => toggleFilterSection('mobile-price')}
                      >
                        <h3 className="font-normal text-sm text-[#161616] tracking-wider">PRICE RANGE</h3>
                        {expandedFilter === 'mobile-price' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedFilter === 'mobile-price' && (
                        <div className="pl-1">
                          <div className="flex items-center justify-between mb-4 text-xs text-[#3b3b3b] tracking-wider">
                            <span>₹{activeFilters.priceRange[0]}</span>
                            <span>₹{activeFilters.priceRange[1]}</span>
                          </div>
                          <div className="px-1 mb-6">
                            <input
                              type="range"
                              min="0"
                              max="5000"
                              step="100"
                              value={activeFilters.priceRange[1]}
                              onChange={(e) => setActiveFilters(prev => ({
                                ...prev,
                                priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                              }))}
                              className="w-full h-px bg-[#eaeaea] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-[#161616]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4 sticky bottom-0 bg-white pt-4 pb-2 border-t border-[#eaeaea]">
                    <button 
                      className="flex-1 py-4 bg-[#161616] text-white rounded-none hover:bg-[#3b3b3b] transition-colors flex items-center justify-center tracking-wider text-sm"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      VIEW {filteredAndSortedProducts.length} ITEMS
                    </button>
                    <button 
                      className="flex-1 py-4 border border-[#eaeaea] text-[#3b3b3b] rounded-none hover:border-[#161616] transition-colors flex items-center justify-center tracking-wider text-sm"
                      onClick={() => {
                        clearFilters();
                        setIsFilterOpen(false);
                      }}
                    >
                      CLEAR ALL
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {filterLoading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                  <Loader size={24} className="animate-spin text-[#161616] mr-3" />
                  <p className="text-[#3b3b3b] tracking-wider">Applying filters...</p>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedProducts.map((product) => (
                      <Link 
                        href={`/customize/${product._id}`} 
                        key={product._id} 
                        className="group"
                      >
                        <div className="relative overflow-hidden bg-white">
                          {/* Product Image */}
                          <div className="aspect-[3/4] relative overflow-hidden">
                            <img 
                              src={product.coverImage} 
                              alt={product.productName} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="mt-4">
                            <h3 className="text-[#161616] font-light tracking-wide text-lg">{product.productName}</h3>
                            <p className="text-[#3b3b3b] text-sm mt-1">{product.productDescription}</p>
                            <div className="flex justify-between items-center mt-3">
                              <p className="text-[#161616] font-medium">₹{product.basePrice.toLocaleString()}</p>
                              <div className="flex items-center">
                                <div className="flex">
                                  {renderStars(product.rating)}
                                </div>
                                {product.reviewCount && (
                                  <span className="ml-1 text-xs text-[#3b3b3b]">({product.reviewCount})</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Color Indicator */}
                          {product.colorName && (
                            <div 
                              className="absolute top-4 right-4 w-5 h-5 rounded-full border border-white/50"
                              style={{ backgroundColor: product.colorCode }}
                              title={product.colorName}
                            />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {products.length > 0 && (
                    <div className="mt-16 flex justify-center">
                      <button className="px-8 py-3 border border-[#eaeaea] text-[#3b3b3b] hover:border-[#161616] hover:text-[#161616] transition-colors flex items-center tracking-wider text-sm">
                        LOAD MORE
                        <ChevronDown size={16} className="ml-2" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <svg className="mx-auto h-12 w-12 text-[#3b3b3b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-light text-[#161616] tracking-wider">NO PRODUCTS FOUND</h3>
                    <p className="mt-2 text-[#3b3b3b] text-sm tracking-wide">
                      Adjust your filters to discover our collection
                    </p>
                    <button 
                      className="mt-6 px-6 py-2 bg-[#161616] text-white hover:bg-[#3b3b3b] transition-colors tracking-wider text-sm"
                      onClick={clearFilters}
                    >
                      RESET FILTERS
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[50vh] text-center p-6">
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <Link 
            href="/" 
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Our Collection</h1>
              <p className="text-gray-500 mt-1">
                {products.length} {products.length === 1 ? 'item' : 'items'} available
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Mobile Filter Button */}
              <button 
                className="flex items-center justify-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors md:hidden"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={18} className="text-gray-700" />
                <span className="text-gray-700">Filters</span>
                {(activeFilters.categories.length > 0 || 
                  activeFilters.colors.length > 0 || 
                  activeFilters.sizes.length > 0) && (
                  <span className="ml-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFilters.categories.length + activeFilters.colors.length + activeFilters.sizes.length}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-48 shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(activeFilters.categories.length > 0 || 
            activeFilters.colors.length > 0 || 
            activeFilters.sizes.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-gray-500">Filters:</span>
              {activeFilters.categories.map(categoryId => {
                const category = filterOptions?.subcategories.find(c => c._id === categoryId);
                return category ? (
                  <div key={`filter-${categoryId}`} className="bg-white px-3 py-1 rounded-full flex items-center text-sm border border-gray-200 shadow-xs">
                    <span className="text-gray-700">{category.name}</span>
                    <button 
                      onClick={() => toggleCategoryFilter(categoryId)} 
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : null;
              })}
              {activeFilters.colors.map(colorName => (
                <div key={`filter-${colorName}`} className="bg-white px-3 py-1 rounded-full flex items-center text-sm border border-gray-200 shadow-xs">
                  <span className="text-gray-700">{colorName}</span>
                  <button 
                    onClick={() => toggleColorFilter(colorName)} 
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {activeFilters.sizes.map(size => (
                <div key={`filter-${size}`} className="bg-white px-3 py-1 rounded-full flex items-center text-sm border border-gray-200 shadow-xs">
                  <span className="text-gray-700">Size: {size}</span>
                  <button 
                    onClick={() => toggleSizeFilter(size)} 
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {(activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 5000) && (
                <div className="bg-white px-3 py-1 rounded-full flex items-center text-sm border border-gray-200 shadow-xs">
                  <span className="text-gray-700">₹{activeFilters.priceRange[0]} - ₹{activeFilters.priceRange[1]}</span>
                </div>
              )}
              <button 
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center hover:underline transition-colors"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            {filterOptions && (
              <div className="hidden lg:block w-72 shrink-0">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-xl text-gray-900">Filters</h2>
                    {(activeFilters.categories.length > 0 || 
                      activeFilters.colors.length > 0 || 
                      activeFilters.sizes.length > 0) && (
                      <button 
                        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                        onClick={clearFilters}
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Categories Filter */}
                  <div className="mb-6">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-2"
                      onClick={() => toggleFilterSection('categories')}
                    >
                      <h3 className="font-medium text-gray-900">Categories</h3>
                      {expandedFilter === 'categories' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedFilter === 'categories' && (
                      <div className="space-y-3 pl-1">
                        {filterOptions.subcategories.map(category => (
                          <div key={category._id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category._id}`}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                              checked={activeFilters.categories.includes(category._id)}
                              onChange={() => toggleCategoryFilter(category._id)}
                            />
                            <label 
                              htmlFor={`category-${category._id}`} 
                              className="ml-3 text-sm text-gray-700"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Colors Filter */}
                  <div className="mb-6">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-2"
                      onClick={() => toggleFilterSection('colors')}
                    >
                      <h3 className="font-medium text-gray-900">Colors</h3>
                      {expandedFilter === 'colors' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedFilter === 'colors' && (
                      <div className="flex flex-wrap gap-3 pl-1">
                        {filterOptions.colors.map(color => (
                          <button
                            key={color.colorName}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                              ${activeFilters.colors.includes(color.colorName) ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110' : 'hover:scale-105'}`}
                            style={{ backgroundColor: color.colorCode }}
                            title={color.colorName}
                            onClick={() => toggleColorFilter(color.colorName)}
                            aria-label={`Filter by ${color.colorName}`}
                          >
                            {activeFilters.colors.includes(color.colorName) && (
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <path 
                                  d="M5 13L9 17L19 7" 
                                  stroke={color.colorCode === '#FFFFFF' ? 'black' : 'white'} 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sizes Filter */}
                  <div className="mb-6">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-2"
                      onClick={() => toggleFilterSection('sizes')}
                    >
                      <h3 className="font-medium text-gray-900">Sizes</h3>
                      {expandedFilter === 'sizes' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedFilter === 'sizes' && (
                      <div className="flex flex-wrap gap-2 pl-1">
                        {filterOptions.sizes.map(size => (
                          <button
                            key={size}
                            className={`w-12 h-10 flex items-center justify-center text-sm border rounded-md transition-colors ${
                              activeFilters.sizes.includes(size)
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                            onClick={() => toggleSizeFilter(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <button 
                      className="flex justify-between items-center w-full text-left mb-2"
                      onClick={() => toggleFilterSection('price')}
                    >
                      <h3 className="font-medium text-gray-900">Price Range</h3>
                      {expandedFilter === 'price' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedFilter === 'price' && (
                      <div className="pl-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">₹{activeFilters.priceRange[0]}</span>
                          <span className="text-sm text-gray-700">₹{activeFilters.priceRange[1]}</span>
                        </div>
                        <div className="px-2">
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={activeFilters.priceRange[1]}
                            onChange={(e) => setActiveFilters(prev => ({
                              ...prev,
                              priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                            }))}
                            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
                          />
                        </div>
                        <div className="flex justify-between mt-4">
                          <button 
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                            onClick={() => setActiveFilters(prev => ({
                              ...prev,
                              priceRange: [0, 1000]
                            }))}
                          >
                            Under ₹1000
                          </button>
                          <button 
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                            onClick={() => setActiveFilters(prev => ({
                              ...prev,
                              priceRange: [1000, 2000]
                            }))}
                          >
                            ₹1000-2000
                          </button>
                          <button 
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                            onClick={() => setActiveFilters(prev => ({
                              ...prev,
                              priceRange: [2000, 5000]
                            }))}
                          >
                            Over ₹2000
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Filters Overlay */}
            {isFilterOpen && filterOptions && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden flex">
                <div className="bg-white h-full w-4/5 max-w-sm p-6 ml-auto overflow-y-auto animate-slide-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-xl text-gray-900">Filters</h2>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Categories - Mobile */}
                  <div className="mb-6">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-3"
                      onClick={() => toggleFilterSection('mobile-categories')}
                    >
                      <h3 className="font-medium text-gray-900">Categories</h3>
                      {expandedFilter === 'mobile-categories' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedFilter === 'mobile-categories' && (
                      <div className="space-y-3 pl-2">
                        {filterOptions.subcategories.map(category => (
                          <div key={category._id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`mobile-category-${category._id}`}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                              checked={activeFilters.categories.includes(category._id)}
                              onChange={() => toggleCategoryFilter(category._id)}
                            />
                            <label 
                              htmlFor={`mobile-category-${category._id}`} 
                              className="ml-3 text-sm text-gray-700"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Colors - Mobile */}
                  <div className="mb-6">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-3"
                      onClick={() => toggleFilterSection('mobile-colors')}
                    >
                      <h3 className="font-medium text-gray-900">Colors</h3>
                      {expandedFilter === 'mobile-colors' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedFilter === 'mobile-colors' && (
                      <div className="flex flex-wrap gap-3 pl-2">
                        {filterOptions.colors.map(color => (
                          <button
                            key={color.colorName}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                              ${activeFilters.colors.includes(color.colorName) ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110' : 'hover:scale-105'}`}
                            style={{ backgroundColor: color.colorCode }}
                            title={color.colorName}
                            onClick={() => toggleColorFilter(color.colorName)}
                            aria-label={`Filter by ${color.colorName}`}
                          >
                            {activeFilters.colors.includes(color.colorName) && (
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <path 
                                  d="M5 13L9 17L19 7" 
                                  stroke={color.colorCode === '#FFFFFF' ? 'black' : 'white'} 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sizes - Mobile */}
                  <div className="mb-6">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-3"
                      onClick={() => toggleFilterSection('mobile-sizes')}
                    >
                      <h3 className="font-medium text-gray-900">Sizes</h3>
                      {expandedFilter === 'mobile-sizes' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedFilter === 'mobile-sizes' && (
                      <div className="flex flex-wrap gap-2 pl-2">
                        {filterOptions.sizes.map(size => (
                          <button
                            key={size}
                            className={`w-12 h-10 flex items-center justify-center text-sm border rounded-md transition-colors ${
                              activeFilters.sizes.includes(size)
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                            onClick={() => toggleSizeFilter(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Range - Mobile */}
                  <div className="mb-8">
                    <button 
                      className="flex justify-between items-center w-full text-left mb-3"
                      onClick={() => toggleFilterSection('mobile-price')}
                    >
                      <h3 className="font-medium text-gray-900">Price Range</h3>
                      {expandedFilter === 'mobile-price' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedFilter === 'mobile-price' && (
                      <div className="pl-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">₹{activeFilters.priceRange[0]}</span>
                          <span className="text-sm text-gray-700">₹{activeFilters.priceRange[1]}</span>
                        </div>
                        <div className="px-2">
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={activeFilters.priceRange[1]}
                            onChange={(e) => setActiveFilters(prev => ({
                              ...prev,
                              priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                            }))}
                            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
                          />
                        </div>
                        <div className="flex justify-between mt-4">
                          <button 
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                            onClick={() => setActiveFilters(prev => ({
                              ...prev,
                              priceRange: [0, 1000]
                            }))}
                          >
                            Under ₹1000
                          </button>
                          <button 
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                            onClick={() => setActiveFilters(prev => ({
                              ...prev,
                              priceRange: [1000, 2000]
                            }))}
                          >
                            ₹1000-2000
                          </button>
                          <button 
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                            onClick={() => setActiveFilters(prev => ({
                              ...prev,
                              priceRange: [2000, 5000]
                            }))}
                          >
                            Over ₹2000
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4 sticky bottom-0 bg-white pt-4 pb-2">
                    <button 
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Show {filteredAndSortedProducts.length} Items
                    </button>
                    <button 
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                      onClick={() => {
                        clearFilters();
                        setIsFilterOpen(false);
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {filterLoading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                  <Loader size={24} className="animate-spin text-indigo-600 mr-3" />
                  <p className="text-gray-600">Applying filters...</p>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedProducts.map((product) => (
                      <Link 
                        href={`/customize/${product._id}`} 
                        key={product._id} 
                        className="group"
                      >
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                          <div className="relative overflow-hidden aspect-[3/4]">
                            <img 
                              src={product.coverImage} 
                              alt={product.productName} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            {product.colorName && (
                              <div 
                                className="absolute bottom-3 left-3 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: product.colorCode }}
                                title={product.colorName}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-medium text-gray-900 line-clamp-1">{product.productName}</h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.productDescription}</p>
                            <div className="mt-3 flex justify-between items-center">
                              <p className="font-semibold text-gray-900">₹{product.basePrice.toLocaleString()}</p>
                              <div className="flex items-center">
                                <div className="flex">
                                  {renderStars(product.rating)}
                                </div>
                                {product.reviewCount && (
                                  <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
                                )}
                              </div>
                            </div>
                            {product.sizes && product.sizes.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex flex-wrap gap-1">
                                  {product.sizes.slice(0, 4).map(size => (
                                    <span 
                                      key={`${product._id}-${size}`} 
                                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                                    >
                                      {size}
                                    </span>
                                  ))}
                                  {product.sizes.length > 4 && (
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      +{product.sizes.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {products.length > 0 && (
                    <div className="mt-10 flex justify-center">
                      <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        Load More
                        <ChevronDown size={18} className="ml-2" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <div className="max-w-md mx-auto">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-3 text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-2 text-gray-500">
                      Try adjusting your filters or search to find what you're looking for.
                    </p>
                    <button 
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;