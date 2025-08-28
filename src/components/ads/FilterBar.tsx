import { View, ScrollView, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
// import { classNameList, cityNameList } from "../../screens/ads/CreateAdScreen";

export const classNameList = {
  All: 'All',
  RealEstate: 'Real estate',
  Cars: 'Cars',
  Electronics: 'Electronics',
  Works: 'Works',
  Animals: 'Animals',
  Fashion: 'Fashion',
  Games: 'Games',
};

export const cityNameList = {
  All: 'All',
  Bagdad: 'Bagdad',
  Babil: 'Babil',
  Karbala: 'Karbala',
  Mosul: 'Mosul',
  Basra: 'Basra',
  Kirkuk: 'Kirkuk',
  Erbil: 'Erbil',
  Najaf: 'Najaf',
  Sulaymaniyah: 'Sulaymaniyah',
  Nasiriyah: 'Nasiriyah',
  Amarah: 'Amarah',
  Diwaniyah: 'Diwaniyah',
  Wasit: 'Wasit',
  Dohuk: 'Dohuk',
  Diyala: 'Diyala',
  AlAnbar: 'Al Anbar',
  Samawah: 'Samawah',
  Saladin: 'Saladin',
}

const typeNameList = {
  all: 'all',
  sale: 'sale',
  buy: 'buy',
}

export default function FilterBar() {
  const [className, setClassName] = useState('All');
  const [cityName, setCityName] = useState('All');
  const [typeName, setTypeName] = useState('all');

  const renderCalssNamePicker = () => {
    return (
      <Picker
        selectedValue={className}
        style={styles.list}
        onValueChange={(itemValue) => setClassName(itemValue)}
      >
        <Picker.Item label={classNameList.All} value={classNameList.All} />
        <Picker.Item label={classNameList.RealEstate} value={classNameList.RealEstate} />
        <Picker.Item label={classNameList.Animals} value={classNameList.Animals} />
        <Picker.Item label={classNameList.Electronics} value={classNameList.Electronics} />
        <Picker.Item label={classNameList.Fashion} value={classNameList.Fashion} />
        <Picker.Item label={classNameList.Games} value={classNameList.Games} />
        <Picker.Item label={classNameList.Works} value={classNameList.Works} />
        <Picker.Item label={classNameList.Cars} value={classNameList.Cars} />
      </Picker>
    );
  }

  const renderCityNamePicker = () => {
    return (
      <Picker
        selectedValue={cityName}
        style={styles.list}
        onValueChange={(itemValue) => setCityName(itemValue)}
      >
        <Picker.Item label={cityNameList.All} value={cityNameList.All} />
        <Picker.Item label={cityNameList.Bagdad} value={cityNameList.Bagdad} />
        <Picker.Item label={cityNameList.Babil} value={cityNameList.Babil} />
        <Picker.Item label={cityNameList.Karbala} value={cityNameList.Karbala} />
        <Picker.Item label={cityNameList.AlAnbar} value={cityNameList.AlAnbar} />
        <Picker.Item label={cityNameList.Amarah} value={cityNameList.Amarah} />
        <Picker.Item label={cityNameList.Basra} value={cityNameList.Basra} />
        <Picker.Item label={cityNameList.Diwaniyah} value={cityNameList.Diwaniyah} />
        <Picker.Item label={cityNameList.Diyala} value={cityNameList.Diyala} />
        <Picker.Item label={cityNameList.Dohuk} value={cityNameList.Dohuk} />
        <Picker.Item label={cityNameList.Erbil} value={cityNameList.Erbil} />
        <Picker.Item label={cityNameList.Kirkuk} value={cityNameList.Kirkuk} />
        <Picker.Item label={cityNameList.Mosul} value={cityNameList.Mosul} />
        <Picker.Item label={cityNameList.Najaf} value={cityNameList.Najaf} />
        <Picker.Item label={cityNameList.Nasiriyah} value={cityNameList.Nasiriyah} />
        <Picker.Item label={cityNameList.Saladin} value={cityNameList.Saladin} />
        <Picker.Item label={cityNameList.Samawah} value={cityNameList.Samawah} />
        <Picker.Item label={cityNameList.Sulaymaniyah} value={cityNameList.Sulaymaniyah} />
        <Picker.Item label={cityNameList.Wasit} value={cityNameList.Wasit} />
      </Picker>
    );
  }

  const renderTypeNamePicker = () => {
    return (
      <Picker
        selectedValue={typeName}
        style={styles.list}
        onValueChange={(itemValue) => setTypeName(itemValue)}
      >
        <Picker.Item label={typeNameList.all} value={typeNameList.all} />
        <Picker.Item label={typeNameList.sale} value={typeNameList.sale} />
        <Picker.Item label={typeNameList.buy} value={typeNameList.buy} />
      </Picker>
    );
  }

  return (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {renderCalssNamePicker()}
        {renderCityNamePicker()}
        {renderTypeNamePicker()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    marginVertical: 16,
  },
  filterScrollContent: {
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    minWidth: 80,
    
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
});
