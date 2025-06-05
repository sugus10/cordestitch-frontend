    "use client";
    import { useState, useEffect, useCallback } from 'react';
    import { Star, Filter, X, ChevronDown } from 'lucide-react';
    import Layout from '@/components/Layout';
    import Link from 'next/link';
    import { applyFilter, getAllPants, getFilterPant } from '@/app/services/data.service';
import { useRouter } from 'next/navigation';

    interface FilterOption {
    title: string;
    key: string;
    options?: string[];
    colorOptions?: Array<{
        colorCode: string;
        colorName: string;
    }>;
    }

    interface ProductWithVariants {
        productId: string;
        productName: string;
        productOfferPercentage: number;
        productSubCategory: string;
        productMaterialType: string;
        productStretchType: string;
        productReviewResponse: {
          reviewAverage: number;
          totalNumberOfReviews: number;
        };
        variants: Array<{
          productPrice: number;
          color: string;
          colorCode: string;
          size: number;
          imageUrl: string;
        }>;
      }
    interface Product {
    productId: string;
    productName: string;
    productPrice: number;
    productOfferPercentage: number;
    productSubCategory: string;
    productMaterialType: string;
    productStretchType: string;
    color: string;
    colorCode: string;
    size: number;
    imageUrl: string;
    productReviewResponse: {
        reviewAverage: number;
        totalNumberOfReviews: number;
    };
    }

    interface CategoryResponse {
    categoryId: string;
    categoryName: string;
    subCategoryResponses: Array<{
        subCategoryId: string;
        subCategoryName: string;
        productDataResponses: Array<{
        productId: string;
        productName: string;
        productOfferPercentage: number;
        productMaterialType: string;
        productStretchType: string;
        stockQuantityResponseList: Array<{
            size: number;
            productPrice: number;
            colorQuantityResponses: Array<{
            color: string;
            colorCode: string;
            imageUrls: Record<string, number>;
            }>;
        }>;
        productReviewResponse: {
            reviewAverage: number;
            totalNumberOfReviews: number;
        };
        }>;
    }>;
    }

    const Pants = () => {
    const [activeFilters, setActiveFilters] = useState({
        productSubCategory: [] as string[],
        productMaterialType: [] as string[],
        productStretchType: [] as string[],
        color: [] as string[],
        size: [] as string[],
        priceRange: [0, 5000] as [number, number],
    });
    
    const [sortBy, setSortBy] = useState('popularity');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router=useRouter();

    useEffect(() => {
        const fetchData = async () => {
        try {
            setIsLoading(true);
            const [filters, pantsData] = await Promise.all([
            getFilterPant(),
            getAllPants()
            ]);
            
            // Type assertion for filters
            setFilterOptions(filters as FilterOption[]);
            
            // Type assertion for pantsData
            const data = pantsData as { categoryResponses: CategoryResponse[] };
            
            // Transform the pants data into a more manageable format
            const transformedProducts = data.categoryResponses
            .flatMap((category: CategoryResponse) => 
                category.subCategoryResponses.flatMap((subCategory) => 
                subCategory.productDataResponses.flatMap((product) => 
                    product.stockQuantityResponseList.flatMap((stock) => 
                    stock.colorQuantityResponses.map((color) => ({
                        productId: product.productId,
                        productName: product.productName,
                        productPrice: stock.productPrice,
                        productOfferPercentage: product.productOfferPercentage,
                        productSubCategory: subCategory.subCategoryName,
                        productMaterialType: product.productMaterialType,
                        productStretchType: product.productStretchType,
                        color: color.color,
                        colorCode: color.colorCode,
                        size: stock.size,
                        imageUrl: Object.keys(color.imageUrls)[0], // Get the first image
                        productReviewResponse: product.productReviewResponse
                    }))
                    )
                )
                )
            );
            
            setProducts(transformedProducts);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchData();
    }, []);

    // Toggle filter
    const toggleFilter = (filterKey: keyof typeof activeFilters, value: string) => {
        setActiveFilters(prev => {
        const currentFilters = prev[filterKey] as string[];
        if (currentFilters.includes(value)) {
            return {
            ...prev,
            [filterKey]: currentFilters.filter(item => item !== value)
            };
        } else {
            return {
            ...prev,
            [filterKey]: [...currentFilters, value]
            };
        }
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setActiveFilters({
        productSubCategory: [],
        productMaterialType: [],
        productStretchType: [],
        color: [],
        size: [],
        priceRange: [0, 5000],
        });
    };


    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const filters = await getFilterPant();
            setFilterOptions(filters as FilterOption[]);
            
            // Load initial products
            const initialProducts = await getAllPants();
            const transformed = transformProducts(initialProducts);
            setProducts(transformed);
            setFilteredProducts(transformed);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchInitialData();
    }, []);

    // Function to transform API response to Product[]
    const transformProducts = (data: any): Product[] => {
        return data.categoryResponses
        .flatMap((category: CategoryResponse) => 
            category.subCategoryResponses.flatMap((subCategory) => 
            subCategory.productDataResponses.flatMap((product) => 
                product.stockQuantityResponseList.flatMap((stock) => 
                stock.colorQuantityResponses.map((color) => ({
                    productId: product.productId,
                    productName: product.productName,
                    productPrice: stock.productPrice,
                    productOfferPercentage: product.productOfferPercentage,
                    productSubCategory: subCategory.subCategoryName,
                    productMaterialType: product.productMaterialType,
                    productStretchType: product.productStretchType,
                    color: color.color,
                    colorCode: color.colorCode,
                    size: stock.size,
                    imageUrl: Object.keys(color.imageUrls)[0],
                    productReviewResponse: product.productReviewResponse
                }))
                )
            )
            )
        );
    };

    // Function to handle filter application
    const handleApplyFilters = useCallback(async () => {
        try {
            setIsLoading(true);
    
            const filterData = {
                productSubCategory: activeFilters.productSubCategory.length > 0 
                    ? activeFilters.productSubCategory 
                    : undefined,
                productMaterialType: activeFilters.productMaterialType.length > 0 
                    ? activeFilters.productMaterialType 
                    : undefined,
                productStretchType: activeFilters.productStretchType.length > 0 
                    ? activeFilters.productStretchType 
                    : undefined,
                size: activeFilters.size.length > 0 
                    ? activeFilters.size.map(s => parseInt(s)) 
                    : undefined,
                colorCode: activeFilters.color.length > 0 
                    ? filterOptions
                        .find(f => f.key === 'color')?.colorOptions
                        ?.filter(c => activeFilters.color.includes(c.colorName))
                        ?.map(c => c.colorCode)
                    : undefined
            };
    
            const cleanFilterData = Object.fromEntries(
                Object.entries(filterData).filter(([_, v]) => v !== undefined)
            );
    
            const filteredResponse = await applyFilter(cleanFilterData);
            const transformed = transformProducts(filteredResponse);
            setFilteredProducts(transformed);
            setIsFilterOpen(false);
        } catch (error) {
            console.error("Error applying filters:", error);
        } finally {
            setIsLoading(false);
        }
    }, [activeFilters, filterOptions]);



    // Update your useEffect to apply filters when activeFilters change
    useEffect(() => {
        const timer = setTimeout(() => {
          handleApplyFilters();
        }, 300); // Debounce to avoid too many API calls
      
        return () => clearTimeout(timer);
      }, [activeFilters, handleApplyFilters]);

    // Sort products (now using filteredProducts instead of products)
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
        case 'price-low':
            return a.productPrice - b.productPrice;
        case 'price-high':
            return b.productPrice - a.productPrice;
        case 'rating':
            return b.productReviewResponse.reviewAverage - a.productReviewResponse.reviewAverage;
        case 'newest':
            return b.productId.localeCompare(a.productId);
        default: // popularity
            return b.productReviewResponse.totalNumberOfReviews - a.productReviewResponse.totalNumberOfReviews;
        }
    });


    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
        <Star 
            key={index} 
            size={16} 
            className={index < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
        />
        ));
    };

    if (isLoading) {
        return (
        <Layout>
            <div className="bg-secondary py-8">
            <div className="container-custom">
                <div className="flex justify-center items-center h-64">
                <p>Loading...</p>
                </div>
            </div>
            </div>
        </Layout>
        );
    }

    return (
        <Layout>
        <div className="bg-secondary py-8">
            <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-brand-dark">Pant Collection</h1>
                
                {/* Mobile Filter Button */}
                <button 
                className="md:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded border border-gray-200"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                <Filter size={18} />
                <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="hidden md:block relative">
                <select 
                    className="bg-white border border-gray-200 rounded py-2 pl-4 pr-10 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="popularity">Popularity</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                </select>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Filters - Desktop */}
                <div className="hidden md:block w-full md:w-64 lg:w-72 shrink-0">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg text-brand-dark">Filters</h2>
                    {(activeFilters.productSubCategory.length > 0 || 
                        activeFilters.productMaterialType.length > 0 || 
                        activeFilters.productStretchType.length > 0 ||
                        activeFilters.color.length > 0 ||
                        activeFilters.size.length > 0) && (
                        <button 
                        className="text-sm text-brand-accent hover:underline"
                        onClick={clearFilters}
                        >
                        Clear All
                        </button>
                    )}
                    </div>

                    {/* Render filter options */}
                    {filterOptions.map(filter => (
                    <div key={filter.key} className="mb-6">
                        <h3 className="font-medium text-brand-dark mb-2">{filter.title}</h3>
                        
                        {filter.key === 'color' && filter.colorOptions ? (
                        <div className="flex flex-wrap gap-2">
                            {filter.colorOptions.map(color => (
                            <button
                                key={color.colorName}
                                className={`w-8 h-8 rounded-full flex items-center justify-center 
                                ${activeFilters.color.includes(color.colorName) ? 
                                    'ring-2 ring-offset-2 ring-brand-accent' : ''}`}
                                style={{ backgroundColor: color.colorCode }}
                                title={color.colorName}
                                onClick={() => toggleFilter('color', color.colorName)}
                                aria-label={`Filter by ${color.colorName}`}
                            >
                                {activeFilters.color.includes(color.colorName) && (
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13L9 17L19 7" stroke={color.colorCode === '#FFFFFF' ? 'black' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                )}
                            </button>
                            ))}
                        </div>
                        ) : (
                        <div className="space-y-2">
                            {filter.options?.map(option => (
                            <div key={option} className="flex items-center">
                                <input
                                type="checkbox"
                                id={`${filter.key}-${option}`}
                                className="h-4 w-4 text-brand-accent rounded border-gray-300 focus:ring-brand-accent"
                                checked={(activeFilters[filter.key as keyof typeof activeFilters] as string[]).includes(option)}
                                onChange={() => toggleFilter(filter.key as keyof typeof activeFilters, option)}
                                />
                                <label htmlFor={`${filter.key}-${option}`} className="ml-2 text-sm text-gray-700">
                                {option}
                                </label>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    ))}

                    {/* Price Range */}
                    <div>
                    <h3 className="font-medium text-brand-dark mb-2">Price Range</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">₹{activeFilters.priceRange[0]}</span>
                        <span className="text-sm text-gray-700">₹{activeFilters.priceRange[1]}</span>
                    </div>
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                    />
                    </div>
                </div>
                </div>

                {/* Mobile Filters */}
                {isFilterOpen && (
                <div className="fixed inset-0 bg-[#3b3b3b] bg-opacity-50 z-50 md:hidden flex">
                    <div className="bg-white h-full w-4/5 max-w-sm p-6 ml-auto overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-lg text-brand-dark">Filters</h2>
                        <button onClick={() => setIsFilterOpen(false)}>
                        <X size={24} />
                        </button>
                    </div>

                    {/* Sort - Mobile */}
                    <div className="mb-6">
                        <h3 className="font-medium text-brand-dark mb-2">Sort By</h3>
                        <select 
                        className="w-full bg-white border border-gray-200 rounded py-2 px-3 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        >
                        <option value="popularity">Popularity</option>
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Customer Rating</option>
                        </select>
                    </div>

                    {/* Render filter options - Mobile */}
                    {filterOptions.map(filter => (
                        <div key={`mobile-${filter.key}`} className="mb-6">
                        <h3 className="font-medium text-brand-dark mb-2">{filter.title}</h3>
                        
                        {filter.key === 'color' && filter.colorOptions ? (
                            <div className="flex flex-wrap gap-2">
                            {filter.colorOptions.map(color => (
                                <button
                                key={`mobile-${color.colorName}`}
                                className={`w-8 h-8 rounded-full flex items-center justify-center 
                                    ${activeFilters.color.includes(color.colorName) ? 
                                    'ring-2 ring-offset-2 ring-brand-accent' : ''}`}
                                style={{ backgroundColor: color.colorCode }}
                                title={color.colorName}
                                onClick={() => toggleFilter('color', color.colorName)}
                                aria-label={`Filter by ${color.colorName}`}
                                >
                                {activeFilters.color.includes(color.colorName) && (
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13L9 17L19 7" stroke={color.colorCode === '#FFFFFF' ? 'black' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                                </button>
                            ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                            {filter.options?.map(option => (
                                <div key={`mobile-${option}`} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`mobile-${filter.key}-${option}`}
                                    className="h-4 w-4 text-brand-accent rounded border-gray-300 focus:ring-brand-accent"
                                    checked={(activeFilters[filter.key as keyof typeof activeFilters] as string[]).includes(option)}
                                    onChange={() => toggleFilter(filter.key as keyof typeof activeFilters, option)}
                                />
                                <label htmlFor={`mobile-${filter.key}-${option}`} className="ml-2 text-sm text-gray-700">
                                    {option}
                                </label>
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                    ))}

                    {/* Price Range - Mobile */}
                    <div className="mb-6">
                        <h3 className="font-medium text-brand-dark mb-2">Price Range</h3>
                        <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">₹{activeFilters.priceRange[0]}</span>
                        <span className="text-sm text-gray-700">₹{activeFilters.priceRange[1]}</span>
                        </div>
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button 
                        className="flex-1 py-2 bg-[#3b3b3b] text-white rounded-md"
                        onClick={() => setIsFilterOpen(false)}
                        >
                        Apply Filters
                        </button>
                        <button 
                        className="flex-1 py-2 border border-brand-dark text-brand-dark rounded-md"
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
  {sortedProducts.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProducts.map((product) => (
        <Link
          key={`${product.productId}-${product.color}-${product.size}`}
          className="group cursor-pointer"
          href={`/pants/${product.productId}`}
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.productName} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.productOfferPercentage > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.productOfferPercentage}% OFF
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-brand-dark truncate">{product.productName}</h3>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="font-semibold">₹{product.productPrice.toFixed(2)}</p>
                  {product.productOfferPercentage > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      ₹{(product.productPrice / (1 - product.productOfferPercentage / 100)).toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    {renderStars(product.productReviewResponse.reviewAverage)}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">
                    ({product.productReviewResponse.totalNumberOfReviews})
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {product.productSubCategory}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Size: {product.size}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div className="bg-white rounded-lg p-8 text-center">
      <p className="text-gray-600">No products found matching your filters.</p>
      <button 
        className="mt-4 text-brand-accent hover:underline"
        onClick={clearFilters}
      >
        Clear all filters
      </button>
    </div>
  )}
</div>
            </div>
            </div>
        </div>
        </Layout>
    );
    };

    export default Pants;