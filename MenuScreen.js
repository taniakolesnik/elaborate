import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import { StyleSheet, TextInput, Text, View } from 'react-native';
  
  export const MenuScreen = () => (
    <View>
      <Menu>
        <MenuTrigger text={'⋮'} />
        <MenuOptions>
          <MenuOption onSelect={() => alert(`Give up`)} text='Give Up' />
          <MenuOption onSelect={() => alert(`Delete`)} text='Delete' />
        </MenuOptions>
      </Menu>
    </View>
  );