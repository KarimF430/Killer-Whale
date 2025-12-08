/**
 * MotorOctane Mobile App - Model Screen
 * Section 1: Sticky Tab Bar + Car Image Carousel + Model Header + Rating + Description + Price + CTA
 * Section 2: Variant Dropdown + City Dropdown + EMI Calculator + Ad Carousel
 * PIXEL-PERFECT match with web frontend CarModelPage.tsx
 */

import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Image,
    Dimensions,
    Share,
    FlatList,
    Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Ad3DCarousel from '../components/ads/Ad3DCarousel';
import CarCard, { CarCardData } from '../components/home/CarCard';
import api from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ModelScreenProps {
    route: { params: { brandSlug: string; modelSlug: string } };
    navigation: any;
}

interface ModelData {
    id: string;
    name: string;
    brandId: string;
    brandName: string;
    heroImage: string;
    gallery: string[];
    rating: number;
    reviewCount: number;
    seoDescription: string;
    lowestPrice: number;
    highestPrice: number;
    fuelTypes: string[];
    transmissions: string[];
    variantCount: number;
    isNew?: boolean;
    isPopular?: boolean;
    keyFeatureImages?: { url: string; caption: string }[];
    spaceComfortImages?: { url: string; caption: string }[];
    storageConvenienceImages?: { url: string; caption: string }[];
    colorImages?: { url: string; caption: string; _id?: string }[];
    pros?: string[];
    cons?: string[];
    description?: string;
    exteriorDesign?: string;
    comfortConvenience?: string;
    engineSummaries?: { title: string; summary: string; transmission: string; power: string; torque: string; speed: string }[];
    mileageData?: { engineName: string; companyClaimed: string; cityRealWorld: string; highwayRealWorld: string }[];
    bodyType?: string;
    subBodyType?: string;
}

interface VariantData {
    id: string;
    name: string;
    price: number;
    fuel?: string;
    fuelType?: string;
    transmission?: string;
}

// Navigation sections matching web frontend exactly
const navigationSections = [
    { id: 'overview', label: 'Overview' },
    { id: 'emi-highlights', label: 'EMI & Highlights' },
    { id: 'variants', label: 'Variants' },
    { id: 'colors', label: 'Colors' },
];

// Popular cities for dropdown
const popularCities = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Chennai, Tamil Nadu',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Kolkata, West Bengal',
    'Ahmedabad, Gujarat',
    'Gulbarga, Karnataka',
];

const formatPrice = (price: number): string => {
    const lakhs = price / 100000;
    return lakhs.toFixed(2);
};

const formatPriceRange = (minLakh: number, maxLakh: number): string => {
    return `₹ ${minLakh.toFixed(2)} - ${maxLakh.toFixed(2)} Lakh`;
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Calculate EMI (20% down, 7 years, 8% interest)
const calculateEMI = (price: number): number => {
    const downPayment = price * 0.2;
    const principal = price - downPayment;
    const monthlyRate = 8 / 12 / 100;
    const months = 7 * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
};

export default function ModelScreen({ route, navigation }: ModelScreenProps) {
    const { brandSlug, modelSlug } = route.params;
    const [modelData, setModelData] = useState<ModelData | null>(null);
    const [variants, setVariants] = useState<VariantData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [isLiked, setIsLiked] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Section 2 state
    const [selectedVariant, setSelectedVariant] = useState<VariantData | null>(null);
    const [selectedCity, setSelectedCity] = useState('Mumbai, Maharashtra');
    const [showVariantDropdown, setShowVariantDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    // Section 3 state - Highlights
    const [activeHighlightTab, setActiveHighlightTab] = useState<'keyFeatures' | 'spaceComfort' | 'storageConvenience'>('keyFeatures');
    const [showPriceReadMore, setShowPriceReadMore] = useState(false);

    // Section 5 state - Variants
    const [selectedVariantFilters, setSelectedVariantFilters] = useState<string[]>(['All']);
    const [showAllVariants, setShowAllVariants] = useState(false);

    // Section 6 state - Colours
    const [selectedColor, setSelectedColor] = useState<string>('');

    // Section 7 state - Pros & Cons
    const [showAllPros, setShowAllPros] = useState(false);
    const [showAllCons, setShowAllCons] = useState(false);

    // Section 9 state - Engine
    const [expandedEngines, setExpandedEngines] = useState<Set<number>>(new Set());

    // Section 11 & 12 state - Similar Cars & Compare
    const [similarCars, setSimilarCars] = useState<CarCardData[]>([]);

    // Section 13 state - Model News
    const [modelNews, setModelNews] = useState<{ id: string; title: string; excerpt: string; slug: string; featuredImage?: string; publishDate: string; views: number; likes: number; authorName?: string }[]>([]);

    const imageScrollRef = useRef<FlatList>(null);
    const sectionScrollRef = useRef<ScrollView>(null);

    const formatBrandName = (slug: string): string => {
        if (slug === 'maruti-suzuki') return 'Maruti Suzuki';
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const fetchModelData = async () => {
        try {
            // Get all brands to find brandId
            const brands = await api.getBrands();
            const brand = brands.find((b: any) =>
                b.slug === brandSlug ||
                b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug
            );

            if (!brand) {
                console.error('Brand not found:', brandSlug);
                setLoading(false);
                return;
            }

            // Get models for this brand
            const models = await api.getModelsByBrand(brand.id);
            const model = models.find((m: any) =>
                m.name.toLowerCase().replace(/\s+/g, '-') === modelSlug ||
                m.slug === modelSlug
            );

            if (!model) {
                console.error('Model not found:', modelSlug);
                setLoading(false);
                return;
            }

            // Fetch complete model details including gallery
            const modelDetails = await api.getModelById(model.id);

            // Fetch variants
            const variantsData = await api.getVariantsByModel(model.id);
            const sortedVariants = variantsData.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
            setVariants(sortedVariants);

            // Set first variant as selected
            if (sortedVariants.length > 0) {
                setSelectedVariant(sortedVariants[0]);
            }

            // Build gallery images array
            const galleryImages: string[] = [];
            if (modelDetails?.galleryImages && Array.isArray(modelDetails.galleryImages)) {
                modelDetails.galleryImages.forEach((img: any) => {
                    if (typeof img === 'string') {
                        galleryImages.push(img);
                    } else if (img?.url) {
                        galleryImages.push(img.url);
                    }
                });
            }

            // Calculate price range from variants
            const prices = sortedVariants.map((v: any) => v.price || 0).filter((p: number) => p > 0);
            const lowestPrice = prices.length > 0 ? Math.min(...prices) : model.lowestPrice || 0;
            const highestPrice = prices.length > 0 ? Math.max(...prices) : model.highestPrice || lowestPrice;

            setModelData({
                id: model.id,
                name: model.name,
                brandId: brand.id,
                brandName: brand.name,
                heroImage: model.heroImage || modelDetails?.heroImage || 'https://via.placeholder.com/400x250',
                gallery: galleryImages,
                rating: modelDetails?.rating || model.rating || 4.5,
                reviewCount: modelDetails?.reviewCount || model.reviewCount || 1247,
                seoDescription: modelDetails?.headerSeo || modelDetails?.seoDescription || `The ${brand.name} ${model.name} has been launched at Rs. ${formatPrice(lowestPrice)} lakh (ex-showroom). It is boxier than before with striking LEDs to stand out. The sub-compact SUV is...`,
                lowestPrice: lowestPrice,
                highestPrice: highestPrice,
                fuelTypes: model.fuelTypes || ['Petrol'],
                transmissions: model.transmissions || ['Manual'],
                variantCount: sortedVariants.length || model.variantCount || 0,
                isNew: model.isNew || false,
                isPopular: model.isPopular || false,
                keyFeatureImages: modelDetails?.keyFeatureImages || [],
                spaceComfortImages: modelDetails?.spaceComfortImages || [],
                storageConvenienceImages: modelDetails?.storageConvenienceImages || [],
                colorImages: modelDetails?.colorImages || [],
                pros: modelDetails?.pros || [],
                cons: modelDetails?.cons || [],
                description: modelDetails?.description || '',
                exteriorDesign: modelDetails?.exteriorDesign || '',
                comfortConvenience: modelDetails?.comfortConvenience || '',
                engineSummaries: modelDetails?.engineSummaries || [],
                mileageData: modelDetails?.mileageData || [],
                bodyType: modelDetails?.bodyType || '',
                subBodyType: modelDetails?.subBodyType || '',
            });

            // Fetch similar cars - Match web logic exactly (just exclude current model)
            try {
                const allModels = await api.getModelsWithPricing(6); // Limit to 6 like web

                const similar = (Array.isArray(allModels) ? allModels : [])
                    .filter((m: any) => m.id !== modelDetails?.id) // Only exclude current model (same as web)
                    .slice(0, 6)
                    .map((m: any) => ({
                        id: m.id || String(Math.random()),
                        name: m.name || 'Unknown',
                        brand: m.brandId || '',
                        brandName: m.brandId?.replace('brand-', '').split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unknown',
                        image: m.heroImage || '',
                        startingPrice: m.lowestPrice || 0, // Ex-Showroom price
                        fuelTypes: m.fuelTypes || ['Petrol'],
                        transmissions: m.transmissions || ['Manual'],
                        seating: m.seating || 5,
                        launchDate: m.launchDate || 'Launched',
                        slug: m.slug || '',
                        isNew: m.isNew || false,
                        isPopular: m.isPopular || false,
                    }));
                setSimilarCars(similar);
            } catch (e) {
                console.error('Error fetching similar cars:', e);
            }

            // Fetch model news (filter by model name in title)
            try {
                const newsData = await api.getNews(20);
                const modelName = model.name.toLowerCase();
                const filteredNews = (Array.isArray(newsData) ? newsData : [])
                    .filter((n: any) =>
                        n.title?.toLowerCase().includes(modelName) ||
                        n.excerpt?.toLowerCase().includes(modelName)
                    )
                    .slice(0, 6)
                    .map((n: any) => ({
                        id: n.id,
                        title: n.title,
                        excerpt: n.excerpt,
                        slug: n.slug,
                        featuredImage: n.featuredImage,
                        publishDate: n.publishDate,
                        views: n.views || 0,
                        likes: n.likes || 0,
                        authorName: 'Haji Karim',
                    }));
                setModelNews(filteredNews);
            } catch (e) {
                console.error('Error fetching model news:', e);
            }
        } catch (error) {
            console.error('Error fetching model data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchModelData();
    }, [brandSlug, modelSlug]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchModelData();
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out the ${modelData?.brandName} ${modelData?.name} on MotorOctane!`,
                title: `${modelData?.brandName} ${modelData?.name}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
    };

    const handleImageScroll = (event: any) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32));
        setCurrentImageIndex(slideIndex);
    };

    const scrollToNextImage = () => {
        const allImages = [modelData?.heroImage, ...(modelData?.gallery || [])];
        if (currentImageIndex < allImages.length - 1) {
            imageScrollRef.current?.scrollToIndex({ index: currentImageIndex + 1, animated: true });
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#DC2626" />
                <Text style={styles.loadingText}>Loading {formatBrandName(brandSlug)} {modelSlug}...</Text>
            </SafeAreaView>
        );
    }

    if (!modelData) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Model not found</Text>
            </SafeAreaView>
        );
    }

    const allImages = [modelData.heroImage, ...(modelData.gallery || [])].filter(Boolean);
    const displayEMI = calculateEMI(modelData.lowestPrice);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <Header onSearchPress={() => navigation.navigate('Search')} navigation={navigation} />

            {/* Sticky Navigation Ribbon - EXACTLY like web */}
            <View style={styles.stickyNav}>
                <ScrollView
                    ref={sectionScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.stickyNavContent}
                >
                    {navigationSections.map((section) => (
                        <TouchableOpacity
                            key={section.id}
                            onPress={() => scrollToSection(section.id)}
                            style={[
                                styles.navTab,
                                activeSection === section.id && styles.navTabActive,
                            ]}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.navTabText,
                                    activeSection === section.id && styles.navTabTextActive,
                                ]}
                            >
                                {section.label}
                            </Text>
                            {activeSection === section.id && <View style={styles.navTabIndicator} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {/* Progress indicator bar */}
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: '30%' }]} />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#DC2626']}
                        tintColor="#DC2626"
                    />
                }
            >
                {/* Section 1: Overview */}
                <View style={styles.overviewSection}>
                    {/* Car Image Carousel */}
                    <View style={styles.imageCarouselContainer}>
                        <FlatList
                            ref={imageScrollRef}
                            data={allImages}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleImageScroll}
                            scrollEventThrottle={16}
                            keyExtractor={(item, index) => `image-${index}`}
                            getItemLayout={(data, index) => ({
                                length: SCREEN_WIDTH - 32,
                                offset: (SCREEN_WIDTH - 32) * index,
                                index,
                            })}
                            renderItem={({ item }) => (
                                <View style={styles.imageSlide}>
                                    <Image
                                        source={{ uri: item }}
                                        style={styles.carImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}
                        />

                        {/* Next Arrow Button */}
                        {allImages.length > 1 && currentImageIndex < allImages.length - 1 && (
                            <TouchableOpacity
                                style={styles.nextArrowButton}
                                onPress={scrollToNextImage}
                                activeOpacity={0.9}
                            >
                                <Feather name="chevron-right" size={24} color="#4B5563" />
                            </TouchableOpacity>
                        )}

                        {/* Image Counter */}
                        {allImages.length > 1 && (
                            <View style={styles.imageCounter}>
                                <Text style={styles.imageCounterText}>
                                    {currentImageIndex + 1} / {allImages.length}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Car Title and Actions */}
                    <View style={styles.titleRow}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.carTitle}>
                                {modelData.brandName} {modelData.name}
                            </Text>
                        </View>

                        {/* Share and Heart Icons */}
                        <View style={styles.actionIcons}>
                            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                                <Feather name="share-2" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLike} style={styles.iconButton}>
                                <Feather
                                    name="heart"
                                    size={20}
                                    color={isLiked ? '#DC2626' : '#9CA3AF'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Rating Badge */}
                    <View style={styles.ratingRow}>
                        <LinearGradient
                            colors={['#DC2626', '#EA580C']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.ratingBadge}
                        >
                            <Feather name="star" size={14} color="#FFFFFF" style={styles.ratingStarIcon} />
                            <Text style={styles.ratingValue}>{modelData.rating}</Text>
                            <Text style={styles.ratingCount}>({modelData.reviewCount})</Text>
                        </LinearGradient>
                        <TouchableOpacity>
                            <Text style={styles.rateReviewLink}>Rate & Review</Text>
                        </TouchableOpacity>
                    </View>

                    {/* SEO Description */}
                    <View style={styles.descriptionContainer}>
                        <Text
                            style={styles.descriptionText}
                            numberOfLines={showFullDescription ? undefined : 3}
                        >
                            {modelData.seoDescription}
                        </Text>
                        {!showFullDescription && (
                            <TouchableOpacity onPress={() => setShowFullDescription(true)}>
                                <Text style={styles.moreLink}>...more</Text>
                            </TouchableOpacity>
                        )}
                        {showFullDescription && (
                            <TouchableOpacity onPress={() => setShowFullDescription(false)}>
                                <Text style={styles.moreLink}>Show less</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Price Display */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>
                            {formatPriceRange(modelData.lowestPrice / 100000, modelData.highestPrice / 100000)}
                        </Text>
                        <Text style={styles.priceLabel}>*Ex-Showroom</Text>
                    </View>

                    {/* Get On-Road Price CTA Button */}
                    <TouchableOpacity
                        style={styles.ctaButtonContainer}
                        onPress={() => {
                            navigation.navigate('PriceBreakup', {
                                brandSlug,
                                modelSlug,
                                city: selectedCity.split(',')[0].toLowerCase().replace(/\s+/g, '-')
                            });
                        }}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#DC2626', '#EA580C']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.ctaButton}
                        >
                            <Text style={styles.ctaButtonText}>Get On-Road Price</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Variant Dropdown */}
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowVariantDropdown(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.dropdownText}>
                            {selectedVariant ? selectedVariant.name : 'Select Variant'}
                        </Text>
                        <Feather name="chevron-down" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* City Dropdown */}
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowCityDropdown(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.dropdownText}>{selectedCity}</Text>
                        <Feather name="chevron-down" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Section 2: EMI Calculator */}
                <View style={styles.emiSection}>
                    <View style={styles.emiCard}>
                        <View style={styles.emiHeader}>
                            {/* Bank Logo */}
                            <View style={styles.emiLeft}>
                                <LinearGradient
                                    colors={['#EA580C', '#F97316']}
                                    style={styles.bankLogo}
                                >
                                    <Text style={styles.bankLogoText}>K</Text>
                                </LinearGradient>
                                <View style={styles.bankInfo}>
                                    <Text style={styles.bankName}>kotak</Text>
                                    <Text style={styles.bankSubtitle}>Mahindra Bank</Text>
                                </View>
                            </View>

                            {/* EMI Amount */}
                            <View style={styles.emiRight}>
                                <Text style={styles.emiLabel}>Starting EMI</Text>
                                <Text style={styles.emiAmount}>{formatCurrency(displayEMI)}</Text>
                                <Text style={styles.emiPeriod}>per month</Text>
                            </View>
                        </View>

                        {/* Calculate EMI Button */}
                        <TouchableOpacity
                            style={styles.calculateEmiButtonContainer}
                            onPress={() => navigation.navigate('EMICalculator', { brandSlug, modelSlug })}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#DC2626', '#EA580C']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.calculateEmiButton}
                            >
                                <Text style={styles.calculateEmiButtonText}>Calculate EMI</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Ad Carousel */}
                <Ad3DCarousel autoRotate rotateInterval={4000} />
                {/* Section 3: Model Highlights */}
                <View style={styles.highlightsSection}>
                    <Text style={styles.highlightsTitle}>{modelData.brandName} {modelData.name} Highlights</Text>

                    {/* Tab Navigation */}
                    <View style={styles.highlightTabsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity onPress={() => setActiveHighlightTab('keyFeatures')} style={[styles.highlightTab, activeHighlightTab === 'keyFeatures' && styles.highlightTabActive]}>
                                <Text style={[styles.highlightTabText, activeHighlightTab === 'keyFeatures' && styles.highlightTabTextActive]}>{"Key &\nFeatures"}</Text>
                                {activeHighlightTab === 'keyFeatures' && <View style={styles.highlightTabIndicator} />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveHighlightTab('spaceComfort')} style={[styles.highlightTab, activeHighlightTab === 'spaceComfort' && styles.highlightTabActive]}>
                                <Text style={[styles.highlightTabText, activeHighlightTab === 'spaceComfort' && styles.highlightTabTextActive]}>{"Space &\nComfort"}</Text>
                                {activeHighlightTab === 'spaceComfort' && <View style={styles.highlightTabIndicator} />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveHighlightTab('storageConvenience')} style={[styles.highlightTab, activeHighlightTab === 'storageConvenience' && styles.highlightTabActive]}>
                                <Text style={[styles.highlightTabText, activeHighlightTab === 'storageConvenience' && styles.highlightTabTextActive]}>{"Storage &\nConvenience"}</Text>
                                {activeHighlightTab === 'storageConvenience' && <View style={styles.highlightTabIndicator} />}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    {/* Highlight Images Scroll */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightImagesScroll}>
                        {(activeHighlightTab === 'keyFeatures' ? modelData.keyFeatureImages : activeHighlightTab === 'spaceComfort' ? modelData.spaceComfortImages : modelData.storageConvenienceImages)?.map((img: any, index: number) => (
                            <View key={index} style={styles.highlightImageCard}>
                                <Image source={{ uri: img.url }} style={styles.highlightImage} resizeMode="cover" />
                                <View style={styles.highlightCaptionOverlay}>
                                    <Text style={styles.highlightCaptionText} numberOfLines={1}>{img.caption}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Section 4: Model Price */}
                <View style={styles.modelPriceSection}>
                    <Text style={styles.modelPriceTitle}>{modelData.brandName} {modelData.name} Price</Text>
                    <Text style={styles.modelPriceText}>
                        {modelData.brandName} {modelData.name} price for the base model starts at Rs. {formatPrice(modelData.lowestPrice)} Lakh and the top model price goes upto Rs. {formatPrice(modelData.highestPrice)} Lakh (Avg. ex-showroom). {modelData.name} price for {modelData.variantCount} variants is listed below.
                        {!showPriceReadMore && <Text style={styles.readMoreLink} onPress={() => setShowPriceReadMore(true)}> Read More</Text>}
                    </Text>
                    {showPriceReadMore && (
                        <Text style={styles.modelPriceText}>
                            The {modelData.brandName} {modelData.name} offers exceptional value with its competitive pricing structure across different variants.
                            <Text style={styles.readMoreLink} onPress={() => setShowPriceReadMore(false)}> Show Less</Text>
                        </Text>
                    )}
                </View>

                {/* Section 5: Variants */}
                <View style={styles.variantsSection}>
                    <Text style={styles.variantsTitle}>Variants</Text>

                    {/* Filter Buttons */}
                    <View style={styles.variantFiltersContainer}>
                        {(() => {
                            // Generate available filters dynamically
                            const filters: string[] = ['All'];
                            const fuelTypes = new Set<string>();
                            const transTypes = new Set<string>();

                            variants.forEach((v: any) => {
                                if (v.fuel || v.fuelType) fuelTypes.add(v.fuel || v.fuelType);
                                if (v.transmission) {
                                    const trans = v.transmission.toLowerCase();
                                    if (trans.includes('automatic') || trans.includes('cvt') || trans.includes('amt') || trans.includes('dct')) {
                                        transTypes.add('Automatic');
                                    } else {
                                        transTypes.add('Manual');
                                    }
                                }
                            });

                            fuelTypes.forEach(f => filters.push(f));
                            transTypes.forEach(t => filters.push(t));

                            return filters.map((filter: string) => (
                                <TouchableOpacity
                                    key={filter}
                                    onPress={() => {
                                        if (filter === 'All') {
                                            setSelectedVariantFilters(['All']);
                                        } else {
                                            setSelectedVariantFilters(prev => {
                                                const withoutAll = prev.filter(f => f !== 'All');
                                                if (withoutAll.includes(filter)) {
                                                    const newFilters = withoutAll.filter(f => f !== filter);
                                                    return newFilters.length === 0 ? ['All'] : newFilters;
                                                }
                                                return [...withoutAll, filter];
                                            });
                                        }
                                    }}
                                    style={styles.variantFilterButtonContainer}
                                >
                                    {selectedVariantFilters.includes(filter) ? (
                                        <LinearGradient
                                            colors={['#DC2626', '#F97316']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.variantFilterButtonActive}
                                        >
                                            <Text style={styles.variantFilterTextActive}>{filter}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={styles.variantFilterButton}>
                                            <Text style={styles.variantFilterText}>{filter}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ));
                        })()}
                    </View>

                    {/* Variant Cards */}
                    <View style={styles.variantCardsList}>
                        {(() => {
                            // Filter variants based on selected filters (AND logic)
                            let filteredVariants = variants;
                            if (!selectedVariantFilters.includes('All')) {
                                filteredVariants = variants.filter((v: any) => {
                                    const fuel = v.fuel || v.fuelType || '';
                                    const trans = v.transmission?.toLowerCase() || '';
                                    const isAutomatic = trans.includes('automatic') || trans.includes('cvt') || trans.includes('amt') || trans.includes('dct');

                                    // Check each selected filter
                                    const fuelFilters = selectedVariantFilters.filter(f => f === 'Petrol' || f === 'Diesel' || f === 'CNG' || f === 'Electric');
                                    const transFilters = selectedVariantFilters.filter(f => f === 'Manual' || f === 'Automatic');

                                    // Check fuel type match (if fuel filters selected)
                                    const fuelMatch = fuelFilters.length === 0 || fuelFilters.includes(fuel);

                                    // Check transmission match (if trans filters selected)
                                    let transMatch = transFilters.length === 0;
                                    if (transFilters.includes('Automatic') && isAutomatic) transMatch = true;
                                    if (transFilters.includes('Manual') && !isAutomatic) transMatch = true;

                                    return fuelMatch && transMatch;
                                });
                            }

                            const displayedVariants = filteredVariants.slice(0, 8);

                            return displayedVariants.length > 0 ? displayedVariants.map((variant: any, index: number) => (
                                <View key={variant.id || index} style={styles.variantCard}>
                                    <View style={styles.variantCardHeader}>
                                        <View style={styles.variantCardInfo}>
                                            <Text style={styles.variantCardName} numberOfLines={1}>{variant.name}</Text>
                                            <View style={styles.variantCardSpecs}>
                                                <Text style={styles.variantCardSpecText}>{variant.fuel || variant.fuelType || 'Petrol'}</Text>
                                                <Text style={styles.variantCardSpecText}>{variant.transmission || 'Manual'}</Text>
                                                <Text style={styles.variantCardSpecText}>{variant.power || '113 Bhp'}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.variantCardPrice}>
                                            <Text style={styles.variantCardPriceLabel}>Ex-Showroom</Text>
                                            <Text style={styles.variantCardPriceValue}>₹ {((variant.price || 0) / 100000).toFixed(2)} Lakh</Text>
                                        </View>
                                    </View>

                                    <View style={styles.variantCardFeatures}>
                                        <Text style={styles.variantCardFeaturesLabel}>Key Features:</Text>
                                        <Text style={styles.variantCardFeaturesText} numberOfLines={2}>{variant.features || (Array.isArray(variant.keyFeatures) ? variant.keyFeatures.join(', ') : variant.keyFeatures) || '6-Airbags, ABS With EBD, Electronic Stability Control...'}</Text>
                                    </View>

                                    <View style={styles.variantCardActions}>
                                        <TouchableOpacity style={styles.variantCardGetPriceButton}>
                                            <LinearGradient
                                                colors={['#DC2626', '#F97316']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={styles.variantCardGetPriceGradient}
                                            >
                                                <Text style={styles.variantCardGetPriceText}>Get On-Road Price</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.variantCardCompareButton}>
                                            <Text style={styles.variantCardCompareText}>Compare</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )) : (
                                <View style={styles.noVariantsContainer}>
                                    <Text style={styles.noVariantsText}>No variants found for selected filter.</Text>
                                </View>
                            );
                        })()}
                    </View>

                    {/* View All Variants Button */}
                    {variants.length > 8 && (
                        <TouchableOpacity style={styles.viewAllVariantsButton}>
                            <Text style={styles.viewAllVariantsText}>View All {variants.length} Variants</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Section 6: Colours */}
                {modelData.colorImages && modelData.colorImages.length > 0 && (
                    <View style={styles.coloursSection}>
                        {/* Ad Banner */}
                        <Ad3DCarousel />

                        <Text style={styles.coloursTitle}>{modelData.brandName} {modelData.name} Colours</Text>

                        {/* Main Car Image Display */}
                        <View style={styles.mainColorImageContainer}>
                            <Image
                                source={{ uri: (modelData.colorImages.find((c: any) => c.caption === selectedColor) || modelData.colorImages[0])?.url || '' }}
                                style={styles.mainColorImage}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Color Name */}
                        <Text style={styles.colorNameText}>
                            {selectedColor || modelData.colorImages[0]?.caption || 'Default Color'}
                        </Text>

                        {/* Color Thumbnails Scroll */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorThumbnailsScroll}>
                            {modelData.colorImages.map((color: any, index: number) => (
                                <TouchableOpacity
                                    key={color._id || index}
                                    onPress={() => setSelectedColor(color.caption)}
                                    style={[
                                        styles.colorThumbnailContainer,
                                        (selectedColor === color.caption || (!selectedColor && index === 0)) && styles.colorThumbnailSelected
                                    ]}
                                >
                                    <Image
                                        source={{ uri: color.url }}
                                        style={styles.colorThumbnailImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.colorThumbnailOverlay}>
                                        <Text style={styles.colorThumbnailText} numberOfLines={1}>
                                            {color.caption.length > 15 ? color.caption.substring(0, 15) + '...' : color.caption}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Section 7: Pros & Cons */}
                <View style={styles.prosConsSection}>
                    <Text style={styles.prosConsTitle}>{modelData.brandName} {modelData.name} Pros & Cons</Text>

                    {/* Pros Card */}
                    <View style={styles.prosConsCard}>
                        <View style={styles.prosConsHeader}>
                            <View style={[styles.prosConsIcon, { backgroundColor: '#DCFCE7' }]}>
                                <Text style={{ color: '#16A34A', fontSize: 14 }}>👍</Text>
                            </View>
                            <Text style={styles.prosConsLabel}>Pros</Text>
                        </View>

                        {(() => {
                            // Parse pros from backend (string with bullets) or use defaults
                            const parseBulletPoints = (text: string | string[] | undefined): string[] => {
                                if (Array.isArray(text)) return text;
                                if (!text || typeof text !== 'string') return [];
                                return text
                                    .split('\n')
                                    .map(line => line.trim())
                                    .filter(line => line.length > 0)
                                    .map(line => line.replace(/^[•\-\*]\s*/, ''));
                            };

                            const defaultPros = [
                                "The safety is top notch with five-star safety rating and six airbags as standard.",
                                "The interior and exterior design is modern with premium features.",
                                "Excellent fuel efficiency with impressive mileage figures."
                            ];

                            const parsedPros = parseBulletPoints(modelData.pros as any);
                            const prosData = parsedPros.length > 0 ? parsedPros : defaultPros;
                            const displayPros = showAllPros ? prosData : prosData.slice(0, 2);

                            return (
                                <>
                                    {displayPros.map((pro: string, index: number) => (
                                        <View key={index} style={styles.prosConsBullet}>
                                            <View style={styles.bulletDot} />
                                            <Text style={styles.prosConsText}>{pro}</Text>
                                        </View>
                                    ))}
                                    {prosData.length > 2 && (
                                        <TouchableOpacity onPress={() => setShowAllPros(!showAllPros)}>
                                            <Text style={styles.moreLink}>{showAllPros ? 'Show less' : '...more'}</Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            );
                        })()}
                    </View>

                    {/* Cons Card */}
                    <View style={styles.prosConsCard}>
                        <View style={styles.prosConsHeader}>
                            <View style={[styles.prosConsIcon, { backgroundColor: '#FEF3C7' }]}>
                                <Text style={{ color: '#D97706', fontSize: 14 }}>✓</Text>
                            </View>
                            <Text style={styles.prosConsLabel}>Cons</Text>
                        </View>

                        {(() => {
                            // Parse cons from backend (string with bullets) or use defaults
                            const parseBulletPoints = (text: string | string[] | undefined): string[] => {
                                if (Array.isArray(text)) return text;
                                if (!text || typeof text !== 'string') return [];
                                return text
                                    .split('\n')
                                    .map(line => line.trim())
                                    .filter(line => line.length > 0)
                                    .map(line => line.replace(/^[•\-\*]\s*/, ''));
                            };

                            const defaultCons = [
                                "The diesel engine can do with more refinement.",
                                "Road noise can be noticeable at higher speeds."
                            ];

                            const parsedCons = parseBulletPoints(modelData.cons as any);
                            const consData = parsedCons.length > 0 ? parsedCons : defaultCons;
                            const displayCons = showAllCons ? consData : consData.slice(0, 2);

                            return (
                                <>
                                    {displayCons.map((con: string, index: number) => (
                                        <View key={index} style={styles.prosConsBullet}>
                                            <View style={styles.bulletDot} />
                                            <Text style={styles.prosConsText}>{con}</Text>
                                        </View>
                                    ))}
                                    {consData.length > 2 && (
                                        <TouchableOpacity onPress={() => setShowAllCons(!showAllCons)}>
                                            <Text style={styles.moreLink}>{showAllCons ? 'Show less' : '...more'}</Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            );
                        })()}
                    </View>
                </View>

                {/* Section 8: Model Summary */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>{modelData.brandName} {modelData.name} Summary</Text>

                    {(() => {
                        // Parse bullet points from string
                        const parseBulletPoints = (text: string | undefined): string[] => {
                            if (!text || typeof text !== 'string') return [];
                            return text
                                .split('\n')
                                .map(line => line.trim())
                                .filter(line => line.length > 0)
                                .map(line => line.replace(/^[•\-\*]\s*/, ''));
                        };

                        const descriptionPoints = parseBulletPoints(modelData.description as any);
                        const exteriorPoints = parseBulletPoints(modelData.exteriorDesign as any);
                        const comfortPoints = parseBulletPoints(modelData.comfortConvenience as any);

                        return (
                            <>
                                {/* Description */}
                                {descriptionPoints.length > 0 && (
                                    <View style={styles.summarySubsection}>
                                        <View style={styles.summarySubheader}>
                                            <View style={styles.summaryDot} />
                                            <Text style={styles.summarySubtitle}>Description</Text>
                                        </View>
                                        {descriptionPoints.map((point, index) => (
                                            <View key={index} style={styles.summaryBullet}>
                                                <View style={styles.summaryBulletDot} />
                                                <Text style={styles.summaryBulletText}>{point}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {/* Exterior Design */}
                                {exteriorPoints.length > 0 && (
                                    <View style={styles.summarySubsection}>
                                        <View style={styles.summarySubheader}>
                                            <View style={styles.summaryDot} />
                                            <Text style={styles.summarySubtitle}>Exterior Design</Text>
                                        </View>
                                        {exteriorPoints.map((point, index) => (
                                            <View key={index} style={styles.summaryBullet}>
                                                <View style={styles.summaryBulletDot} />
                                                <Text style={styles.summaryBulletText}>{point}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {/* Comfort & Convenience */}
                                {comfortPoints.length > 0 && (
                                    <View style={styles.summarySubsection}>
                                        <View style={styles.summarySubheader}>
                                            <View style={styles.summaryDot} />
                                            <Text style={styles.summarySubtitle}>Comfort & Convenience</Text>
                                        </View>
                                        {comfortPoints.map((point, index) => (
                                            <View key={index} style={styles.summaryBullet}>
                                                <View style={styles.summaryBulletDot} />
                                                <Text style={styles.summaryBulletText}>{point}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </>
                        );
                    })()}
                </View>

                {/* Section 9: Engine */}
                {modelData.engineSummaries && modelData.engineSummaries.length > 0 && (
                    <View style={styles.engineSection}>
                        {/* Ad Banner */}
                        <Ad3DCarousel />

                        <Text style={styles.engineTitle}>{modelData.brandName} {modelData.name} Engine</Text>

                        {modelData.engineSummaries.map((engine, index) => {
                            const isExpanded = expandedEngines.has(index);
                            const toggleEngine = () => {
                                setExpandedEngines(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(index)) {
                                        newSet.delete(index);
                                    } else {
                                        newSet.add(index);
                                    }
                                    return newSet;
                                });
                            };

                            return (
                                <View key={index} style={styles.engineCard}>
                                    <View style={styles.engineCardHeader}>
                                        <LinearGradient
                                            colors={['#DC2626', '#F97316']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.engineNumberBadge}
                                        >
                                            <Text style={styles.engineNumberText}>{index + 1}</Text>
                                        </LinearGradient>
                                        <Text style={styles.engineName}>{engine.title}</Text>
                                        <TouchableOpacity onPress={toggleEngine}>
                                            <Text style={styles.engineReadMore}>
                                                {isExpanded ? 'Show Less' : 'Read More'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.engineDescBullet}>
                                        <View style={styles.engineBulletDot} />
                                        <Text style={styles.engineDescText}>{engine.summary}</Text>
                                    </View>

                                    {isExpanded && (
                                        <View style={styles.engineSpecs}>
                                            <Text style={styles.engineSpecsTitle}>
                                                {engine.transmission?.toUpperCase() || 'MANUAL'}
                                            </Text>
                                            <View style={styles.engineSpecsRow}>
                                                <View style={styles.engineSpecItem}>
                                                    <Text style={styles.engineSpecLabel}>Power:</Text>
                                                    <Text style={styles.engineSpecValue}>{engine.power}</Text>
                                                </View>
                                                <View style={styles.engineSpecItem}>
                                                    <Text style={styles.engineSpecLabel}>Torque:</Text>
                                                    <Text style={styles.engineSpecValue}>{engine.torque}</Text>
                                                </View>
                                                <View style={styles.engineSpecItem}>
                                                    <Text style={styles.engineSpecLabel}>Transmission:</Text>
                                                    <Text style={styles.engineSpecValue}>{engine.speed}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Section 10: Mileage */}
                {modelData.mileageData && modelData.mileageData.length > 0 && (
                    <View style={styles.mileageSection}>
                        <Text style={styles.mileageTitle}>{modelData.brandName} {modelData.name} Mileage</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.mileageScrollContainer}
                        >
                            {modelData.mileageData.map((mileage, index) => (
                                <View key={index} style={styles.mileageCard}>
                                    <Text style={styles.mileageCardHeader}>Engine & Transmission</Text>
                                    <Text style={styles.mileageCardEngineName}>{mileage.engineName}</Text>

                                    <View style={styles.mileageRow}>
                                        <Text style={styles.mileageRowLabel}>Company Claimed</Text>
                                        <Text style={styles.mileageRowValue}>{mileage.companyClaimed}</Text>
                                    </View>

                                    <View style={styles.mileageRow}>
                                        <Text style={styles.mileageRowLabel}>City Real World</Text>
                                        <Text style={styles.mileageRowValue}>{mileage.cityRealWorld}</Text>
                                    </View>

                                    <View style={[styles.mileageRow, { borderBottomWidth: 0 }]}>
                                        <Text style={styles.mileageRowLabel}>Highway Real World</Text>
                                        <Text style={styles.mileageRowValue}>{mileage.highwayRealWorld}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Ad Banner */}
                        <View style={{ marginTop: 24 }}>
                            <Ad3DCarousel />
                        </View>
                    </View>
                )}

                {/* Section 11: Similar Cars */}
                {similarCars.length > 0 && (
                    <View style={styles.similarCarsSection}>
                        <Text style={styles.similarCarsTitle}>Similar Cars To {modelData.name}</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.similarCarsScrollContainer}
                        >
                            {similarCars.map((car, index) => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    onPress={() => navigation.navigate('Model', {
                                        brandSlug: car.brand.replace('brand-', ''),
                                        modelSlug: car.name.toLowerCase().replace(/\s+/g, '-')
                                    })}
                                    isLast={index === similarCars.length - 1}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Section 12: Compare With Similar Cars */}
                {similarCars.length > 0 && (
                    <View style={styles.compareSimilarSection}>
                        <Text style={styles.compareSimilarTitle}>Compare With Similar Cars</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.compareScrollContainer}
                        >
                            {similarCars.slice(0, 4).map((car, index) => (
                                <View key={car.id} style={styles.compareCard}>
                                    <View style={styles.compareCarsRow}>
                                        {/* Current Model */}
                                        <View style={styles.compareCarSection}>
                                            <Image
                                                source={{ uri: modelData.heroImage || 'https://via.placeholder.com/150x100' }}
                                                style={styles.compareCarImage}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.compareBrandName}>{modelData.brandName}</Text>
                                            <Text style={styles.compareModelName} numberOfLines={1}>{modelData.name}</Text>
                                            <Text style={styles.comparePrice}>₹ {((modelData.lowestPrice || 0) / 100000).toFixed(2)} Lakh</Text>
                                            <Text style={styles.comparePriceLabel}>Ex-Showroom</Text>
                                        </View>

                                        {/* VS Badge */}
                                        <View style={styles.compareVsBadgeContainer}>
                                            <LinearGradient
                                                colors={['#DC2626', '#EA580C']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={styles.compareVsBadge}
                                            >
                                                <Text style={styles.compareVsText}>VS</Text>
                                            </LinearGradient>
                                        </View>

                                        {/* Similar Car */}
                                        <View style={styles.compareCarSection}>
                                            <Image
                                                source={{ uri: car.image || 'https://via.placeholder.com/150x100' }}
                                                style={styles.compareCarImage}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.compareBrandName}>{car.brandName}</Text>
                                            <Text style={styles.compareModelName} numberOfLines={1}>{car.name}</Text>
                                            <Text style={styles.comparePrice}>₹ {(car.startingPrice / 100000).toFixed(2)} Lakh</Text>
                                            <Text style={styles.comparePriceLabel}>Ex-Showroom</Text>
                                        </View>
                                    </View>

                                    {/* Compare Now Button */}
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Compare')}
                                        activeOpacity={0.9}
                                    >
                                        <LinearGradient
                                            colors={['#DC2626', '#EA580C']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.compareNowButton}
                                        >
                                            <Text style={styles.compareNowButtonText}>Compare Now</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Compare Cars of Your Choice Button */}
                        <TouchableOpacity
                            style={styles.customCompareButton}
                            onPress={() => navigation.navigate('Compare')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.customCompareText}>Compare Cars of Your Choice</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Section 13: Model News */}
                {modelNews.length > 0 && (
                    <View style={styles.modelNewsSection}>
                        {/* Header */}
                        <View style={styles.modelNewsHeader}>
                            <Text style={styles.modelNewsTitle}>{modelData.name} News</Text>
                            <TouchableOpacity
                                style={styles.modelNewsViewAll}
                                onPress={() => navigation.navigate('News')}
                            >
                                <Text style={styles.modelNewsViewAllText}>View All</Text>
                                <Feather name="arrow-right" size={14} color="#DC2626" />
                            </TouchableOpacity>
                        </View>

                        {/* Horizontal Scroll News Cards */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.modelNewsScrollContainer}
                        >
                            {modelNews.map((article) => (
                                <TouchableOpacity
                                    key={article.id}
                                    style={styles.newsCard}
                                    onPress={() => navigation.navigate('News')}
                                    activeOpacity={0.9}
                                >
                                    {/* Image */}
                                    <View style={styles.newsCardImageContainer}>
                                        <Image
                                            source={{ uri: article.featuredImage || 'https://via.placeholder.com/260x140?text=News' }}
                                            style={styles.newsCardImage}
                                            resizeMode="cover"
                                        />
                                        {/* News Badge */}
                                        <View style={styles.newsCardBadge}>
                                            <Text style={styles.newsCardBadgeText}>News</Text>
                                        </View>
                                    </View>

                                    {/* Content */}
                                    <View style={styles.newsCardContent}>
                                        <Text style={styles.newsCardTitle} numberOfLines={2}>{article.title}</Text>
                                        <Text style={styles.newsCardExcerpt} numberOfLines={2}>{article.excerpt}</Text>

                                        {/* Author & Date */}
                                        <View style={styles.newsCardMetaRow}>
                                            <Text style={styles.newsCardAuthor}>{article.authorName || 'Haji Karim'}</Text>
                                            <Text style={styles.newsCardMetaDot}>•</Text>
                                            <Feather name="calendar" size={12} color="#6B7280" />
                                            <Text style={styles.newsCardDate}>
                                                {new Date(article.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </Text>
                                        </View>

                                        {/* Stats */}
                                        <View style={styles.newsCardStatsRow}>
                                            <View style={styles.newsCardStatItem}>
                                                <Feather name="clock" size={12} color="#6B7280" />
                                                <Text style={styles.newsCardStatText}>1 min read</Text>
                                            </View>
                                            <View style={styles.newsCardStatItem}>
                                                <Feather name="eye" size={12} color="#6B7280" />
                                                <Text style={styles.newsCardStatText}>{article.views.toLocaleString()}</Text>
                                            </View>
                                            <View style={styles.newsCardStatItem}>
                                                <Feather name="message-circle" size={12} color="#6B7280" />
                                                <Text style={styles.newsCardStatText}>{article.likes}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Ad Banner */}
                        <View style={{ marginTop: 24 }}>
                            <Ad3DCarousel />
                        </View>
                    </View>
                )}

                {/* Footer */}
                <Footer onNavigate={(screen: string) => navigation.navigate(screen as never)} />
            </ScrollView>

            {/* Variant Selection Modal */}
            <Modal
                visible={showVariantDropdown}
                transparent
                animationType="slide"
                onRequestClose={() => setShowVariantDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowVariantDropdown(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Variant</Text>
                            <TouchableOpacity onPress={() => setShowVariantDropdown(false)}>
                                <Feather name="x" size={24} color="#111827" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalList}>
                            {variants.map((variant) => (
                                <TouchableOpacity
                                    key={variant.id}
                                    style={[
                                        styles.modalItem,
                                        selectedVariant?.id === variant.id && styles.modalItemSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedVariant(variant);
                                        setShowVariantDropdown(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{variant.name}</Text>
                                    <Text style={styles.modalItemPrice}>
                                        ₹ {formatPrice(variant.price)} L
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* City Selection Modal */}
            <Modal
                visible={showCityDropdown}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCityDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCityDropdown(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select City</Text>
                            <TouchableOpacity onPress={() => setShowCityDropdown(false)}>
                                <Feather name="x" size={24} color="#111827" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalList}>
                            {popularCities.map((city) => (
                                <TouchableOpacity
                                    key={city}
                                    style={[
                                        styles.modalItem,
                                        selectedCity === city && styles.modalItemSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedCity(city);
                                        setShowCityDropdown(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{city}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },

    // Sticky Navigation
    stickyNav: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    stickyNavContent: {
        paddingHorizontal: 16,
    },
    navTab: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        position: 'relative',
    },
    navTabActive: {},
    navTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    navTabTextActive: {
        color: '#DC2626',
        fontWeight: '600',
    },
    navTabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 16,
        right: 16,
        height: 2,
        backgroundColor: '#DC2626',
        borderRadius: 1,
    },
    progressBarContainer: {
        height: 3,
        backgroundColor: '#E5E7EB',
    },
    progressBar: {
        height: 3,
        backgroundColor: '#EA580C',
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
    },

    // Section 1: Overview
    overviewSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },

    // Image Carousel
    imageCarouselContainer: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
        marginBottom: 16,
    },
    imageSlide: {
        width: SCREEN_WIDTH - 32,
        aspectRatio: 16 / 10,
    },
    carImage: {
        width: '100%',
        height: '100%',
    },
    nextArrowButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    imageCounter: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    imageCounterText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },

    // Title and Actions
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    titleContainer: {
        flex: 1,
    },
    carTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 36,
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        padding: 8,
    },

    // Rating Badge
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    ratingStarIcon: {
        marginRight: 4,
    },
    ratingValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    ratingCount: {
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 4,
    },
    rateReviewLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
    },

    // Description
    descriptionContainer: {
        marginBottom: 16,
    },
    descriptionText: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 24,
    },
    moreLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
        marginTop: 4,
    },

    // Price Display
    priceContainer: {
        marginBottom: 16,
    },
    priceText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#16A34A',
    },
    priceLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },

    // CTA Button
    ctaButtonContainer: {
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    ctaButton: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Dropdowns
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 12,
    },
    dropdownText: {
        fontSize: 16,
        color: '#111827',
    },

    // Section 2: EMI
    emiSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    emiCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 20,
    },
    emiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    emiLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bankLogo: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    bankLogoText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    bankInfo: {},
    bankName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    bankSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    emiRight: {
        alignItems: 'flex-end',
    },
    emiLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    emiAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    emiPeriod: {
        fontSize: 14,
        color: '#6B7280',
    },
    calculateEmiButtonContainer: {},
    calculateEmiButton: {
        borderRadius: 50,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calculateEmiButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Section 3: Highlights
    highlightsSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    highlightsTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    highlightTabsContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 16,
    },
    highlightTab: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        position: 'relative',
        minWidth: 100,
        alignItems: 'center',
    },
    highlightTabActive: {},
    highlightTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        textAlign: 'center',
    },
    highlightTabTextActive: {
        color: '#DC2626',
        fontWeight: '600',
    },
    highlightTabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 16,
        right: 16,
        height: 2,
        backgroundColor: '#DC2626',
    },
    highlightImagesScroll: {
        marginBottom: 16,
    },
    highlightImageCard: {
        width: (SCREEN_WIDTH - 32) * 0.6,
        marginRight: 12,
        borderRadius: 8,
        overflow: 'hidden',
    },
    highlightImage: {
        width: '100%',
        aspectRatio: 4 / 3,
        backgroundColor: '#F3F4F6',
    },
    highlightCaptionOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    highlightCaptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    noHighlightsContainer: {
        padding: 24,
        alignItems: 'center',
    },
    noHighlightsText: {
        fontSize: 14,
        color: '#9CA3AF',
    },

    // Section 4: Model Price
    modelPriceSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    modelPriceTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    modelPriceContent: {},
    modelPriceText: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 24,
    },
    readMoreLink: {
        color: '#DC2626',
        fontWeight: '600',
    },

    // Section 5: Variants
    variantsSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    variantsTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    variantFiltersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    variantFilterButtonContainer: {
        marginRight: 10,
        marginBottom: 10,
    },
    variantFilterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    variantFilterButtonActive: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    variantFilterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    variantFilterTextActive: {
        color: '#FFFFFF',
    },
    variantCardsList: {
    },
    variantCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        marginBottom: 12,
    },
    variantCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    variantCardInfo: {
        flex: 1,
        paddingRight: 12,
    },
    variantCardName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#DC2626',
        marginBottom: 4,
    },
    variantCardSpecs: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    variantCardSpecText: {
        fontSize: 14,
        color: '#6B7280',
    },
    variantCardPrice: {
        alignItems: 'flex-end',
    },
    variantCardPriceLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    variantCardPriceValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    variantCardFeatures: {
        marginBottom: 16,
    },
    variantCardFeaturesLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    variantCardFeaturesText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    variantCardActions: {
        flexDirection: 'row',
        gap: 12,
    },
    variantCardGetPriceButton: {
        flex: 1,
    },
    variantCardGetPriceGradient: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    variantCardGetPriceText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    variantCardCompareButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    variantCardCompareText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    noVariantsContainer: {
        padding: 24,
        alignItems: 'center',
    },
    noVariantsText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    viewAllVariantsButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    viewAllVariantsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#DC2626',
    },

    // Section 6: Colours
    coloursSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    coloursTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginTop: 20,
        marginBottom: 16,
    },
    mainColorImageContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    mainColorImage: {
        width: SCREEN_WIDTH - 72,
        height: (SCREEN_WIDTH - 72) * 0.6,
    },
    colorNameText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 20,
    },
    colorThumbnailsScroll: {
        marginBottom: 8,
    },
    colorThumbnailContainer: {
        width: 130,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 12,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorThumbnailSelected: {
        borderColor: '#DC2626',
    },
    colorThumbnailImage: {
        width: '100%',
        height: '100%',
    },
    colorThumbnailOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    colorThumbnailText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
    },

    // Section 7: Pros & Cons
    prosConsSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    prosConsTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
    },
    prosConsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 20,
        marginBottom: 16,
    },
    prosConsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    prosConsIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    prosConsLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    prosConsBullet: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    bulletDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#9CA3AF',
        marginTop: 6,
        marginRight: 12,
    },
    prosConsText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 22,
    },

    // Section 8: Model Summary
    summarySection: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    summaryTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
    },
    summarySubsection: {
        marginBottom: 24,
    },
    summarySubheader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#374151',
        marginRight: 10,
    },
    summarySubtitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    summaryBullet: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingLeft: 20,
    },
    summaryBulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#9CA3AF',
        marginTop: 7,
        marginRight: 12,
    },
    summaryBulletText: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },

    // Section 9: Engine
    engineSection: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 24,
    },
    engineTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    engineCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
    },
    engineCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    engineNumberBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    engineNumberText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    engineName: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    engineReadMore: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
    },
    engineDescBullet: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    engineBulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#9CA3AF',
        marginTop: 7,
        marginRight: 12,
    },
    engineDescText: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
    engineSpecs: {
        marginTop: 20,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 16,
    },
    engineSpecsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 16,
    },
    engineSpecsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    engineSpecItem: {
        alignItems: 'center',
        flex: 1,
    },
    engineSpecLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    engineSpecValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },

    // Section 10: Mileage
    mileageSection: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 24,
    },
    mileageTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    mileageScrollContainer: {
        paddingHorizontal: 16,
    },
    mileageCard: {
        width: 256,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        marginRight: 16,
    },
    mileageCardHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#EF4444',
        marginBottom: 4,
        textAlign: 'center',
    },
    mileageCardEngineName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#EF4444',
        marginBottom: 16,
        textAlign: 'center',
    },
    mileageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    mileageRowLabel: {
        fontSize: 14,
        color: '#4B5563',
    },
    mileageRowValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },

    // Section 11: Similar Cars
    similarCarsSection: {
        paddingVertical: 24,
        backgroundColor: '#FFFFFF',
    },
    similarCarsTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    similarCarsScrollContainer: {
        paddingHorizontal: 16,
    },

    // Section 12: Compare With Similar Cars
    compareSimilarSection: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    compareSimilarTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
    },
    compareScrollContainer: {
        // paddingHorizontal handled by parent
    },
    compareCard: {
        width: 320,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 12,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    compareCarsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    compareCarSection: {
        flex: 1,
        alignItems: 'flex-start',
    },
    compareCarImage: {
        width: '100%',
        height: 80,
        marginBottom: 8,
    },
    compareBrandName: {
        fontSize: 12,
        color: '#6B7280',
    },
    compareModelName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    comparePrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#DC2626',
    },
    comparePriceLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    compareVsBadgeContainer: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    compareVsBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    compareVsText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    compareNowButton: {
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    compareNowButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    customCompareButton: {
        marginTop: 16,
        borderWidth: 2,
        borderColor: '#DC2626',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    customCompareText: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '600',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    modalList: {
        padding: 16,
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 4,
    },
    modalItemSelected: {
        backgroundColor: '#FEF2F2',
    },
    modalItemText: {
        fontSize: 16,
        color: '#111827',
    },
    modalItemPrice: {
        fontSize: 14,
        color: '#6B7280',
    },
});
