import { Html5QrcodeScanType, Html5QrcodeScanner } from "html5-qrcode"
import { qrcode, ScanStatus } from "./config"
import { styled } from "@mui/styles"

export const ScannerBox = styled('div')({
  width:'100%',
  marginTop:'5px',
  maxWidth:'750px',
  minHeight:'400px',
  borderColor:'transparent',
  backgroundColor:'rgba(0,0,0,.8)',
  '& button:not(#html5-qrcode-button-camera-permission), & img, & select': { display: 'none !important' },
  '& #reader__dashboard_section': { padding: '0 !important' },
  '& #html5-qrcode-button-camera-permission': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding:'7px 5px',
    border:'1px solid white',
    backgroundColor:'transparent',
    color:'rgba(0,0,0,.0)',
    cursor: 'pointer',
    '&::after': { 
      content:'\'Demander une permission\'',
      position:'absolute',
      display:'block',
      fontSize:'14px',
      color:'white',
      top: '50%',
      left:'50%',
      width:'100%',
      transform: 'translate(-50%, -50%)',
    }
  },
})

export function createScanner(setInfo){
  const { getConfig } = qrcode
  const config = {
    fps: getConfig().fps,
    qrbox: { width: getConfig().box, height: getConfig().box},
    rememberLastUsedCamera: true,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    videoConstraints:{
      facingMode:'environment'
    }
  }

  const removeStatus = () => {
    setTimeout(() => {
      setInfo({ status: ScanStatus.NoScan, data: ''})
      scanner.resume()
    }, getConfig().pause * 1000)
  }

  const onSuccess = data => {
    scanner.pause(false)
    setInfo({ status: ScanStatus.Success, data })
    typeof data === 'string' && qrcode.addAttendance(data)
    removeStatus()
  }
  
  const scanner = new Html5QrcodeScanner('reader',config, false)
  
  return {
    clear: ()=> scanner.clear(),
    render: ()=> scanner.render(onSuccess)
  }
}
