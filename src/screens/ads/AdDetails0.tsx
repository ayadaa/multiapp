// import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, ScrollView } from 'react-native';
import listingsData from './airbnb-listings.json';
import { Ionicons } from '@expo/vector-icons';
import Colors from './AdDetailsColors';
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { defaultStyles } from './AdDetailsStyle';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

export default function AdDetails() {
  // const { id } = useLocalSearchParams();
  // const id = "17511145"
  // const listing = (listingsData as any[]).find((item) => item.id === id);
  const listing = (listingsData as any[])[0]
  // const navigation = useNavigation();
  // const scrollRef = useAnimatedRef<Animated.ScrollView>();

  // const shareListing = async () => {
  //   try {
  //     await Share.share({
  //       title: listing.name,
  //       url: listing.listing_url,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: '',
  //     headerTransparent: true,

  //     headerBackground: () => (
  //       <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
  //     ),
  //     headerRight: () => (
  //       <View style={styles.bar}>
  //         <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
  //           <Ionicons name="share-outline" size={22} color={'#000'} />
  //         </TouchableOpacity>
  //         <TouchableOpacity style={styles.roundButton}>
  //           <Ionicons name="heart-outline" size={22} color={'#000'} />
  //         </TouchableOpacity>
  //       </View>
  //     ),
  //     headerLeft: () => (
  //       <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
  //         <Ionicons name="chevron-back" size={24} color={'#000'} />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, []);

  // const scrollOffset = useScrollViewOffset(scrollRef);

  // const imageAnimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         translateY: interpolate(
  //           scrollOffset.value,
  //           [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
  //           [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
  //         ),
  //       },
  //       {
  //         scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
  //       },
  //     ],
  //   };
  // });

  // const headerAnimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      {/* <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <Animated.Image
          source={{ uri: listing.xl_picture_url }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        /> */}
        <Image
          source={{ uri: listing.xl_picture_url }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing.name}</Text>
          <Text style={styles.location}>
            {listing.room_type} in {listing.smart_location}
          </Text>
          <Text style={styles.rooms}>
            {listing.guests_included} guests · {listing.bedrooms} bedrooms · {listing.beds} bed ·{' '}
            {listing.bathrooms} bathrooms
          </Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {listing.review_scores_rating / 20} · {listing.number_of_reviews} reviews
            </Text>
          </View>
          {/* <View> */}
          <Text style={styles.footerPrice}>€{listing.price}</Text>
          {/* </View> */}
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image source={{ uri: listing.host_picture_url }} style={styles.host} />

            <View>
              <Text style={{ fontWeight: '500', fontSize: 16 }}>Hosted by {listing.host_name}</Text>
              <Text>Host since {listing.host_since}</Text>
            </View>

            <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
              <Text style={defaultStyles.btnText}>Reserve</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{listing.description}</Text>
        </View>
      </ScrollView>
      {/* </Animated.ScrollView> */}

      {/* <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}> */}
        {/* <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>€{listing.price}</Text>
            <Text>night</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
            <Text style={defaultStyles.btnText}>Reserve</Text>
          </TouchableOpacity>
        </View> */}
      {/* </Animated.View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'mon-sb',
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
    fontFamily: 'mon',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'mon',
  },
});







// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function AdDetails() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to My App!</Text>
//       <Text style={styles.subtitle}>This is your first React Native page.</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0', // Light gray background
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333', // Dark gray text
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666', // Medium gray text
//   },
// });




// // import { useLocalSearchParams, useNavigation } from 'expo-router';
// import { useNavigation } from '@react-navigation/native';
// import React, { useLayoutEffect } from 'react';
// import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share } from 'react-native';
// import listingsData from './airbnb-listings.json';
// import { Ionicons } from '@expo/vector-icons';
// import Colors from './AdDetailsColors';
// import Animated, {
//   SlideInDown,
//   interpolate,
//   useAnimatedRef,
//   useAnimatedStyle,
//   useScrollViewOffset,
// } from 'react-native-reanimated';
// import { defaultStyles } from './AdDetailsStyle';

// const { width } = Dimensions.get('window');
// const IMG_HEIGHT = 300;

// export default function AdDetails() {
// //   const { id } = useLocalSearchParams();
//   const id = 1563562
//   const listing = (listingsData as any[]).find((item) => item.id === id);
//   const navigation = useNavigation();
//   const scrollRef = useAnimatedRef<Animated.ScrollView>();

//   const shareListing = async () => {
//     try {
//       await Share.share({
//         title: listing.name,
//         url: listing.listing_url,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: '',
//       headerTransparent: true,

//       headerBackground: () => (
//         <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
//       ),
//       headerRight: () => (
//         <View style={styles.bar}>
//           <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
//             <Ionicons name="share-outline" size={22} color={'#000'} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.roundButton}>
//             <Ionicons name="heart-outline" size={22} color={'#000'} />
//           </TouchableOpacity>
//         </View>
//       ),
//       headerLeft: () => (
//         <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={24} color={'#000'} />
//         </TouchableOpacity>
//       ),
//     });
//   }, []);

//   const scrollOffset = useScrollViewOffset(scrollRef);

//   const imageAnimatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           translateY: interpolate(
//             scrollOffset.value,
//             [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
//             [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
//           ),
//         },
//         {
//           scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
//         },
//       ],
//     };
//   });

//   const headerAnimatedStyle = useAnimatedStyle(() => {
//     return {
//       opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Animated.ScrollView
//         contentContainerStyle={{ paddingBottom: 100 }}
//         ref={scrollRef}
//         scrollEventThrottle={16}>
//         <Animated.Image
//           source={{ uri: listing.xl_picture_url }}
//           style={[styles.image, imageAnimatedStyle]}
//           resizeMode="cover"
//         />

//         <View style={styles.infoContainer}>
//           <Text style={styles.name}>{listing.name}</Text>
//           <Text style={styles.location}>
//             {listing.room_type} in {listing.smart_location}
//           </Text>
//           <Text style={styles.rooms}>
//             {listing.guests_included} guests · {listing.bedrooms} bedrooms · {listing.beds} bed ·{' '}
//             {listing.bathrooms} bathrooms
//           </Text>
//           <View style={{ flexDirection: 'row', gap: 4 }}>
//             <Ionicons name="star" size={16} />
//             <Text style={styles.ratings}>
//               {listing.review_scores_rating / 20} · {listing.number_of_reviews} reviews
//             </Text>
//           </View>
//           <View style={styles.divider} />

//           <View style={styles.hostView}>
//             <Image source={{ uri: listing.host_picture_url }} style={styles.host} />

//             <View>
//               <Text style={{ fontWeight: '500', fontSize: 16 }}>Hosted by {listing.host_name}</Text>
//               <Text>Host since {listing.host_since}</Text>
//             </View>
//           </View>

//           <View style={styles.divider} />

//           <Text style={styles.description}>{listing.description}</Text>
//         </View>
//       </Animated.ScrollView>

//       <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
//         <View
//           style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//           <TouchableOpacity style={styles.footerText}>
//             <Text style={styles.footerPrice}>€{listing.price}</Text>
//             <Text>night</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
//             <Text style={defaultStyles.btnText}>Reserve</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   image: {
//     height: IMG_HEIGHT,
//     width: width,
//   },
//   infoContainer: {
//     padding: 24,
//     backgroundColor: '#fff',
//   },
//   name: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     fontFamily: 'mon-sb',
//   },
//   location: {
//     fontSize: 18,
//     marginTop: 10,
//     fontFamily: 'mon-sb',
//   },
//   rooms: {
//     fontSize: 16,
//     color: Colors.grey,
//     marginVertical: 4,
//     fontFamily: 'mon',
//   },
//   ratings: {
//     fontSize: 16,
//     fontFamily: 'mon-sb',
//   },
//   divider: {
//     height: StyleSheet.hairlineWidth,
//     backgroundColor: Colors.grey,
//     marginVertical: 16,
//   },
//   host: {
//     width: 50,
//     height: 50,
//     borderRadius: 50,
//     backgroundColor: Colors.grey,
//   },
//   hostView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   footerText: {
//     height: '100%',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   footerPrice: {
//     fontSize: 18,
//     fontFamily: 'mon-sb',
//   },
//   roundButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 50,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: Colors.primary,
//   },
//   bar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 10,
//   },
//   header: {
//     backgroundColor: '#fff',
//     height: 100,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: Colors.grey,
//   },

//   description: {
//     fontSize: 16,
//     marginTop: 10,
//     fontFamily: 'mon',
//   },
// });