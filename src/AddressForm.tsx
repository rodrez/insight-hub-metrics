import React, { useState } from 'react';
import StreetInput from './StreetInput';
import CityInput from './CityInput';
import ZipCodeInput from './ZipCodeInput';

const AddressForm = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const state = 'California';
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form submission logic would go here
    console.log({ street, city, state, zipCode });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StreetInput value={street} onChange={setStreet} />
      <CityInput value={city} onChange={setCity} />
      <div className="form-group">
        <label htmlFor="state" className="block text-gray-700">State</label>
        <input 
          id="state" 
          type="text" 
          value={state} 
          readOnly 
          className="bg-gray-100 border border-gray-300 px-4 py-2 rounded" 
        />
      </div>
      <ZipCodeInput value={zipCode} onChange={setZipCode} />
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Submit
      </button>
    </form>
  );
};

export default AddressForm;