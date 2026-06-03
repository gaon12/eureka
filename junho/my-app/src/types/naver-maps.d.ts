export {};

declare global {
  interface Window {
    naver: {
      maps: {
        LatLng: new (latitude: number | string, longitude: number | string) => NaverLatLng;
        Map: new (element: HTMLElement, options: NaverMapOptions) => NaverMap;
        Marker: new (options: NaverMarkerOptions) => NaverMarker;
        InfoWindow: new (options: NaverInfoWindowOptions) => NaverInfoWindow;
        Circle: new (options: NaverCircleOptions) => NaverCircle;
        Event: {
          addListener: (target: NaverMarker, eventName: "click", listener: () => void) => void;
        };
      };
    };
  }

  interface NaverLatLng {}
  interface NaverMap {}
  interface NaverCircle {}

  interface NaverMapOptions {
    center: NaverLatLng;
    zoom: number;
  }

  interface NaverMarkerOptions {
    position: NaverLatLng;
    map: NaverMap;
    title?: string;
  }

  interface NaverMarker {}

  interface NaverInfoWindowOptions {
    content: string;
  }

  interface NaverInfoWindow {
    getMap: () => NaverMap | null;
    close: () => void;
    open: (map: NaverMap, marker: NaverMarker) => void;
  }

  interface NaverCircleOptions {
    map: NaverMap;
    center: NaverLatLng;
    radius: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    fillOpacity: number;
  }
}
