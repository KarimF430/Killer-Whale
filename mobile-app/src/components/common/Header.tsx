/**
 * MotorOctane Mobile App - Header Component
 * EXACT replica of web components/Header.tsx
 * 
 * Web specs:
 * - Height: h-16 (64px)
 * - Background: bg-white shadow-sm
 * - Logo: /motoroctane-logo.png + "MotorOctane" text
 * - Icons: Search, MapPin, Menu (h-5 w-5, gray-500)
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
    onSearchPress?: () => void;
    onLocationPress?: () => void;
    navigation?: any;
}

// Logo image from web public folder
const LOGO_URL = 'https://killerwhale-frontend.vercel.app/motoroctane-logo.png';

export default function Header({
    onSearchPress,
    onLocationPress,
    navigation
}: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Compare Cars', screen: 'Compare', icon: 'git-compare' as const },
        { label: 'EMI Calculator', screen: 'EMI', icon: 'percent' as const },
        { label: 'Car News', screen: 'News', icon: 'file-text' as const },
    ];

    return (
        <>
            {/* Header Bar */}
            <View style={styles.header}>
                {/* Logo - matching web exactly */}
                <TouchableOpacity
                    style={styles.logoContainer}
                    onPress={() => navigation?.navigate?.('Home')}
                    activeOpacity={0.8}
                >
                    <Image
                        source={require('../../../assets/motoroctane-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                        defaultSource={require('../../../assets/motoroctane-logo.png')}
                    />
                    <Text style={styles.logoText}>MotorOctane</Text>
                </TouchableOpacity>

                {/* Right Side Icons */}
                <View style={styles.iconsContainer}>
                    {/* Search - gray-500 */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onSearchPress}
                        activeOpacity={0.7}
                    >
                        <Feather name="search" size={22} color="#6B7280" />
                    </TouchableOpacity>

                    {/* Location - gray-500 */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onLocationPress}
                        activeOpacity={0.7}
                    >
                        <Feather name="map-pin" size={22} color="#6B7280" />
                    </TouchableOpacity>

                    {/* Menu - gray-500 */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setIsMenuOpen(true)}
                        activeOpacity={0.7}
                    >
                        <Feather name="menu" size={22} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Menu Modal */}
            <Modal
                visible={isMenuOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsMenuOpen(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsMenuOpen(false)}
                >
                    <View style={styles.menuContainer}>
                        <SafeAreaView>
                            {/* Menu Header */}
                            <View style={styles.menuHeader}>
                                <Text style={styles.menuTitle}>Menu</Text>
                                <TouchableOpacity
                                    onPress={() => setIsMenuOpen(false)}
                                    style={styles.closeButton}
                                >
                                    <Feather name="x" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>

                            {/* Menu Items */}
                            <ScrollView style={styles.menuItems}>
                                {menuItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.menuItem}
                                        onPress={() => {
                                            setIsMenuOpen(false);
                                            navigation?.navigate?.(item.screen);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Feather name={item.icon} size={20} color="#6B7280" style={styles.menuItemIcon} />
                                        <Text style={styles.menuItemLabel}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}

                                {/* Login Button */}
                                <TouchableOpacity
                                    style={styles.loginButtonContainer}
                                    onPress={() => {
                                        setIsMenuOpen(false);
                                        navigation?.navigate?.('Login');
                                    }}
                                    activeOpacity={0.9}
                                >
                                    <LinearGradient
                                        colors={['#DC2626', '#EA580C']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.loginButton}
                                    >
                                        <Text style={styles.loginButtonText}>Login</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </ScrollView>
                        </SafeAreaView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 64,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        // shadow-sm
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 40,
        height: 40,
    },
    logoText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginLeft: 8,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    iconButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    // Menu Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    closeButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
    },
    menuItems: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 4,
    },
    menuItemIcon: {
        marginRight: 12,
    },
    menuItemLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    loginButtonContainer: {
        marginTop: 12,
        marginBottom: 24,
    },
    loginButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
