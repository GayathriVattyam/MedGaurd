import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient, { API_ENDPOINTS } from '../config/axiosInstance';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Fetch available symptoms on component mount
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ML_SYMPTOMS);
        setAllSymptoms(response.data.symptoms);
        console.log(`✅ Loaded ${response.data.symptoms.length} symptoms`);
      } catch (err) {
        console.error('Failed to fetch symptoms:', err);
        setError('Failed to load symptoms. Make sure ML API is running.');
      }
    };

    fetchSymptoms();
  }, []);

  // Filter symptoms based on search
  const filteredSymptoms = allSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle symptom selection
  const toggleSymptom = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  // Make prediction
  const handlePredict = async () => {
    if (symptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    if (!token) {
      setError('Please login first to make predictions');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      console.log('🔬 Sending prediction request with symptoms:', symptoms);
      
      const response = await apiClient.post(
        API_ENDPOINTS.PREDICT,
        { symptoms }
      );

      console.log('✅ Prediction received:', response.data);
      console.log('   Disease:', response.data.disease);
      console.log('   Confidence:', response.data.confidence);
      console.log('   Top 3:', response.data.top3);
      
      if (!response.data.success) {
        console.error('⚠️ Response success is false:', response.data.error);
        setError(response.data.error || 'Prediction failed');
        return;
      }
      
      setPrediction(response.data);
      setShowResults(true);
    } catch (err) {
      console.error('❌ Prediction error caught:', err);
      console.error('   Response status:', err.response?.status);
      console.error('   Response data:', err.response?.data);
      console.error('   Error message:', err.message);
      
      setError(err.response?.data?.error || err.message || 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear selections
  const handleClear = () => {
    setSymptoms([]);
    setPrediction(null);
    setError('');
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 20px',
      color: '#333'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '36px', margin: 0, color: '#333' }}>🏥 Symptom Checker</h1>
          <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '16px' }}>
            Select your symptoms to get a disease prediction
          </p>
        </div>

        {/* Main Content - Two Column */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Left - Symptoms Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px' }}>📋 Select Symptoms</h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />

            {/* Symptoms Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              maxHeight: '400px',
              overflowY: 'auto',
              marginBottom: '20px',
              paddingRight: '8px'
            }}>
              {filteredSymptoms.length > 0 ? (
                filteredSymptoms.map((symptom, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSymptom(symptom)}
                    style={{
                      background: symptoms.includes(symptom) ? '#22c55e' : '#f5f5f5',
                      color: symptoms.includes(symptom) ? 'white' : '#333',
                      border: '1px solid #e0e0e0',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    {symptoms.includes(symptom) && '✓ '}
                    {symptom.replace(/_/g, ' ')}
                  </motion.button>
                ))
              ) : (
                <p style={{ color: '#999', gridColumn: '1/-1' }}>No symptoms found</p>
              )}
            </div>

            {/* Selected Summary */}
            {symptoms.length > 0 && (
              <div style={{
                background: '#f9fafb',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <strong style={{ color: '#333' }}>Selected ({symptoms.length}):</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  {symptoms.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#22c55e',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {s.replace(/_/g, ' ')}
                      <button
                        onClick={() => toggleSymptom(s)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: 0
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right - Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              minHeight: '400px'
            }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  border: '1px solid #fecaca'
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            {showResults && prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {/* Disease Card */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Predicted Disease
                  </h3>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '10px'
                  }}>
                    <h2 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>{prediction.disease}</h2>
                    <div style={{
                      background: 'rgba(255,255,255,0.2)',
                      height: '6px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <div
                        style={{
                          background: 'white',
                          height: '100%',
                          width: `${prediction.confidence * 100}%`,
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                      Confidence: {prediction.confidence_percentage}
                    </p>
                  </div>
                </div>

                {/* Top 3 */}
                {prediction.top3 && prediction.top3.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Alternative Predictions
                    </h3>
                    {prediction.top3.map((pred, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#f9fafb',
                          padding: '12px',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          borderLeft: '3px solid #667eea'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: '600', color: '#333' }}>{pred[0]}</span>
                          <span style={{ color: '#666', fontSize: '12px' }}>{(pred[1] * 100).toFixed(1)}%</span>
                        </div>
                        <div style={{ background: '#e5e7eb', height: '4px', borderRadius: '8px', overflow: 'hidden' }}>
                          <div
                            style={{
                              background: '#667eea',
                              height: '100%',
                              width: `${pred[1] * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Medicines */}
                {prediction.medicines && prediction.medicines.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      💊 Recommended Medicines
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {prediction.medicines.map((med, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: '#e0f7ef',
                            color: '#0f5f42',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            border: '1px solid #a7e9d8'
                          }}
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fcd34d',
                  borderLeft: '4px solid #f59e0b',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '15px'
                }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#7c2d12', lineHeight: '1.5' }}>
                    <strong>⚠️ Disclaimer:</strong> This is an AI prediction system. Consult a qualified healthcare provider for proper diagnosis.
                  </p>
                </div>
              </motion.div>
            )}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #e5e7eb',
                  borderTopColor: '#667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ marginTop: '15px', color: '#667eea', fontSize: '14px' }}>Analyzing symptoms...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {!showResults && !loading && !error && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#999' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔬</div>
                <p>Select symptoms to get started</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePredict}
            disabled={loading || symptoms.length === 0}
            style={{
              background: symptoms.length === 0 ? '#cbd5e1' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: symptoms.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? '⏳ Analyzing...' : '🔍 Get Prediction'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            style={{
              background: '#e5e7eb',
              color: '#333',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            🔄 Clear All
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SymptomChecker;
