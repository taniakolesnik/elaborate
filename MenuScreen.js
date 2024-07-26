import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import { StyleSheet, View } from 'react-native';

  export const MenuScreen = ({onNewGameClick}) => (
    <View>
      <Menu>
        <MenuTrigger text={'⋮'} />
        <MenuOptions>
          <MenuOption style={styles.menuItemStyle} onSelect={() => onNewGameClick()} text='New game' />
        </MenuOptions>
      </Menu>
    </View>
  );


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingTop: '5%',
      paddingBottom:'10%',
      backgroundColor: '#fff',
      justifyContent: 'center'
    },
    menuItemStyle: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
      justifyContent: 'center'
    }
    
  });
  
  