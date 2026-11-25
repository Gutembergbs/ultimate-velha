import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    alignItems: 'center',
    justifyContent: 'center'
  },
  homeContent: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    paddingHorizontal: 24
  },
  homeContentWide: {
    maxWidth: 1080,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 64
  },
  homeIntro: {
    alignItems: 'center'
  },
  homeIntroWide: {
    flex: 1,
    alignItems: 'flex-start'
  },
  brandMark: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: '#12364A',
    borderWidth: 1,
    borderColor: '#1D6476',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  brandMarkText: {
    color: '#67E8F9',
    fontSize: 34,
    fontWeight: '800'
  },
  eyebrow: {
    color: '#67E8F9',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center'
  },
  homeTitleWide: {
    fontSize: 46,
    lineHeight: 54,
    textAlign: 'left'
  },
  subtitle: {
    color: '#A8B5C9',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 28
  },
  modeList: {
    width: '100%',
    gap: 12
  },
  modeListWide: {
    width: 320,
    flexShrink: 0
  },
  modeBtnWide: {
    width: '100%'
  },
  privacyLink: {
    alignItems: 'center',
    paddingVertical: 8
  },
  privacyLinkText: {
    color: '#67E8F9',
    fontSize: 13,
    textDecorationLine: 'underline'
  },
  gameContent: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  gameContentWide: {
    alignSelf: 'center',
    maxWidth: 1180
  },
  gameLayout: {
    width: '100%',
    alignItems: 'center'
  },
  gameLayoutWide: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32
  },
  gameBoardColumn: {
    alignItems: 'center',
    flexShrink: 0
  },
  gameInfoColumn: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center'
  },
  gameInfoColumnWide: {
    maxWidth: 360
  },
  gameTitle: {
    fontSize: 24,
    marginBottom: 4
  },
  statusCard: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    marginVertical: 12,
    alignItems: 'center',
    backgroundColor: '#151F33',
    borderWidth: 1,
    borderColor: '#24344D'
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#67E8F9',
    textAlign: 'center'
  },
  timerPanel: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#111A2C'
  },
  timerText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700'
  },
  timerControls: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },
  bigBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 3,
    borderColor: '#36506B',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0E1728'
  },
  smallBoard: {
    width: '33.3333%',
    height: '33.3333%',
    borderWidth: 1,
    borderColor: '#36506B',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#111B2F'
  },
  cell: {
    width: '33.3333%',
    height: '33.3333%',
    borderWidth: 0.5,
    borderColor: '#293B53',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellText: {
    fontSize: 26,
    fontWeight: '800'
  },
  xColor: { color: '#38BDF8' },
  oColor: { color: '#FBBF24' },
  disabledBoard: { opacity: 0.3 },
  winLine: {
    position: 'absolute',
    backgroundColor: '#F97316',
    borderRadius: 4
  },
  lineH1: { top: '16%', left: 0, right: 0, height: 3 },
  lineH2: { top: '50%', left: 0, right: 0, height: 3 },
  lineH3: { top: '83%', left: 0, right: 0, height: 3 },
  lineV1: { left: '16%', top: 0, bottom: 0, width: 3 },
  lineV2: { left: '50%', top: 0, bottom: 0, width: 3 },
  lineV3: { left: '83%', top: 0, bottom: 0, width: 3 },
  lineD1: {
    left: '-20%',
    top: '50%',
    width: '140%',
    height: 3,
    transform: [{ rotate: '45deg' }]
  },
  lineD2: {
    left: '-20%',
    top: '50%',
    width: '140%',
    height: 3,
    transform: [{ rotate: '-45deg' }]
  },
  bigWinLine: {
    position: 'absolute',
    backgroundColor: '#F97316',
    borderRadius: 4
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 10
  },
  buttonsWide: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%'
  },
  buttonWide: {
    width: '100%'
  },
  onlineContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  onlineContentWide: {
    alignSelf: 'center',
    maxWidth: 1240
  },
  onlineLayout: {
    width: '100%',
    alignItems: 'center',
    gap: 22
  },
  onlineLayoutWide: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32
  },
  onlineBoardColumn: {
    alignItems: 'center',
    flexShrink: 0
  },
  onlineInfoColumn: {
    width: '100%',
    maxWidth: 560,
    alignItems: 'center'
  },
  onlineInfoColumnWide: {
    maxWidth: 360
  },
  undoButton: {
    backgroundColor: '#26354B',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12
  },
  resetButton: {
    backgroundColor: '#BE4B3E',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12
  },
  modeBtn: {
    backgroundColor: '#18263B',
    borderWidth: 1,
    borderColor: '#2A3E59',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#087E8B',
    borderColor: '#1595A2'
  },
  buttonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 15
  }
});
