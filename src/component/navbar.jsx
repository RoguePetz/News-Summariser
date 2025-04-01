import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import logo from '../assets/images/newspaper.png';
import filter from '../assets/images/setting.png';

function Navbar({ setActiveFilters }) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    language: 'en',
    country: '',
    query: ''
  });

  const categories = [
    '', 'business', 'entertainment', 'environment', 'food', 
    'health', 'politics', 'science', 'sports', 'technology', 
    'top', 'world'
  ];
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' }
  ];
  
  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
    { code: 'in', name: 'India' }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
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
              <Form.Label>Category</Form.Label>
              <Form.Select 
                name="category" 
                value={filters.category} 
                onChange={handleFilterChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat || 'All Categories'}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Select 
                name="language" 
                value={filters.language} 
                onChange={handleFilterChange}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Select 
                name="country" 
                value={filters.country} 
                onChange={handleFilterChange}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Keyword Search</Form.Label>
              <Form.Control 
                type="text" 
                name="query" 
                value={filters.query} 
                onChange={handleFilterChange}
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