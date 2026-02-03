import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#020617',alignItems:'center',justifyContent:'center'},
  title:{fontSize:26,fontWeight:'bold',color:'#fff'},
  bigBoard:{width:330,height:330,flexDirection:'row',flexWrap:'wrap',borderWidth:4,borderColor:'#f8fafc'},
  smallBoard:{width:'33.33%',height:'33.33%',borderWidth:3,borderColor:'#f8fafc',flexDirection:'row',flexWrap:'wrap'},
  cell:{width:'33.33%',height:'33.33%',borderWidth:1.5,borderColor:'#94a3b8',alignItems:'center',justifyContent:'center'},
  cellText:{fontSize:26,fontWeight:'bold'},
  xColor:{color:'#22d3ee'},
  oColor:{color:'#facc15'},
  disabledBoard:{opacity:0.5},
  winLine:{position:'absolute',backgroundColor:'red'},
  lineH1:{top:'16%',left:0,right:0,height:4},
  lineH2:{top:'50%',left:0,right:0,height:4},
  lineH3:{top:'83%',left:0,right:0,height:4},
  lineV1:{left:'16%',top:0,bottom:0,width:4},
  lineV2:{left:'50%',top:0,bottom:0,width:4},
  lineV3:{left:'83%',top:0,bottom:0,width:4},
  lineD1:{left:'-20%',top:'50%',width:'140%',height:4,transform:[{rotate:'45deg'}]},
  lineD2:{left:'-20%',top:'50%',width:'140%',height:4,transform:[{rotate:'-45deg'}]},
  bigWinLine:{position:'absolute',backgroundColor:'red'},
  buttons:{flexDirection:'row',marginTop:12,gap:10},
  undoButton:{backgroundColor:'#64748b',padding:12,borderRadius:8},
  resetButton:{backgroundColor:'#ef4444',padding:12,borderRadius:8},
  modeBtn:{backgroundColor:'#334155',padding:10,borderRadius:8},
  buttonText:{color:'#fff',fontWeight:'bold'}
});
