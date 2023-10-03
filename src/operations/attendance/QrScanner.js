import { Html5QrcodeScanType, Html5QrcodeScanner } from "html5-qrcode"
import { SCAN_STATUS, getQrConfig } from "./utils"
import { styled } from "@mui/styles"

export const ScannerBox = styled('div')({
  width:'100%',
  maxWidth:'700px',
  minHeight:'400px',
  borderColor:'transparent',
  backgroundColor:'rgba(0,0,0,.8)',
  '& button:not(#html5-qrcode-button-camera-permission), & img': { display: 'none !important' },
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
  }
})

function createScannerBox(scanInfo, setScanInfo) {
  const removeStatus = () => {
    setTimeout(() => {
      setScanInfo({ ...scanInfo, status: SCAN_STATUS.NO_SCAN })
      scanner.resume()
    }, getQrConfig().pauseDelay * 1000)
  }

  const scanSuccess = data => {
    scanner.pause(false)
    setScanInfo({ status: SCAN_STATUS.SUCCESS, data })
    removeStatus()
  }

  const config = {
    fps: getQrConfig().fps,
    qrbox: { width: getQrConfig().boxSize, height: getQrConfig().boxSize },
    rememberLastUsedCamera: true,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
  }

  const scanner = new Html5QrcodeScanner('reader', config, false)
  scanner.render(scanSuccess)
}

export default createScannerBox;