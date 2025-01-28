import React, { useState, useEffect } from 'react';
import {
    CButton,
    CCol,
    CRow,
    CFormInput,
    CFormRange,
    CCloseButton,
    CFormLabel,
    CInputGroup
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import CircularSlider from './CircularSlider';

const GradientColorPicker = ({ value, onChange }) => {
    const { type = 'linear', degree = 90, colors = [], css } = value || {};

    const [colorStops, setColorStops] = useState(colors);

    useEffect(() => {
        setColorStops(colors);
    }, [colors]);

    const handleChange = (newValue) => {
        onChange && onChange({
            type,
            degree: newValue,
            colors: colorStops,
            css: type === 'linear' ? `linear-gradient(${newValue}deg, ${colorStops.map(stop => `${stop.color} ${stop.stop}%`).join(', ')})` : `radial-gradient(circle, ${colorStops.map(stop => `${stop.color} ${stop.stop}%`).join(', ')})`
        });
    };

    const addColorStop = () => {
        const newColorStop = {
            id: Date.now().toString(),
            color: '#000000ff',
            stop: Math.min(100, colorStops.length > 0 ? colorStops[colorStops.length - 1].stop + 10 : 0)
        };
        const updatedColorStops = [...colorStops, newColorStop];
        setColorStops(updatedColorStops);
        onChange && onChange({
            type,
            degree,
            colors: updatedColorStops,
            css: type === 'linear' ? `linear-gradient(${degree}deg, ${updatedColorStops.map(stop => `${stop.color} ${stop.stop}%`).join(', ')})` : `radial-gradient(circle, ${updatedColorStops.map(stop => `${stop.color} ${stop.stop}%`).join(', ')})`
        });
    };

    const updateColorStop = (id, field, value) => {
        const updatedColorStops = colorStops.map(stop =>
            stop.id === id ? { ...stop, [field]: value } : stop
        );
        setColorStops(updatedColorStops);
        onChange && onChange({
            type,
            degree,
            colors: updatedColorStops,
            css: type === 'linear' ? `linear-gradient(${degree}deg, ${updatedColorStops.map(stop => `${stop.color} ${stop.stop}%`).join(', ')})` : `radial-gradient(circle, ${updatedColorStops.map(stop => `${stop.color} ${stop.stop}%`).join(', ')})`
        });
    };

    const gradientString = type === 'linear'
        ? `linear-gradient(${degree}deg, ${colorStops.map(stop => `${stop.color} ${stop.stop}%`).join(', ')})`
        : `radial-gradient(circle, ${colorStops.map(stop => `${stop.color} ${stop.stop}%`).join(', ')})`;

    return (
        <div className="p-4 border rounded-3 bg-light">
            <CRow className="g-3">
                {/* Gradient Type Selector */}
                <CCol xs={12}>
                    <div className="d-flex gap-2">
                        <CButton
                            color={type === 'linear' ? 'primary' : 'secondary'}
                            onClick={() => onChange({ type: 'linear', degree, colors: colorStops })}
                            variant="outline"
                        >
                            Linear
                        </CButton>
                        <CButton
                            color={type === 'radial' ? 'primary' : 'secondary'}
                            onClick={() => onChange({ type: 'radial', degree, colors: colorStops })}
                            variant="outline"
                        >
                            Radial
                        </CButton>
                    </div>
                </CCol>

                {/* Circular Degree Slider */}
                {type === 'linear' && (
                    <CCol xs={12} className="d-flex justify-content-center">
                        <CircularSlider radius={30} min={0} max={360} initialValue={degree} onChange={handleChange} />
                    </CCol>
                )}

                {/* Gradient Preview */}
                <CCol xs={12}>
                    <div
                        className="rounded-3 border p-2"
                        style={{
                            height: '100px',
                            background: gradientString,
                            position: 'relative'
                        }}
                    >
                        {colorStops.map((stop) => (
                            <div
                                key={stop.id}
                                style={{
                                    position: 'absolute',
                                    left: `${stop.stop}%`,
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: stop.color,
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </CCol>

                {/* Color Stops */}
                <CCol xs={12}>
                    <div className="d-flex flex-column gap-3">
                        {colorStops.map((stop) => (
                            <CRow key={stop.id} className="g-3 align-items-center">
                                <CCol xs={3}>
                                    <CFormInput
                                        type="color"
                                        value={stop.color}
                                        onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                                        className="w-100"
                                    />
                                </CCol>
                                <CCol>
                                    <CFormRange
                                        min="0"
                                        max="100"
                                        value={stop.stop}
                                        onChange={(e) => updateColorStop(stop.id, 'stop', Number(e.target.value))}
                                    />
                                </CCol>
                                <CCol xs={4}>
                                    <CFormInput
                                        min={0}
                                        max={100}
                                        type="number"
                                        value={stop.stop}
                                        onChange={(e) => updateColorStop(stop.id, 'stop', Number(e.target.value))}
                                        className="text-center"
                                    />
                                </CCol>
                                <CCol xs={1}>
                                    <CCloseButton
                                        onClick={() => {
                                            const updatedColorStops = colorStops.filter(s => s.id !== stop.id);
                                            setColorStops(updatedColorStops);
                                            onChange && onChange({
                                                type,
                                                degree,
                                                colors: updatedColorStops
                                            });
                                        }}
                                    />
                                </CCol>
                            </CRow>
                        ))}
                    </div>
                </CCol>

                {/* Add Button */}
                <CCol xs={12}>
                    <CButton
                        color="primary"
                        variant="outline"
                        onClick={addColorStop}
                        className="w-100"
                    >
                        <CIcon icon={cilPlus} className="me-2" />
                        Add Color Stop
                    </CButton>
                </CCol>
            </CRow>
        </div>
    );
};

export default GradientColorPicker;
