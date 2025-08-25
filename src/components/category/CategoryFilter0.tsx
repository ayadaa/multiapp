import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
// import { Image } from "expo-image";
// import { homeStyles } from "../assets/styles/home.styles";
import { MaterialIcons } from '@expo/vector-icons';

export const categories = [
  {
    id: 1,
    name: 'Tiny homes',
    icon: 'home',
  },
  {
    id: 2,
    name: 'Cabins',
    icon: 'house-siding',
  },
  {
    id: 3,
    name: 'Trending',
    icon: 'local-fire-department',
  },
  {
    id: 4,
    name: 'Play',
    icon: 'videogame-asset',
  },
  {
    id: 5,
    name: 'City',
    icon: 'apartment',
  },
  {
    id: 6,
    name: 'Beachfront',
    icon: 'beach-access',
  },
  {
    id: 7,
    name: 'Countryside',
    icon: 'nature-people',
  },
];

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: any) {
  return (
    <View style={styles.categoryFilterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryFilterScrollContent}
      >
        {categories.map((category: any) => {
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
              <MaterialIcons
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

const COLORS = {
  primary: "#8B593E",
  background: "#FFF8F3",
  text: "#4A3428",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#9A8478",
  card: "#FFFFFF",
  shadow: "#000000",
}

const styles = StyleSheet.create({
  categoryFilterContainer: {
    marginVertical: 16,
  },
  categoryFilterScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowOpacity: 0.15,
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
    backgroundColor: COLORS.border,
  },
  selectedCategoryImage: {
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
});
