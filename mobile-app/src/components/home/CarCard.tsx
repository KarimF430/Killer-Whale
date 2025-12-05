/**
 * MotorOctane Mobile App - CarCard Component
 * EXACT replica of web components/home/CarCard.tsx
 * 
 * Web specs from screenshot:
 * - Card: white bg, rounded-xl, border gray-200, shadow
 * - Image area: h-40/48, gray-50 bg
 * - NEW badge: green gradient (green-500 to emerald-600)
 * - POPULAR badge: orange-red gradient (orange-500 to red-600)
 * - Heart: filled red when active, outline gray otherwise
 * - Price: red-600, "₹ X.XX Lakh Onwards"
 * - Label: "On-Road Price" (gray-500)
 * - Icons: Fuel, Gauge (gray-400)
 * - Button: gradient red-orange
 */

import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7; // ~260px on most phones

export interface CarCardData {
    id: string;
    name: string;
    brand: string;
    brandName: string;
    image: string;
    startingPrice: number;
    lowestPriceFuelType?: string;
    fuelTypes: string[];
    transmissions: string[];
    seating: number;
    launchDate: string;
    slug: string;
    isNew: boolean;
    isPopular: boolean;
}

interface CarCardProps {
    car: CarCardData;
    onPress: () => void;
    onFavoritePress?: () => void;
    isFavorite?: boolean;
}

// Format transmission - matching web
const formatTransmission = (transmission: string): string => {
    const lower = transmission.toLowerCase();
    if (lower === 'manual') return 'Manual';
    if (lower === 'automatic') return 'Automatic';
    return transmission.toUpperCase();
};

// Format fuel type - matching web
const formatFuelType = (fuel: string): string => {
    const lower = fuel.toLowerCase();
    if (lower === 'cng') return 'CNG';
    if (lower === 'petrol') return 'Petrol';
    if (lower === 'diesel') return 'Diesel';
    if (lower === 'electric') return 'Electric';
    return fuel;
};

export default function CarCard({
    car,
    onPress,
    onFavoritePress,
    isFavorite = false,
}: CarCardProps) {
    const displayPrice = car.startingPrice;

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            style={styles.card}
        >
            {/* Image Container */}
            <View style={styles.imageContainer}>
                {/* NEW Badge - green gradient */}
                {car.isNew && (
                    <LinearGradient
                        colors={['#22C55E', '#059669']} // green-500 to emerald-600
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.badge}
                    >
                        <Text style={styles.badgeText}>NEW</Text>
                    </LinearGradient>
                )}

                {/* POPULAR Badge - orange-red gradient */}
                {car.isPopular && !car.isNew && (
                    <LinearGradient
                        colors={['#F97316', '#DC2626']} // orange-500 to red-600
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.badge}
                    >
                        <Text style={styles.badgeText}>POPULAR</Text>
                    </LinearGradient>
                )}

                {/* Wishlist Button - red filled circle with white heart from screenshot */}
                <TouchableOpacity
                    style={[
                        styles.wishlistButton,
                        isFavorite ? styles.wishlistButtonActive : styles.wishlistButtonInactive,
                    ]}
                    onPress={() => onFavoritePress?.()}
                >
                    <Feather
                        name="heart"
                        size={16}
                        color={isFavorite ? '#FFFFFF' : '#FFFFFF'}
                        fill={isFavorite ? '#FFFFFF' : 'none'}
                    />
                </TouchableOpacity>

                {/* Car Image */}
                <Image
                    source={{
                        uri: car.image || 'https://via.placeholder.com/300x200?text=No+Image'
                    }}
                    style={styles.carImage}
                    resizeMode="contain"
                />
            </View>

            {/* Car Info */}
            <View style={styles.infoContainer}>
                {/* Car Name */}
                <Text style={styles.carName} numberOfLines={1}>
                    {car.brandName} {car.name}
                </Text>

                {/* Price - matching screenshot exactly */}
                <View style={styles.priceRow}>
                    <Text style={styles.priceSymbol}>₹</Text>
                    <Text style={styles.price}>{(displayPrice / 100000).toFixed(2)} Lakh</Text>
                    <Text style={styles.priceOnwards}>Onwards</Text>
                </View>
                <Text style={styles.priceLabel}>On-Road Price</Text>

                {/* Specs - with proper icons from screenshot */}
                <View style={styles.specsContainer}>
                    <View style={styles.specRow}>
                        <MaterialCommunityIcons name="fuel" size={18} color="#9CA3AF" />
                        <Text style={styles.specText} numberOfLines={1}>
                            {(car.fuelTypes || ['Petrol']).map(formatFuelType).join('/')}
                        </Text>
                    </View>
                    <View style={styles.specRow}>
                        <MaterialCommunityIcons name="car-shift-pattern" size={18} color="#9CA3AF" />
                        <Text style={styles.specText} numberOfLines={1}>
                            {(car.transmissions || ['Manual']).map(formatTransmission).join('/')}
                        </Text>
                    </View>
                </View>

                {/* View Details Button - gradient */}
                <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                    <LinearGradient
                        colors={['#DC2626', '#EA580C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.viewDetailsButton}
                    >
                        <Text style={styles.viewDetailsText}>View Details</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // rounded-xl
        borderWidth: 1,
        borderColor: '#E5E7EB', // border-gray-200
        overflow: 'hidden',
        marginRight: 12, // gap-3 sm:gap-4
        // shadow-lg on hover
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    imageContainer: {
        height: 170, // h-40 sm:h-48
        backgroundColor: '#F9FAFB', // bg-gray-50
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 10, // px-2 sm:px-3
        paddingVertical: 4, // py-0.5 sm:py-1
        borderRadius: 9999, // rounded-full
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10, // text-[10px] sm:text-xs
        fontWeight: '600', // font-semibold
    },
    // Wishlist button - red filled circle from screenshot
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    wishlistButtonActive: {
        backgroundColor: '#EF4444', // red-500 - filled red from screenshot
    },
    wishlistButtonInactive: {
        backgroundColor: '#EF4444', // screenshot shows red circle even when not favorite
    },
    carImage: {
        width: '90%',
        height: '90%',
    },
    infoContainer: {
        padding: 16, // p-4 sm:p-5
    },
    carName: {
        fontSize: 16, // text-base sm:text-lg
        fontWeight: '700', // font-bold
        color: '#111827', // text-gray-900
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    priceSymbol: {
        fontSize: 18,
        fontWeight: '700',
        color: '#DC2626', // text-red-600
        marginRight: 2,
    },
    price: {
        fontSize: 18, // text-lg sm:text-xl
        fontWeight: '700', // font-bold
        color: '#DC2626', // text-red-600
    },
    priceOnwards: {
        fontSize: 14, // text-xs sm:text-sm
        color: '#6B7280', // text-gray-500
        marginLeft: 8,
    },
    priceLabel: {
        fontSize: 12, // text-xs
        color: '#6B7280', // text-gray-500
        marginBottom: 12,
    },
    specsContainer: {
        marginBottom: 12,
    },
    specRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8, // space-y-2 sm:space-y-2.5
        gap: 8, // mr-2 sm:mr-3
    },
    specText: {
        fontSize: 14, // text-sm
        color: '#4B5563', // text-gray-600
        flex: 1,
    },
    viewDetailsButton: {
        paddingVertical: 10, // py-2 sm:py-2.5
        borderRadius: 8, // rounded-lg
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    viewDetailsText: {
        color: '#FFFFFF',
        fontSize: 14, // text-sm sm:text-base
        fontWeight: '600', // font-semibold
    },
});
