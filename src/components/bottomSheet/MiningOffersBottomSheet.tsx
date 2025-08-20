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

interface MiningOffersBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    snapPoints: string[];
    // showBottomSheet: () => void;
    // miningSpeedOffers: MiningSpeedOffers[];
}

export default function MiningOffersBottomSheet({ bottomSheetRef, snapPoints }: MiningOffersBottomSheetProps) {
    // const bottomSheetRef = React.useRef<BottomSheet>(null);
    // const snapPoints = React.useMemo(() => ["25%", "50%", "75%"], []);

    // const showBottomSheet = React.useCallback(() => {
    //     bottomSheetRef.current?.expand();
    // }, []);
    const user = useAppSelector((state) => state.auth.user);
    const { miningSpeedOffers, updateMiningSpeed, isLoadingMiningSpeedOffers, refreshMiningSpeedOffers } = useWallet();

    const renderBackdrop = React.useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1} // Hides backdrop when sheet is fully closed
                appearsOnIndex={0}    // Shows backdrop when sheet is at index 0 or higher
                pressBehavior="close" // Closes the bottom sheet when backdrop is pressed
            />
        ),
        []
    );

    const handleSheetChanges = React.useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

    // Handle refresh
    const handleRefresh = async () => {
        try {
            await refreshMiningSpeedOffers();
        } catch (error) {
            console.error('Error refreshing mining speed offers:', error);
        }
    };

    // setTimeout(() => {
    //     handleRefresh();
    // }, 1000);

    return (
        <BottomSheet
            snapPoints={snapPoints}
            index={-1}
            backdropComponent={renderBackdrop}
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
        >
            <BottomSheetView style={{
                flex: 1,
            }}>
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
                    {miningSpeedOffers.map((offer) => (
                        <TouchableOpacity
                            key={offer.id}
                            onPress={async () => await updateMiningSpeed(user?.uid!, offer.name)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                paddingVertical: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                            }}
                        >
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
                                        {offer.name}
                                    </Text>
                                    <Text style={{
                                        color: 'rgba(0, 0, 0, 0.75)',
                                        fontSize: 12,
                                    }}>
                                        {offer.price}
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
                                        {offer.speed}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </BottomSheetView>
        </BottomSheet>
    );
}
