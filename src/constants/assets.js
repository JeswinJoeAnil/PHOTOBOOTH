export const asset = (name) => new URL(`../assets/${name}`, import.meta.url).href;

export const ASSETS = {
  scrapbook: asset('XLuTGjgtwjWtugfWBkwiLVHNF71_iX5xma4L6mxdq-VImioPV2fqq4TAkvueyEqg1IiNDI35_HvKV8KjpR__xK8UhB74W3ut-1GHsNKK_jjzet8cIi0KKKpYMK6JwdUllaTIG5MwrWg6y-XIFC-9moOd-NQkY-OGnp_zsu63kdSsIdoJ7u7KZ_dzygamVTPX.jpg'),
  collage: asset('1FDV7eh_AR8YMK0FX-wk3cZewoeM_NZTtyX5a6Fu90SGrBSujtYzJtiOF5tJlZa7Ag6RJX8RVqJzMuBST-25aAliIT_40cFFlN9uFVp_F1chjnlFseI2SbuUyO6zbdwCObOqTPZsctXxjejoiXh6QTXTSAuR3KLhXb-m5CUxzzri1Jwj6D4VkIS3a1onqHp3.jpg'),
  cameraWide: asset('54f49c9c7633a07bbc183dc5d7ab7d12.jpg'),
  cameraPoster: asset('5d0962c9a39f4963242a24778a4b332c.jpg'),
  cameraTop: asset('OIP.jpg'),
  y2kGreen: asset('Pecn3dmLyNRtp0rgwH9MRdIph5qeSW5-djVPZtQkxI4cso7bVMImh0gggyyT4MkZwGskMCCUsIWDKsR7AHQT25Kc9OBiHBhWV_XuwJJZIKRUijSXejM30HY9Az5tpp6xiNf5KcHTRunrB_CILdS_yLJRp-p8kZNINCwEiHlDLRp4A8WxyWkTFyjx3cuG5Kx0.jpg'),
  cuteSnaps: asset('Screenshot 2026-05-09 025853.png'),
  doodleStrip: asset('Screenshot 2026-05-09 025918.png'),
  previewDigicam: asset('retro cam.jpg'),
  previewVhs: asset('vhs.jpg'),
  previewGrain: asset('film grain.jpg'),
  previewBloom: asset('dreamy bloom.jpg'),
  previewFlash: asset('soft flash.jpg'),
  previewCrt: asset('crt distory.jpg'),
  previewWarm: asset('warm vintag3.jpg'),
  previewSilver: asset('cool silver.jpg'),
  previewPolaroid: asset('faded polaroid.jpg'),
  playlist: [
    asset('im in love.mp3'),
    asset('midnight pretenders.mp3'),
    asset('plastic love.mp3'),
  ],
  shutter: 'https://www.soundjay.com/mechanical/camera-shutter-click-01.mp3',
};

export const assetPhotos = [
  ASSETS.y2kGreen,
  ASSETS.scrapbook,
  ASSETS.collage,
  ASSETS.cameraWide,
  ASSETS.cameraPoster,
  ASSETS.cameraTop,
  ASSETS.cuteSnaps,
  ASSETS.doodleStrip,
];

export const filters = [
  { id: 'digicam', name: 'Retro Digicam', css: 'contrast(1.3) saturate(1.45) brightness(1.08) sepia(0.05)', preview: ASSETS.previewDigicam },
  { id: 'vhs', name: 'VHS', css: 'contrast(1.2) saturate(0.6) hue-rotate(-25deg) blur(0.35px) sepia(0.1)', preview: ASSETS.previewVhs },
  { id: 'grain', name: 'Film Grain', css: 'sepia(0.4) contrast(1.5) brightness(0.9) saturate(1.2) hue-rotate(-10deg)', preview: ASSETS.previewGrain },
  { id: 'bloom', name: 'Dreamy Bloom', css: 'brightness(1.3) saturate(1.35) blur(1.1px) contrast(0.8) sepia(0.05)', preview: ASSETS.previewBloom },
  { id: 'flash', name: 'Soft Flash', css: 'brightness(1.5) contrast(0.8) saturate(1.25) sepia(0.08) blur(0.2px)', preview: ASSETS.previewFlash },
  { id: 'crt', name: 'CRT Distort', css: 'contrast(1.6) saturate(1.5) hue-rotate(20deg) brightness(1.15) sepia(0.05)', preview: ASSETS.previewCrt },
  { id: 'warm', name: 'Warm Vintage', css: 'sepia(0.65) saturate(1.35) contrast(0.7) brightness(1.2) hue-rotate(-15deg)', preview: ASSETS.previewWarm },
  { id: 'silver', name: 'Cool Silver', css: 'grayscale(0.9) contrast(1.5) brightness(1.2) hue-rotate(180deg) saturate(0.8)', preview: ASSETS.previewSilver },
  { id: 'polaroid', name: 'Faded Polaroid', css: 'contrast(0.7) saturate(0.5) brightness(1.3) sepia(0.2) hue-rotate(-5deg)', preview: ASSETS.previewPolaroid },
];

export const frames = [
  { id: 'korean', name: 'Korean Day', tone: 'rose', description: 'Tall strip, glossy pink edge, tiny chrome charms.' },
  { id: 'scrap', name: 'Scrapbook', tone: 'paper', description: 'Layered tape, notes, paper texture, dreamy margin.' },
  { id: 'chrome', name: 'Silver Y2K', tone: 'chrome', description: 'Chrome shell with camera hardware as the frame.' },
  { id: 'magazine', name: 'Magazine', tone: 'editorial', description: 'Fashion editorial blocks, masthead, date stamp.' },
  { id: 'doodle', name: 'Doodle Strip', tone: 'ink', description: 'Hand-drawn marks and sticker-heavy nostalgia.' },
  { id: 'camera', name: 'Camera Frame', tone: 'camera', description: 'Photos placed directly inside a retro digicam body.' },
];

export const stickers = ['good vibes', 'Y2K', '2004', 'no bad days', 'xoxo', 'iconic', 'lovely day', 'PM 04:23', 'sticker1.png', 'sticker2_1.png', 'sticker2_2.png', 'sticker2_3.png', 'sticker2_4.png', 'sticker2_5.png', 'sticker2_6.png', 'sticker2_7.png', 'sticker2_8.png', 'sticker2_9.png', 'sticker2_10.png', 'sticker2_11.png', 'sticker2_12.png', 'sticker2_13.png', 'sticker2_14.png', 'sticker2_15.png', 'sticker2_16.png', 'sticker2_17.png', 'sticker2_18.png', 'sticker2_19.png', 'sticker2_20.png', 'sticker2_21.png', 'sticker2_22.png', 'sticker2_23.png', 'sticker2_24.png', 'sticker2_25.png', 'sticker2_26.png', 'sticker2_27.png', 'sticker2_28.png', 'sticker2_29.png', 'sticker2_30.png', 'sticker2_31.png', 'sticker2_32.png', 'sticker2_33.png', 'sticker2_34.png', 'sticker2_35.png', 'sticker2_36.png', 'sticker2_37.png', 'sticker2_38.png', 'sticker2_39.png', 'sticker2_40.png', 'stickers3_1.png', 'stickers3_2.png', 'stickers3_3.png', 'stickers3_4.png', 'stickers3_5.png', 'stickers3_6.png', 'stickers3_7.png', 'stickers3_8.png', 'stickers3_9.png', 'stickers3_10.png', 'stickers3_11.png', 'stickers3_12.png', 'stickers3_13.png', 'stickers3_14.png', 'stickers3_15.png', 'stickers3_16.png', 'stickers3_17.png', 'stickers3_18.png', 'stickers3_19.png', 'stickers3_20.png', 'stickers3_21.png', 'stickers3_22.png', 'stickers3_23.png', 'stickers3_24.png', 'stickers3_25.png', 'stickers3_26.png', 'stickers3_27.png', 'stickers3_28.png', 'stickers3_29.png', 'stickers3_30.png', 'stickers3_31.png', 'stickers3_32.png', 'stickers3_33.png', 'stickers3_34.png', 'stickers3_35.png', 'stickers3_36.png', 'stickers3_37.png', 'stickers3_38.png', 'stickers3_39.png', 'stickers3_40.png', 'stickers3_41.png', 'stickers3_42.png', 'stickers3_43.png', 'stickers3_44.png', 'stickers3_45.png', 'stickers3_46.png', 'stickers3_47.png', 'stickers3_48.png', 'stickers3_49.png', 'stickers3_50.png', 'stickers3_51.png', 'stickers3_52.png', 'stickers3_53.png', 'stickers3_54.png', 'stickers3_55.png', 'stickers3_56.png', 'stickers3_57.png', 'stickers3_58.png', 'stickers3_59.png', 'stickers3_60.png', 'sticker4_1.png'];

/** URLs worth warming on startup (hero-critical). */
export const PRELOAD_IMAGE_URLS = [
  ASSETS.y2kGreen,
  ASSETS.scrapbook,
  ASSETS.previewDigicam,
];
