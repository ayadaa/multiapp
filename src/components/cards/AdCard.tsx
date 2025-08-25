import React from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type { Ad } from '../../types/ads';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '../../types/navigation';
// import { formatTimestamp } from '../../hooks/ad/use-ads';

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export default function AdCard({ ad }: { ad: Ad }) {
    const navigation = useNavigation<NavigationProp>();

    const handleAdPress = (ad: Ad) => {
        navigation.navigate('AdDetails', ad);
    };

    //format time
    const formatTimestamp = React.useCallback((timestamp: any): string => {
        if (!timestamp) return '';

        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return date.toLocaleDateString();
    }, []);

    return (
        <TouchableOpacity
            style={recipeCardStyles.container}
            onPress={() => handleAdPress(ad)}
            activeOpacity={0.8}
        >
            <View style={recipeCardStyles.imageContainer}>
                <Image
                    source={{ uri: ad.adPicture }}
                    style={recipeCardStyles.image}
                    contentFit="cover"
                    transition={300}
                />
            </View>

            <View style={recipeCardStyles.content}>
                <Text style={recipeCardStyles.title} numberOfLines={2}>
                    {ad.title}
                </Text>
                {ad.description && (
                    <Text style={recipeCardStyles.description} numberOfLines={2}>
                        {ad.description}
                    </Text>
                )}

                <View style={recipeCardStyles.footer}>
                    {ad.createdAt && (
                        <View style={recipeCardStyles.timeContainer}>
                            <Ionicons name="time-outline" size={14} color={"#9A8478"} />
                            <Text style={recipeCardStyles.timeText}>{formatTimestamp(ad.createdAt)}</Text>
                        </View>
                    )}
                    {true && (
                        <View style={recipeCardStyles.priceContainer}>
                            <Ionicons name="people-outline" size={14} color={"#9A8478"} />
                            <Text style={recipeCardStyles.priceText}>{'15000 د.ع'}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const recipeCardStyles = StyleSheet.create({
    container: {
        width: cardWidth,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: "hidden",
    },
    imageContainer: {
        position: "relative",
        height: 140,
    },
    image: {
        width: "100%",
        height: "100%",
        backgroundColor: "#E5D3B7",
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
        color: "#4A3428",
        marginBottom: 4,
        lineHeight: 20,
    },
    description: {
        fontSize: 12,
        color: "#9A8478",
        marginBottom: 8,
        lineHeight: 16,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: {
        fontSize: 11,
        color: "#9A8478",
        marginLeft: 4,
        fontWeight: "500",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    priceText: {
        fontSize: 11,
        color: "#9A8478",
        marginLeft: 4,
        fontWeight: "500",
    },
});