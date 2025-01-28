import React, { useState } from 'react';
import { CForm, CButton, CInputGroup, CFormInput } from '@coreui/react';
import GradientColorPicker from './GradientColorPicker';

const GradientForm = () => {
    const localStorageKey = 'gradients';
    const [gradients, setGradients] = useState(JSON.parse(localStorage.getItem(localStorageKey)) || []);

    const addGradient = () => {
        setGradients([...gradients, {
            name: `Color ${gradients.length + 1}`,
            color: {
                type: 'linear',
                degree: 90,
                colors: [
                    { id: 1, color: '#000000ff', stop: 0 },
                    { id: 2, color: '#ffffff', stop: 100 }
                ],
                css: `linear-gradient(90deg, #000000ff 0%, #ffffff 100%)`
            }
        }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ gradients });
        window.localStorage.setItem(localStorageKey, JSON.stringify(gradients));
        // Submit your form data here
    };

    const updateGradient = (index, field, value) => {
        const updated = [...gradients];
        updated[index][field] = value;
        setGradients(updated);
    };

    return (
        <CForm onSubmit={handleSubmit}>
            {gradients.map((gradient, index) => (
                <div key={index} className="mb-4 p-3 border rounded">
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder="Gradient name"
                            value={gradient.name}
                            onChange={(e) => updateGradient(index, 'name', e.target.value)}
                        />
                        <CButton
                            color="danger"
                            variant="outline"
                            onClick={() => setGradients(gradients.filter((_, i) => i !== index))}
                        >
                            Remove
                        </CButton>
                    </CInputGroup>

                    <GradientColorPicker
                        value={gradient.color}
                        onChange={(color) => updateGradient(index, 'color', color)}
                    />
                </div>
            ))}

            <div className="d-flex gap-2">
                <CButton color="primary" onClick={addGradient} type="button">
                    Add Gradient
                </CButton>
                <CButton color="success" type="submit">
                    Submit Form
                </CButton>
            </div>
        </CForm>
    );
};

export default GradientForm;
