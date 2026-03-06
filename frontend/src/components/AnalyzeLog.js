import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

function AnalyzeLog({ onBack }) {
  const [logInput, setLogInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeLog = async () => {
    if (!logInput.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/analyze_log`, {
        log_message: logInput
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing log:', error);
      setResult({ error: 'Failed to connect to API. Make sure backend is running.' });
    }
    setLoading(false);
  };

  return (
    <div style={{
      width: '90%',
      maxWidth: 1100,
      height: 'calc(100vh - 140px)',
      maxHeight: 500,
      margin: '0 auto',
      marginTop: 110,
      background: '#9AD7FD',
      boxShadow: '7px 7px 0px black',
      borderRadius: 5,
      outline: '1px black solid',
      padding: '20px 35px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Header with title and back button */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, flexShrink: 0}}>
        <div style={{color: 'black', fontSize: 26, fontFamily: 'Syne', fontWeight: '600'}}>
          Analyze Verification Log
        </div>
        
        {/* Go Back Button */}
        <div 
          onClick={onBack}
          className="go-back-btn"
          style={{
            padding: '8px 18px',
            background: '#FB5E4C',
            boxShadow: '3px 4px 0px black',
            borderRadius: 5,
            outline: '1px black solid',
            cursor: 'pointer',
            color: 'black',
            fontSize: 16,
            fontFamily: 'Syne'
          }}
        >
          ← Go Back
        </div>
      </div>

      {/* Content */}
      <div style={{display: 'flex', gap: 20, flexWrap: 'wrap', flex: 1, minHeight: 0}}>
        
        {/* Input Area */}
        <div style={{flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column'}}>
          <textarea
            value={logInput}
            onChange={(e) => setLogInput(e.target.value)}
            placeholder="Paste your RTL verification log here...

Example:
[SIM_TIME:2341ns] [ERROR] axi_controller
Memory access out of bounds at address 0xFF12"
            style={{
              width: '100%',
              flex: 1,
              minHeight: 120,
              padding: 12,
              fontSize: 13,
              fontFamily: 'monospace',
              borderRadius: 5,
              border: '2px solid black',
              background: '#F7CC66',
              resize: 'none',
              boxShadow: '4px 4px 0px black'
            }}
          />
          
          <div 
            onClick={analyzeLog}
            className="go-back-btn"
            style={{
              marginTop: 12,
              padding: '10px 25px',
              background: loading ? '#ccc' : '#FD9E51',
              boxShadow: '3px 4px 0px black',
              borderRadius: 5,
              outline: '1px black solid',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-block',
              color: 'black',
              fontSize: 16,
              fontFamily: 'Syne',
              fontWeight: '600',
              alignSelf: 'flex-start'
            }}
          >
            {loading ? 'Analyzing...' : '🔍 Analyze Log'}
          </div>
        </div>

        {/* Results Area */}
        <div style={{
          width: 320,
          background: '#FFB7B6',
          boxShadow: '4px 4px 0px black',
          borderRadius: 5,
          outline: '1px black solid',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflowY: 'auto'
        }}>
          {!result ? (
            <div style={{color: '#666', fontSize: 14, fontFamily: 'Syne', textAlign: 'center', marginTop: 60}}>
              Paste a log and click Analyze to see results
            </div>
          ) : result.error ? (
            <div style={{color: 'red', fontSize: 14, fontFamily: 'Syne'}}>{result.error}</div>
          ) : (
            <>
              <div style={{color: 'black', fontSize: 16, fontFamily: 'Syne', fontWeight: '600', marginBottom: 8, textAlign: 'center'}}>
                Analysis Result
              </div>
              
              <div style={{
                fontSize: 36,
                fontWeight: '700',
                color: result.failure_probability > 0.7 ? '#D32F2F' : result.failure_probability > 0.4 ? '#FF9800' : '#4CAF50',
                textAlign: 'center',
                marginBottom: 3
              }}>
                {(result.failure_probability * 100).toFixed(1)}%
              </div>
              
              <div style={{textAlign: 'center', fontSize: 11, fontFamily: 'Syne', color: '#666', marginBottom: 10}}>
                Failure Probability
              </div>

              <div style={{
                padding: '8px 12px',
                background: result.failure_prediction === 1 ? '#FFCDD2' : '#C8E6C9',
                borderRadius: 5,
                textAlign: 'center',
                fontSize: 13,
                fontFamily: 'Syne',
                fontWeight: '600',
                color: result.failure_prediction === 1 ? '#C62828' : '#2E7D32',
                marginBottom: 10
              }}>
                {result.failure_prediction === 1 ? '🚨 Critical Failure' : '✅ No Critical Failure'}
              </div>

              {/* New Cluster Info Section */}
              {result.cluster_id !== undefined && (
                <div style={{
                  background: '#F7CC66',
                  borderRadius: 5,
                  padding: 10,
                  border: '1px solid black'
                }}>
                  <div style={{fontSize: 12, fontFamily: 'Syne', fontWeight: '600', marginBottom: 6}}>
                    🔍 Cluster Analysis
                  </div>
                  
                  <div style={{fontSize: 11, fontFamily: 'Syne', marginBottom: 4}}>
                    <strong>Bug Type:</strong> {result.bug_type === 'unknown pattern' ? '⚠️ Unknown Pattern' : result.bug_type}
                  </div>
                  
                  <div style={{fontSize: 11, fontFamily: 'Syne', marginBottom: 4}}>
                    <strong>Cluster ID:</strong> {result.cluster_id === -1 ? 'New Pattern' : `#${result.cluster_id}`}
                  </div>
                  
                  <div style={{fontSize: 11, fontFamily: 'Syne'}}>
                    <strong>Confidence:</strong> {(result.cluster_confidence * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyzeLog;
