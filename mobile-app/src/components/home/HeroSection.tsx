/**
 * MotorOctane Mobile App - Hero Section (AI Search)
 * EXACT replica of web components/home/HeroSection.tsx
 * 
 * Web uses Lucide icons: Sparkles, Mic
 * Mobile uses MaterialCommunityIcons (similar design)
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface HeroSectionProps {
    onSearchPress?: () => void;
    onVoicePress?: () => void;
}

export default function HeroSection({ onSearchPress, onVoicePress }: HeroSectionProps) {
    return (
        <LinearGradient
            // from-red-600 to-orange-500 (diagonal)
            colors={['#DC2626', '#EA580C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
        >
            {/* Hero Title - centered like web */}
            <View style={styles.titleContainer}>
                <Text style={styles.heroTitle}>Find Your Perfect Car</Text>
            </View>

            {/* Search Card - white with shadow */}
            <View style={styles.searchCard}>
                {/* Search Input (clickable, navigates to AI chat) */}
                <TouchableOpacity
                    style={styles.searchInputContainer}
                    onPress={onSearchPress}
                    activeOpacity={0.8}
                >
                    <View style={styles.searchInput}>
                        <Text style={styles.searchPlaceholder}>
                            Best car for family under 15 lakhs
                        </Text>
                        {/* Mic Icon - matches web Mic from lucide-react */}
                        <TouchableOpacity
                            onPress={onVoicePress}
                            style={styles.micButton}
                            activeOpacity={0.7}
                        >
                            <Feather name="mic" size={22} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                {/* Start AI Search Button - matches web exactly */}
                <TouchableOpacity onPress={onSearchPress} activeOpacity={0.9}>
                    <LinearGradient
                        colors={['#DC2626', '#EA580C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.aiSearchButton}
                    >
                        {/* Sparkles icon - matches web Sparkles from lucide-react */}
                        <MaterialCommunityIcons name="shimmer" size={22} color="#FFFFFF" />
                        <Text style={styles.aiSearchText}>Start AI Search</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Subtext */}
                <Text style={styles.subtext}>
                    Our AI will ask you a few questions to find your perfect match
                </Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    heroGradient: {
        paddingTop: 32,    // py-8 on mobile
        paddingBottom: 48, // more padding at bottom
        paddingHorizontal: 12, // px-3 on mobile
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 24, // mb-6
    },
    heroTitle: {
        fontSize: 28, // text-3xl
        fontWeight: '700', // font-bold
        color: '#FFFFFF',
        textAlign: 'center',
    },
    searchCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24, // rounded-2xl sm:rounded-3xl
        padding: 24, // p-4 sm:p-6
        // shadow-2xl
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.25,
        shadowRadius: 50,
        elevation: 20,
        marginHorizontal: 8, // center with some margin
    },
    searchInputContainer: {
        marginBottom: 16, // mb-4
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // bg-gray-100
        borderRadius: 16, // rounded-xl sm:rounded-2xl
        paddingHorizontal: 16, // px-4
        paddingVertical: 14, // py-3
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 15, // text-sm sm:text-base
        color: '#6B7280', // placeholder-gray-500
    },
    micButton: {
        padding: 8, // p-2
        borderRadius: 8,
    },
    aiSearchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // space-x-2
        paddingVertical: 14, // py-3 sm:py-4
        paddingHorizontal: 24,
        borderRadius: 16, // rounded-xl sm:rounded-2xl
        // hover:shadow-xl
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    aiSearchText: {
        fontSize: 17, // text-base sm:text-lg
        fontWeight: '600', // font-semibold
        color: '#FFFFFF',
    },
    subtext: {
        textAlign: 'center',
        color: '#6B7280', // text-gray-500
        fontSize: 13, // text-xs sm:text-sm
        marginTop: 14, // mt-3 sm:mt-4
        paddingHorizontal: 8, // px-2
    },
});
