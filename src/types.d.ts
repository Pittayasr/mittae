declare namespace H {
  namespace map {
    class Marker {
      constructor(coordinates: H.geo.IPoint, options?: { draggable?: boolean });
      setGeometry(coordinates: H.geo.IPoint): void;
      getGeometry(): H.geo.IPoint;
      addEventListener(
        event: string,
        callback: (evt: H.util.Event) => void
      ): void;
    }
  }

  namespace geo {
    interface IPoint {
      lat: number;
      lng: number;
    }
  }

  namespace service {
    class Platform {
      constructor(options: { apikey: string });
      createDefaultLayers(): any;
      getGeocodingService(): GeocodingService;
    }

    interface GeocodingService {
      geocode(
        query: { searchText: string },
        onResult: (result: GeocodingResult) => void,
        onError: (error: any) => void
      ): void;
    }

    interface GeocodingResult {
      Response: {
        View: Array<{
          Result: Array<{
            Location: {
              DisplayPosition: {
                Latitude: number;
                Longitude: number;
              };
            };
          }>;
        }>;
      };
    }
  }

  namespace mapevents {
    class Behavior {
      constructor(events: MapEvents);
    }
    class MapEvents {
      constructor(map: H.Map);
    }
  }

  namespace ui {
    class UI {
      static createDefault(map: H.Map, layers: any): void;
    }
  }

  namespace util {
    interface Event {
      target: any;
    }
  }

  class Map {
    constructor(
      element: HTMLElement,
      defaultLayers: any,
      options: { center: H.geo.IPoint; zoom: number; pixelRatio?: number }
    );
    addObject(obj: any): void;
    dispose(): void;
    setCenter(coordinates: H.geo.IPoint): void;
    getCenter(): H.geo.IPoint;
  }
}
