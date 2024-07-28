import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger, MenuProvider
  } from 'react-native-popup-menu';
  import { StyleSheet, View, Alert, Text} from 'react-native';

  const howToPlayAlert = () => {
    Alert.alert("how to play", "secret word is 5 letter word." 
      + "Submit a guess 5 letter word to get the most common words between your guess and secret word. Until you find a secret word" 
      + "Unlimited hints. "
      + "You can play new game if you want to give up. Secret word will be revealed to you ")
  }

  export const MenuScreen = ({onNewGameClick}) => (


    <View>
      <Menu>
        {/* <MenuTrigger style={{color: 'red'}} text={'⋮'} /> */}
      <MenuTrigger>
          <Text style={{fontSize : 30}}>  ⁝  </Text>
      </MenuTrigger>
        <MenuOptions>
          <MenuOption style={styles.menuItemStyle} onSelect={() => onNewGameClick()} text='Give up' />
          <MenuOption style={styles.menuItemStyle} onSelect={() => howToPlayAlert()} text='Rules' />
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
  
  