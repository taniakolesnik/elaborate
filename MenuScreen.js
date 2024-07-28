import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger, MenuProvider
  } from 'react-native-popup-menu';
  import { StyleSheet, View, Alert, Text,} from 'react-native';

  export const MenuScreen = ({onNewGameClick, onShowRulesClick}) => (

    <View>
      <Menu>
        {/* <MenuTrigger style={{color: 'red'}} text={'⋮'} /> */}
      <MenuTrigger>
          <Text style={{fontSize : 30}}>  ⁝  </Text>
      </MenuTrigger>
        <MenuOptions>
          <MenuOption style={styles.menuItemStyle} onSelect={() => onNewGameClick()} text='Give up' />
          <MenuOption style={styles.menuItemStyle} onSelect={() => onShowRulesClick()} text='Rules' />
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
  
  