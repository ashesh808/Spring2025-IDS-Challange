import React, { useState } from 'react';

export default function PoiForm({ id, poiName, atv, ath, description, pdf, video }) {
    const [formData, setFormData] = useState({
        id: id,
        poiName: poiName,
        atv: atv,
        ath: ath,
        description: description,
        pdf: pdf,
        video: video
    });

    const [formErrors, setFormErrors] = useState({
        id: '',
        poiName: '',
        atv: '',
        ath: '',
        description: '',
        pdf: '',
        video: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        let error = '';

        setFormData({
            ...formData,
            [name]: value
        });

        setFormErrors({
            ...formErrors,
            [name]: '' // clear error for this field on input change
        })
    }

    const handleBlur = (event) => {
        const { name } = event.target;
        let error = '';

        switch (name) {
            case 'poiName':
                if (!formData.poiName) {
                    error = 'POI name is required';
                }
                break;

            case 'ath':
                if (!formData.ath) {
                    error = 'ATH is required';
                } else if (isNaN(formData.ath)) {
                    error = 'ATH must be a number';
                } else if (formData.ath < -360 || formData.ath > 360) {
                    error = 'ATH must be between -360 and 360 degrees';
                }
                break;

            case 'atv':
                if (!formData.atv) {
                    error = 'ATV is required';
                } else if (isNaN(formData.atv)) {
                    error = 'ATV must be a number';
                } else if (formData.atv < -90 || formData.atv > 90) {
                    error = 'ATV must be between -90 and 90 degrees';
                }
                break;

            case 'description':
                if (!formData.description) {
                    error = 'Description is required';
                }
                break;

            case 'pdf':
                if (formData.pdf && formData.pdf.type !== 'application/pdf') {
                    error = 'File must be a PDF';
                }
                break;

            case 'video':
                if (formData.video && !formData.video.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/)) {
                    error = 'Please enter a valid URL for the video';
                }
                break;

            default:
                break;
        }

        setFormErrors({
            ...formErrors,
            [name]: error
        });

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let isValidForm = true;
        const newErrors = { ...formErrors }; // maintain existing errors

        // Validate all fields on submit        
        // Validate POI Name
        if (!formData.poiName) {
            newErrors.poiName = 'POI name is required';
            isValidForm = false;
        }

        // Validate ATH
        if (!formData.ath) {
            newErrors.ath = 'ATH is required';
            isValidForm = false;
        } else if (isNaN(formData.ath)) {
            newErrors.ath = 'ATH must be a number';
            isValidForm = false;
        } else if (formData.ath < -360 || formData.ath > 360) {
            newErrors.ath = 'ATH must be between -360 and 360 degrees';
            isValidForm = false;
        }

        // Validate ATV
        if (!formData.atv) {
            newErrors.atv = 'ATV is required';
            isValidForm = false;
        } else if (isNaN(formData.atv)) {
            newErrors.atv = 'ATV must be a number';
            isValidForm = false;
        } else if (formData.atv < -90 || formData.atv > 90) {
            newErrors.atv = 'ATV must be between -90 and 90 degrees';
            isValidForm = false;
        }

        // Validate Description
        if (!formData.description) {
            newErrors.description = 'Description is required';
            isValidForm = false;
        }

        // Validate PDF (optional field)
        if (formData.pdf && formData.pdf.type !== 'application/pdf') {
            newErrors.pdf = 'File must be a PDF';
            isValidForm = false;
        }

        // Validate Video URL (optional field)
        if (formData.video && !formData.video.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/)) {
            newErrors.video = 'Please enter a valid URL for the video';
            isValidForm = false;
        }

        setFormErrors(newErrors);

        if (isValidForm) {
            // todo: POST request with data
        } else {
           console.log('Form submission failed');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='poiName'>POI Name:</label>
                <input type='text'
                    id='poiName'
                    name='poiName'
                    value={formData.poiName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {formErrors.poiName && <p className="error-message">{formErrors.poiName}</p>}
            </div>

            <div>
                <label htmlFor='atv'>ATV:</label>
                <input type='text'
                    id='atv'
                    name='atv'
                    value={formData.atv}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {formErrors.atv && <p className="error-message">{formErrors.atv}</p>}
            </div>

            <div>
                <label htmlFor='ath'>ATH:</label>
                <input type='number'
                    id='ath'
                    name='ath'
                    value={formData.ath}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {formErrors.ath && <p className="error-message">{formErrors.ath}</p>}
            </div>

            <div>
                <label htmlFor='description'>Description:</label>
                <input type='text'
                    id='description'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {formErrors.description && <p className="error-message">{formErrors.description}</p>}
            </div>

            <div>
                <label htmlFor='pdf'>PDF:</label>
                <input type='file'
                    id='pdf'
                    name='pdf'
                    value={formData.pdf} // todo: may cause issues
                    onChange={(e) => {
                        const file = e.target.files[0];
                        setFormData({
                            ...formData,
                            pdf: file
                        });
                    }}
                    onBlur={handleBlur}
                />
                {formErrors.pdf && <p className="error-message">{formErrors.pdf}</p>}
            </div>

            <div>
                <label htmlFor='video'>Video:</label>
                <input type='url'
                    id='video'
                    name='video'
                    value={formData.video}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {formErrors.video && <p className="error-message">{formErrors.video}</p>}
            </div>
            <button type='submit'>Submit</button>
        </form>
    )




}