import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import { View } from 'react-native';
  
  export const MenuScreen = ({onNewGameClick}) => (
    <View>
      <Menu>
        <MenuTrigger text={'⋮'} />
        <MenuOptions>
          <MenuOption onSelect={() => onNewGameClick()} text='New game' />
        </MenuOptions>
      </Menu>
    </View>
  );