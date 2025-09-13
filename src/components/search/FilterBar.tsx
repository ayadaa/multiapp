import { View, ScrollView, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
// import { classNameList, cityNameList } from "../../screens/ads/CreateAdScreen";
import i18n from '../../language/i18n';

interface FilterBarProp {
  handleRefresh: (className?: string, cityName?: string, typeName?: string) => void;
  className: string;
  setClassName: (value: string) => void;
  cityName: string;
  setCityName: (value: string) => void;
  typeName: string;
  setTypeName: (value: string) => void;
}

export const classNameList = {
  All: 'All category',
  RealEstate: 'Real estate',
  Cars: 'Cars',
  Electronics: 'Electronics',
  Works: 'Works',
  Animals: 'Animals',
  Fashion: 'Fashion',
  Games: 'Games',
};

export const cityNameList = {
  All: 'All cities',
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
  all: 'All types',
  sale: 'sale',
  buy: 'buy',
}

export default function FilterBar({ handleRefresh, className, setClassName, cityName, setCityName, typeName, setTypeName }: FilterBarProp) {
  // const [className, setClassName] = useState('All category');
  // const [cityName, setCityName] = useState('All cities');
  // const [typeName, setTypeName] = useState('All types');

  const renderCalssNamePicker = () => {
    return (
      <Picker
        selectedValue={className}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setClassName(itemValue);
          handleRefresh(itemValue, cityName, typeName);
        }}
      >
        <Picker.Item label={i18n.t('allCategory')} value={classNameList.All} />
        <Picker.Item label={i18n.t('realEstate')} value={classNameList.RealEstate} />
        <Picker.Item label={i18n.t('animals')} value={classNameList.Animals} />
        <Picker.Item label={i18n.t('electronics')} value={classNameList.Electronics} />
        <Picker.Item label={i18n.t('fashion')} value={classNameList.Fashion} />
        <Picker.Item label={i18n.t('games')} value={classNameList.Games} />
        <Picker.Item label={i18n.t('works')} value={classNameList.Works} />
        <Picker.Item label={i18n.t('cars')} value={classNameList.Cars} />
      </Picker>
    );
  }

  const renderCityNamePicker = () => {
    return (
      <Picker
        selectedValue={cityName}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setCityName(itemValue);
          handleRefresh(className, itemValue, typeName);
        }}
      >
        <Picker.Item label={i18n.t('allCities')} value={cityNameList.All} />
        <Picker.Item label={i18n.t('Bagdad')} value={cityNameList.Bagdad} />
        <Picker.Item label={i18n.t('Babil')} value={cityNameList.Babil} />
        <Picker.Item label={i18n.t('Karbala')} value={cityNameList.Karbala} />
        <Picker.Item label={i18n.t('AlAnbar')} value={cityNameList.AlAnbar} />
        <Picker.Item label={i18n.t('Amarah')} value={cityNameList.Amarah} />
        <Picker.Item label={i18n.t('Basra')} value={cityNameList.Basra} />
        <Picker.Item label={i18n.t('Diwaniyah')} value={cityNameList.Diwaniyah} />
        <Picker.Item label={i18n.t('Diyala')} value={cityNameList.Diyala} />
        <Picker.Item label={i18n.t('Dohuk')} value={cityNameList.Dohuk} />
        <Picker.Item label={i18n.t('Erbil')} value={cityNameList.Erbil} />
        <Picker.Item label={i18n.t('Kirkuk')} value={cityNameList.Kirkuk} />
        <Picker.Item label={i18n.t('Mosul')} value={cityNameList.Mosul} />
        <Picker.Item label={i18n.t('Najaf')} value={cityNameList.Najaf} />
        <Picker.Item label={i18n.t('Nasiriyah')} value={cityNameList.Nasiriyah} />
        <Picker.Item label={i18n.t('Saladin')} value={cityNameList.Saladin} />
        <Picker.Item label={i18n.t('Samawah')} value={cityNameList.Samawah} />
        <Picker.Item label={i18n.t('Sulaymaniyah')} value={cityNameList.Sulaymaniyah} />
        <Picker.Item label={i18n.t('Wasit')} value={cityNameList.Wasit} />
      </Picker>
    );
  }

  const renderTypeNamePicker = () => {
    return (
      <Picker
        selectedValue={typeName}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setTypeName(itemValue);
          handleRefresh(className, cityName, itemValue);
        }}
      >
        <Picker.Item label={i18n.t('allTypes')} value={typeNameList.all} />
        <Picker.Item label={i18n.t('sale')} value={typeNameList.sale} />
        <Picker.Item label={i18n.t('buy')} value={typeNameList.buy} />
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
        <View style={styles.pickerContainer}>{renderCalssNamePicker()}</View>
        <View style={styles.pickerContainer}>{renderCityNamePicker()}</View>
        <View style={styles.pickerContainer}>{renderTypeNamePicker()}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    marginVertical: 8,
  },
  filterScrollContent: {
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    minWidth: 120,
    // height: 60,
    borderRadius: 12,
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  picker: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: 2,
    // minWidth: 80,
    // height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    fontSize: 12,
    color: '#000000',
  },
});
