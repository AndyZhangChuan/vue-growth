import init from '../lib/qqmap'

export const getLocation = () => {
  init();
  const qq = window.qq;
  const geo = new qq.maps.Geolocation('KMCBZ-4DF66-FFAS4-MDWJA-XJ7B3-3YBVI', 'dada-track');

  return new Promise((resolve, reject) => {
    geo.getLocation(position => {
      resolve({
        lng: position.lng,
        lat: position.lat,
        ad_code: position.adcode,
        city_name: position.city
      });
    }, () => {
      reject()
    }, {
      timeout: 8000
    })
  })
};

