import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
// import { Image } from "expo-image";
// import { homeStyles } from "../assets/styles/home.styles";
// import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export interface Categorie {
  id: number;
  name: string;
  icon: string;
}

export const categories = [
  {
    id: 1,
    name: 'All category',
    icon: 'square',
  },
  {
    id: 2,
    name: 'Real estate',
    // icon: 'apartment',
    icon: 'building',
  },
  {
    id: 3,
    name: 'Cars',
    // icon: 'directions-car',
    icon: 'car-side',
  },
  {
    id: 4,
    name: 'Works',
    // icon: 'business-center',
    icon: 'business-time',
  },
  {
    id: 5,
    name: 'Animals',
    icon: 'cat',
  },
  {
    id: 6,
    name: 'Electronics',
    // icon: 'laptop',
    icon: 'laptop-file',
  },
  {
    id: 7,
    name: 'Fashion',
    // icon: 'shopping-bag',
    icon: 'person-dress',
  },
  {
    id: 8,
    name: 'Games',
    // icon: 'videogame-asset',
    icon: 'gamepad',
  }
]

// export const categories0 = [
//   {
//     id: 1,
//     name: 'Tiny homes',
//     icon: 'home',
//   },
//   {
//     id: 2,
//     name: 'Cabins',
//     icon: 'house-siding',
//   },
//   {
//     id: 3,
//     name: 'Trending',
//     icon: 'local-fire-department',
//   },
//   {
//     id: 4,
//     name: 'Play',
//     icon: 'videogame-asset',
//   },
//   {
//     id: 5,
//     name: 'City',
//     icon: 'apartment',
//   },
//   {
//     id: 6,
//     name: 'Beachfront',
//     icon: 'beach-access',
//   },
//   {
//     id: 7,
//     name: 'Countryside',
//     icon: 'nature-people',
//   },
// ];

export default function CategoryFilter(
  { categories, selectedCategory, onSelectCategory }:
    { categories: Categorie[]; selectedCategory: string; onSelectCategory: any }
) {
  return (
    <View style={styles.categoryFilterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryFilterScrollContent}
      >
        {categories.map((category: Categorie) => {
          const isSelected = selectedCategory === category.name;
          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryButton, isSelected && styles.selectedCategory]}
              onPress={() => onSelectCategory(category.name)}
              activeOpacity={0.7}
            >
              {/* <Image
                source={{ uri: category.image }}
                style={[styles.categoryImage, isSelected && styles.selectedCategoryImage]}
                contentFit="cover"
                transition={300}
              /> */}
              {/* <MaterialIcons */}
              <FontAwesome6
                name={category.icon as any}
                size={24}
                color={isSelected ? '#000' : '#5E5D5E'}
              />
              <Text
                style={[styles.categoryText, isSelected && styles.selectedCategoryText]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// const COLORS = {
//   primary: "#8B593E",
//   background: "#FFF8F3",
//   text: "#4A3428",
//   border: "#E5D3B7",
//   white: "#FFFFFF",
//   textLight: "#9A8478",
//   card: "#FFFFFF",
//   shadow: "#000000",
// }

const styles = StyleSheet.create({
  categoryFilterContainer: {
    marginVertical: 16,
  },
  categoryFilterScrollContent: {
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    minWidth: 80,
  },
  selectedCategory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  // categoryImage: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   marginBottom: 4,
  //   backgroundColor: COLORS.border,
  // },
  // selectedCategoryImage: {
  //   borderWidth: 2,
  //   borderColor: COLORS.white,
  // },
  categoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: '#5E5D5E',
    textAlign: "center",
  },

  selectedCategoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: '#000',
    textAlign: "center",
  },
});
