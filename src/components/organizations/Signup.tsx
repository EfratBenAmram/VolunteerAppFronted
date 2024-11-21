import React, { useState } from 'react';

const SingupO: React.FC = () => {
    const [purpose, setPurpose] = useState('');
    const [referencePhones, setReferencePhones] = useState(['', '', '']);
    const [recommendationLetters, setRecommendationLetters] = useState([null, null, null]);
    const [volunteerTypes, setVolunteerTypes] = useState<string[]>([]);

    const handleReferencePhoneChange = (index: number, value: string) => {
        const updatedPhones = [...referencePhones];
        updatedPhones[index] = value;
        setReferencePhones(updatedPhones);
    };

    const handleRecommendationLetterChange = (index: number, file: File | null) => {
        const updatedLetters = [...recommendationLetters];
        // updatedLetters[index] = file;
        setRecommendationLetters(updatedLetters);
    };

    const handleVolunteerTypeChange = (value: string) => {
        setVolunteerTypes(prev => 
            prev.includes(value) ? prev.filter(type => type !== value) : [...prev, value]
        );
    };

    const handleSubmit = () => {
        // Validation and submission logic
        alert('Organization registration successful!');
    };

    return (
        <form className="form">
            <h2>Organization Registration</h2>

            <div className="form-group">
                <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Organization Purpose"
                    required
                />
            </div>

            <div className="form-group">
                {referencePhones.map((phone, index) => (
                    <input
                        key={index}
                        type="tel"
                        value={phone}
                        onChange={(e) => handleReferencePhoneChange(index, e.target.value)}
                        placeholder={`Reference Phone ${index + 1}`}
                        required
                    />
                ))}
            </div>

            <div className="form-group">
                {recommendationLetters.map((_, index) => (
                    <input
                        key={index}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                            handleRecommendationLetterChange(index, e.target.files ? e.target.files[0] : null)
                        }
                        required
                    />
                ))}
            </div>

            {/* <div className="form-group">
                <label>Volunteer Fields:</label>
                <div className="volunteer-types">
                    {['Field 1', 'Field 2', 'Field 3'].map((type) => (
                        <label key={type} className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                checked={volunteerTypes.includes(type)}
                                onChange={() => handleVolunteerTypeChange(type)}
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div> */}

            <div className="button-container">
                <button type="button" className="button" onClick={handleSubmit}>
                    Register Organization
                </button>
            </div>
        </form>
    );
};

export default SingupO;
