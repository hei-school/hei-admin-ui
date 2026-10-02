// A webcam filming a QR code, for the badge scanner: the browser of the tests has no camera.
// The QR code images are fixtures generated with zxing, like the QR codes of the printed badges.

export type FakeCamera = {
  show: (fixture: string) => Cypress.Chainable;
  stopTrack: () => void;
  unplug: () => void;
};

const WIDTH = 640;
const HEIGHT = 480;
const QR_SIZE = 300;
const FRAME_INTERVAL_MS = 100;

export const installFakeCamera = (win: Cypress.AUTWindow): FakeCamera => {
  const canvas = win.document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d")!;
  let image: HTMLImageElement | null = null;
  const draw = () => {
    context.fillStyle = "white";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    if (image) {
      context.drawImage(
        image,
        (WIDTH - QR_SIZE) / 2,
        (HEIGHT - QR_SIZE) / 2,
        QR_SIZE,
        QR_SIZE
      );
    }
  };
  // a canvas stream only sends a frame when the canvas is painted
  win.setInterval(draw, FRAME_INTERVAL_MS);

  const streams: MediaStream[] = [];
  let isUnplugged = false;
  cy.stub(win.navigator.mediaDevices, "getUserMedia").callsFake(() => {
    if (isUnplugged) {
      return Promise.reject(new DOMException("unplugged", "NotFoundError"));
    }
    const stream = canvas.captureStream(1000 / FRAME_INTERVAL_MS);
    streams.push(stream);
    return Promise.resolve(stream);
  });
  cy.stub(win.navigator.mediaDevices, "enumerateDevices").resolves([
    {deviceId: "front", groupId: "", kind: "videoinput", label: "Front"},
    {deviceId: "back", groupId: "", kind: "videoinput", label: "Back"},
  ]);

  return {
    show: (fixture) =>
      cy.fixture(fixture, "base64").then((base64: string) => {
        const next = new win.Image();
        next.onload = () => {
          image = next;
        };
        next.src = `data:image/png;base64,${base64}`;
      }),
    stopTrack: () =>
      streams
        .at(-1)
        ?.getVideoTracks()
        .forEach((track) => track.dispatchEvent(new Event("ended"))),
    unplug: () => {
      isUnplugged = true;
    },
  };
};
