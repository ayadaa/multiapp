import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    FlatList,
    Dimensions,
    Image,
    RefreshControl
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
// import { type MiningSpeedOffers } from '../../services/firebase/wallet.service';
import { useWallet } from '../../hooks/wallet/use-wallet';
import { useAppSelector } from '../../store/hooks';
import { useUser } from '../../hooks/user/use-user';
import { Screen } from '../../components/common/Screen';

export default function MiningOffersScreen() {
    const user = useAppSelector((state) => state.auth.user);
    const { User, isLoadingUser, userError, refreshUser } = useUser(user?.uid || '');
    const { miningSpeedOffers, updateMiningSpeed, isLoadingMiningSpeedOffers, refreshMiningSpeedOffers } = useWallet(user?.uid || '');

    // Handle refresh
    const handleRefresh = async () => {
        try {
            await refreshMiningSpeedOffers();
        } catch (error) {
            console.error('Error refreshing mining speed offers:', error);
        }
    };

    return (
        <Screen backgroundColor="#FFFFFF" statusBarStyle="dark-content" keyboardAvoidingView={true}>
            <View style={styles.content}>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoadingMiningSpeedOffers}
                            onRefresh={handleRefresh}
                            tintColor="white"
                        />
                    }
                >
                    {miningSpeedOffers.length > 0 ? <View style={{ marginTop: 7 }}> {miningSpeedOffers.map((offer) => (
                        <TouchableOpacity
                            key={offer.id}
                            onPress={async () => {
                                await updateMiningSpeed(user?.uid!, offer.name);
                                refreshUser();
                            }}
                            disabled={(offer.price < User?.balance!) ? false : true}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                paddingVertical: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                marginHorizontal: 16,
                                marginVertical: 7,
                                borderRadius: 16,
                            }}
                        >
                            <View style={{
                                width: 70,
                                height: 25,
                                borderRadius: 10,
                                backgroundColor: 'rgba(0, 200, 100, 0.8)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 10,
                            }}>
                                <Text style={{
                                    color: 'black',
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>{offer.name}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 4,
                                }}>
                                    <Text style={{
                                        color: 'rgba(0, 0, 0, 1)',
                                        fontSize: 14,
                                    }}>
                                        price: {offer.price} 💎
                                    </Text>
                                    <Text style={{
                                        color: 'rgba(0, 0, 0, 1)',
                                        fontSize: 14,
                                    }}>
                                        speed: {offer.speed} 💎/day
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}</View> : <View>
                        <Text>Loading offers . . .</Text>
                    </View>}
                </ScrollView>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fff',
    },
});