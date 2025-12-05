/**
 * MotorOctane Mobile App - Home Screen
 * EXACT replica of web app/page.tsx
 * 
 * Sections (matching web):
 * 1. Header with logo
 * 2. Ad 3D Carousel
 * 3. Hero Section (AI Search)
 * 4. Cars by Budget
 * 5. Popular Cars
 * 6. Popular Brands
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import Header from '../components/common/Header';
import Ad3DCarousel from '../components/ads/Ad3DCarousel';
import HeroSection from '../components/home/HeroSection';
import CarsByBudget from '../components/home/CarsByBudget';
import CarCard, { CarCardData } from '../components/home/CarCard';
import api, { Brand } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// SECTION HEADER COMPONENT
// ============================================
const SectionHeader = ({
    title,
    icon,
    onViewAll,
}: {
    title: string;
    icon?: string;
    onViewAll?: () => void;
}) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
            {icon && <Text>{icon} </Text>}{title}
        </Text>
        {onViewAll && (
            <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
        )}
    </View>
);

// ============================================
// BRAND CARD COMPONENT
// ============================================
const BrandCard = ({
    brand,
    onPress,
}: {
    brand: Brand;
    onPress: () => void;
}) => (
    <TouchableOpacity
        style={styles.brandCard}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.brandLogoContainer}>
            {brand.logo ? (
                <Image
                    source={{ uri: brand.logo }}
                    style={styles.brandLogo}
                    resizeMode="contain"
                />
            ) : (
                <Text style={styles.brandLogoPlaceholder}>
                    {brand.name.charAt(0)}
                </Text>
            )}
        </View>
        <Text style={styles.brandName} numberOfLines={1}>
            {brand.name}
        </Text>
    </TouchableOpacity>
);

// ============================================
// MAIN HOME SCREEN
// ============================================
export default function HomeScreen({ navigation }: any) {
    const [allCars, setAllCars] = useState<CarCardData[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAdBanner, setShowAdBanner] = useState(true);

    const fetchData = async () => {
        try {
            console.log('📱 Fetching home data...');
            const [brandsData, modelsData] = await Promise.all([
                api.getBrands(),
                api.getModelsWithPricing(100),
            ]);

            console.log('✅ Brands:', brandsData?.length || 0);
            console.log('✅ Models:', modelsData?.length || 0);

            setBrands(Array.isArray(brandsData) ? brandsData : []);

            // Format models as cars
            const formattedCars = (Array.isArray(modelsData) ? modelsData : []).map((model: any) => ({
                id: model._id || model.id || String(Math.random()),
                name: model.name || 'Unknown',
                brand: model.brandId || '',
                brandName: model.brandName || 'Unknown',
                image: model.heroImage || model.image || '',
                startingPrice: model.lowestPrice || model.startingPrice || 0,
                fuelTypes: model.fuelTypes || ['Petrol'],
                transmissions: model.transmissions || ['Manual'],
                seating: model.seating || 5,
                launchDate: model.launchDate || 'Launched',
                slug: model.slug || model.name?.toLowerCase().replace(/\s+/g, '-') || '',
                isNew: model.isNew || false,
                isPopular: model.isPopular || false,
            }));

            setAllCars(formattedCars);
        } catch (error) {
            console.error('❌ Error fetching data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // Get popular cars
    const getPopularCars = () => {
        return allCars.filter(car => car.isPopular).slice(0, 10);
    };

    // Handle car press
    const handleCarPress = (car: CarCardData) => {
        navigation.navigate('Model', {
            brandSlug: car.brandName.toLowerCase().replace(/\s+/g, '-'),
            modelSlug: car.name.toLowerCase().replace(/\s+/g, '-'),
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#DC2626" />
                <Text style={styles.loadingText}>Loading cars...</Text>
            </SafeAreaView>
        );
    }

    const popularCars = getPopularCars();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* SECTION 1: Header */}
            <Header
                onSearchPress={() => navigation.navigate('Search')}
                onLocationPress={() => { }}
                navigation={navigation}
            />

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
                {/* SECTION 1: Ad Banner Carousel */}
                {showAdBanner && (
                    <Ad3DCarousel
                        autoRotate={true}
                        rotateInterval={4000}
                        onClose={() => setShowAdBanner(false)}
                    />
                )}

                {/* SECTION 1: Hero Section (AI Search) */}
                <HeroSection
                    onSearchPress={() => navigation.navigate('Search')}
                    onVoicePress={() => navigation.navigate('Search')}
                />

                {/* SECTION 2: Cars by Budget */}
                <CarsByBudget
                    cars={allCars}
                    onCarPress={handleCarPress}
                />

                {/* SECTION 3: Popular Cars */}
                {popularCars.length > 0 && (
                    <View style={styles.section}>
                        <SectionHeader
                            title="Popular Cars"
                            icon="🔥"
                            onViewAll={() => navigation.navigate('Search')}
                        />
                        <FlatList
                            data={popularCars}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.carsList}
                            renderItem={({ item }) => (
                                <CarCard car={item} onPress={() => handleCarPress(item)} />
                            )}
                        />
                    </View>
                )}

                {/* SECTION 4: Popular Brands */}
                <View style={[styles.section, styles.sectionGray]}>
                    <SectionHeader
                        title="Popular Brands"
                        icon="🏢"
                        onViewAll={() => navigation.navigate('Search')}
                    />
                    <View style={styles.brandsGrid}>
                        {brands.slice(0, 12).map((brand) => (
                            <BrandCard
                                key={brand.id}
                                brand={brand}
                                onPress={() =>
                                    navigation.navigate('Brand', { brandSlug: brand.slug })
                                }
                            />
                        ))}
                    </View>
                </View>

                {/* Bottom Padding */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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

    // Sections
    section: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    sectionGray: {
        backgroundColor: '#F9FAFB',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    viewAllText: {
        fontSize: 14,
        color: '#DC2626',
        fontWeight: '600',
    },

    // Cars list
    carsList: {
        paddingRight: 16,
    },

    // Brands Grid
    brandsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    brandCard: {
        width: (SCREEN_WIDTH - 32 - 36) / 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 8,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    brandLogoContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    brandLogo: {
        width: 36,
        height: 36,
    },
    brandLogoPlaceholder: {
        fontSize: 20,
        fontWeight: '700',
        color: '#6B7280',
    },
    brandName: {
        fontSize: 11,
        fontWeight: '500',
        color: '#111827',
        textAlign: 'center',
    },
});
