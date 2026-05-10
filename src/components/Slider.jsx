import React, { memo, useCallback } from 'react';

function SliderComponent({ label, value, setValue, min = 0, max = 100 }) {
  const onChange = useCallback((event) => {
    setValue(Number(event.target.value));
  }, [setValue]);

  return (
    <label className="slider-row">
      <span>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={onChange} />
      <output>{value}</output>
    </label>
  );
}

export const Slider = memo(SliderComponent);
