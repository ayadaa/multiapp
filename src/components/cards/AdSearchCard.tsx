import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import type { Ad } from '../../types/ads';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '../../types/navigation';

export default function AdSearchCard({ ad }: { ad: Ad }) {
    const navigation = useNavigation<NavigationProp>();

    //handle add press
    const handleAdPress = (ad: Ad) => {
        navigation.navigate('AdDetails', ad);
    }

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
            key={ad.id}
            onPress={() => handleAdPress(ad)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.1)',

                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                marginHorizontal: 16,
                marginVertical: 2,
                borderRadius: 16,
            }}
        >
            {ad.adPicture ? <View style={{
                width: 50,
                height: 50,
                // borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
            }}>
                <Image
                    source={{ uri: ad.adPicture }}
                    style={{
                        height: 64,
                        width: 64,
                    }}
                    resizeMode="cover"
                />
            </View> : <View style={{
                width: 50,
                height: 50,
                // borderRadius: 25,
                backgroundColor: 'rgba(0, 132, 255, 0.8)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
            }}>
                <Text style={{ fontSize: 18, color: '#000000' }}>
                    {ad.title.charAt(0).toUpperCase() || '?'}
                </Text>
            </View>}

            <View style={{ flex: 1 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                }}>
                    <Text style={{
                        color: '#000000',
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}>
                        {ad.title}
                    </Text>
                    <Text style={{
                        color: 'rgba(0, 0, 0, 0.75)',
                        fontSize: 12,
                    }}>
                        {ad.createdAt ? formatTimestamp(ad.createdAt) : ''}
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        color: 'rgba(0, 0, 0, 0.7)',
                        fontSize: 14,
                        flex: 1,
                    }} numberOfLines={1}>
                        {ad.description.slice(0, 50)} {/* 50 characters */}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
