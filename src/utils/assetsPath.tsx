import tataPlay from '../assets/svgs/tataplay.svg';
import cross from '../assets/svgs/cross.svg';
import checked from '../assets/svgs/checked.svg';
import unchecked from '../assets/svgs/unchecked.svg';
import language from '../assets/svgs/language.svg';
import tick from '../assets/svgs/tick.svg';
import radio from '../assets/svgs/radio.svg';
import radioSelected from '../assets/svgs/radioSelected.svg';
import menu from '../assets/svgs/menu.svg';
import menuNotification from '../assets/svgs/menuNotification.svg';
import selectedProfile from '../assets/svgs/selectedProfile.svg';
import edit from '../assets/svgs/edit.svg';
import kids from '../assets/svgs/kids.svg';
import androidBack from '../assets/svgs/androidBack.svg';
import iosBack from '../assets/svgs/iosBack.svg';
import plus from '../assets/svgs/plus.svg';
import profile from '../assets/svgs/profile.svg';
import changePicture from '../assets/svgs/changePicture.svg';
import downArrow from '../assets/svgs/downArrow.svg';
import deleteIcon from '../assets/svgs/delete.svg';
import allDevices from '../assets/svgs/allDevices.svg';
import deleteCircle from '../assets/svgs/deleteCircle.svg';
import editCircle from '../assets/svgs/editCircle.svg';
import mobile from '../assets/svgs/mobile.svg';
import fireTv from '../assets/svgs/fireTv.svg';
import tablet from '../assets/svgs/tablet.svg';
import web from '../assets/svgs/web.svg';
import home from '../assets/svgs/home.svg';
import liveTv from '../assets/svgs/liveTv.svg';
import onDemand from '../assets/svgs/onDemand.svg';
import watchlist from '../assets/svgs/watchlist.svg';
import tvGuide from '../assets/svgs/tvGuide.svg';
import homeSelected from '../assets/svgs/homeSelected.svg';
import liveTvSelected from '../assets/svgs/liveTvSelected.svg';
import onDemandSelected from '../assets/svgs/onDemandSelected.svg';
import watchlistSelected from '../assets/svgs/watchListSelected.svg';
import tvGuideSelected from '../assets/svgs/tvGuideSelected.svg';
import appLogo from '../assets/svgs/appLogo.svg';
import chat from '../assets/svgs/chat.svg';
import chatSelected from '../assets/svgs/chatSelected.svg';
import image from '../assets/svgs/image.svg';
import imageGenerator from '../assets/svgs/imageGenerator.svg';
import speechToText from '../assets/svgs/speechToText.svg'
import textToSpeech from '../assets/svgs/textToSpeech.svg'
import lightMode from '../assets/svgs/lightMode.svg'
import darkMode from '../assets/svgs/darkMode.svg'


export const upArrow = (props: any) => {
  return (
    <SVGS.downArrow
      {...props}
      style={[{transform: [{rotate: '180deg'}]}, props.style]}
    />
  )
}


export const rightArrow = (props: any) => {
  return (
    <SVGS.downArrow
      {...props}
      style={[{transform: [{rotate: '90deg'}]}, props.style]}
    />
  )
}

export const leftArrow = (props: any) => {
  return (
    <SVGS.downArrow
      {...props}
      style={[{transform: [{rotate: '-90deg'}]}, props.style]}
    />
  )
}


export const SVGS = {
  tataPlay: tataPlay,
  home: home,
  cross: cross,
  checked: checked,
  unchecked: unchecked,
  language: language,
  tick: tick,
  radio: radio,
  radioSelected: radioSelected,
  menu: menu,
  menuNotification: menuNotification,
  selectedProfile: selectedProfile,
  edit: edit,
  kids: kids,
  androidBack: androidBack,
  iosBack: iosBack,
  plus: plus,
  profile: profile,
  changePicture: changePicture,
  upArrow: upArrow,
  downArrow: downArrow,
  leftArrow: leftArrow,
  rightArrow: rightArrow,
  delete: deleteIcon,
  allDevices: allDevices,
  deleteCircle: deleteCircle,
  editCircle: editCircle,
  mobile: mobile,
  fireTv: fireTv,
  tablet: tablet,
  web: web,
  liveTv: liveTv,
  onDemand: onDemand,
  watchlist: watchlist,
  tvGuide: tvGuide,
  homeSelected: homeSelected,
  liveTvSelected: liveTvSelected,
  onDemandSelected: onDemandSelected,
  watchlistSelected: watchlistSelected,
  tvGuideSelected: tvGuideSelected,
  appLogo: appLogo,
  chat: chat,
  chatSelected: chatSelected,
  image: image,
  imageGenerator: imageGenerator,
  speechToText: speechToText,
  textToSpeech: textToSpeech,
  lightMode: lightMode,
  darkMode: darkMode
};



export const IMAGES = {
  placeholder: require('../assets/images/placeHolder.png'),
  transparent: require('../assets/images/logo.png'),
  appLogo: require('../assets/images/appLogo.png'),
};


export const VIDEOS = {
  splash: require('../assets/videos/splashCoco.mp4'),
};
