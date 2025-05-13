import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import logo from '../assets/images/newspaper.png';
import filter from '../assets/images/setting.png';

function Navbar({ setActiveFilters }) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',       // Comma-separated categories
    language: 'en',     // Comma-separated languages
    country: '',        // Comma-separated countries
    query: ''
  });

  const categoryOptions = [
    { value: 'business', label: 'Business' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'environment', label: 'Environment' },
    { value: 'food', label: 'Food' },
    { value: 'health', label: 'Health' },
    { value: 'politics', label: 'Politics' },
    { value: 'science', label: 'Science' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
    { value: 'top', label: 'Top Stories' },
    { value: 'world', label: 'World' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' }
  ];

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'in', label: 'India' }
  ];

  const handleSelectChange = (selectedOptions, field) => {
    const value = selectedOptions ? selectedOptions.map(opt => opt.value).join(',') : '';
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentValues = (field) => {
    if (!filters[field]) return [];
    return filters[field].split(',')
      .filter(Boolean)
      .map(value => {
        // Find the matching option from the appropriate options array
        const options =
          field === 'category' ? categoryOptions :
            field === 'language' ? languageOptions :
              countryOptions;

        return options.find(opt => opt.value === value);
      })
      .filter(Boolean); // Remove any undefined values
  };

  const handleQueryChange = (e) => {
    setFilters(prev => ({
      ...prev,
      query: e.target.value
    }));
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    setActiveFilters(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: '',
      language: 'en',
      country: '',
      query: ''
    };
    setFilters(defaultFilters);
    setActiveFilters(defaultFilters);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'white',
      zIndex: 1000,
      padding: '10px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div><img src={logo} width={40} alt="News logo" /></div>

      <div
        onClick={() => setShowFilterModal(true)}
        style={{ marginRight: '10px', cursor: 'pointer' }}
      >
        <img src={filter} width={30} alt="News filter" />
      </div>

      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filter News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Categories</Form.Label>
              <Select
                isMulti
                options={categoryOptions}
                value={getCurrentValues('category')}
                onChange={(selected) => handleSelectChange(selected, 'category')}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select categories..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Languages</Form.Label>
              <Select
                isMulti
                options={languageOptions}
                value={getCurrentValues('language')}
                onChange={(selected) => handleSelectChange(selected, 'language')}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select languages..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Countries</Form.Label>
              <Select
                isMulti
                options={countryOptions}
                value={getCurrentValues('country')}
                onChange={(selected) => handleSelectChange(selected, 'country')}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select countries..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Keyword Search</Form.Label>
              <Form.Control
                type="text"
                name="query"
                value={filters.query}
                onChange={handleQueryChange}
                placeholder="Enter keywords..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetFilters}>
            Reset
          </Button>
          <Button variant="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Navbar;