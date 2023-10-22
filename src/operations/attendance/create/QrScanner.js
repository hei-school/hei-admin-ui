import { Html5QrcodeScanType, Html5QrcodeScanner } from "html5-qrcode"
import { qrcode, ScanStatus } from "./config"
import { styled } from "@mui/styles"

export const ScannerBox = styled('div')({
  width:'100%',
  marginTop:5,
  maxWidth:750,
  minHeight:400,
  borderColor:'transparent',
  backgroundColor:'rgba(0,0,0,.8)',
  '& button:not(#html5-qrcode-button-camera-permission, #html5-qrcode-button-camera-start), & img': { 
    display: 'none !important' 
  },
  '& #reader__dashboard_section': { padding: '0 !important' },
  '& #reader__dashboard_section_csr span:nth-of-type(1)':{display:'none !important'},
  '& #html5-qrcode-button-camera-permission,& #html5-qrcode-button-camera-start': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding:'7px 5px',
    border:'1px solid white',
    backgroundColor:'transparent',
    color:'white',
    cursor: 'pointer',
  }
})

export function createScanner(setInfo){
  const currentConfig = qrcode.getConfig()
  const config = {
    fps: currentConfig.fps,
    qrbox: { width: currentConfig.box, height: currentConfig.box},
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
    }, currentConfig.pause * 1000)
  }

  const onSuccess = data => {
    scanner.pause(false)
    setInfo({ status: ScanStatus.Success, data })
    typeof data === 'string' && qrcode.addAttendance(data)
    removeStatus()
  }
  
  const scanner = new Html5QrcodeScanner('reader', config, false)
  return {
    clear: ()=> scanner.clear(),
    render: ()=> scanner.render(onSuccess)
  }
}
